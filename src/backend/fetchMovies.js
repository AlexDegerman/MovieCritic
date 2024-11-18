require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql2/promise')

const config = {
    tmdb: {
        apiKey: process.env.TMDB_API_KEY,
        baseUrl: "https://api.themoviedb.org/3",
        imageUrl: "https://image.tmdb.org/t/p/w500",
        rateLimit: {
            maxRequests: 40,
            timeWindow: 10000 
        }
    },
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
}

const createRateLimiter = () => {
    const requests = []
    
    const waitForToken = async () => {
        const now = Date.now()
        while (requests.length && requests[0] <= now - config.tmdb.rateLimit.timeWindow) {
            requests.shift()
        }

        if (requests.length >= config.tmdb.rateLimit.maxRequests) {
            const waitTime = requests[0] + config.tmdb.rateLimit.timeWindow - now
            await new Promise(resolve => setTimeout(resolve, waitTime))
            return waitForToken()
        }

        requests.push(now)
        return true
    }

    return { waitForToken }
}

const createApiClient = (language) => {
    const rateLimiter = createRateLimiter()
    
    const client = axios.create({
        baseURL: config.tmdb.baseUrl,
        params: {
            api_key: config.tmdb.apiKey,
            language: language
        }
    })

    client.interceptors.request.use(async (config) => {
        await rateLimiter.waitForToken()
        return config
    })

    client.interceptors.response.use(
        response => response,
        async error => {
            if (error.response?.status === 429) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '1')
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
                return client(error.config)
            }
            throw error
        }
    )

    return client
}

const fetchMovieDetails = async (movieId) => {
    const englishClient = createApiClient('en-US')
    const finnishClient = createApiClient('fi-FI')
    
    try {
        const [englishData, finnishData, credits] = await Promise.all([
            englishClient.get(`/movie/${movieId}`),
            finnishClient.get(`/movie/${movieId}`),
            englishClient.get(`/movie/${movieId}/credits`)
        ])
        
        return {
            englishDetails: englishData.data,
            finnishDetails: finnishData.data,
            credits: credits.data
        }
    } catch (error) {
        if (error.response?.status === 429) {
            console.log(`Rate limit hit for movie ${movieId}, waiting and retrying...`)
            throw error
        }
        throw new Error(`Failed to fetch movie details for ID ${movieId}: ${error.message}`)
    }
}

const processMovieData = (movieData) => {
    const { englishDetails, finnishDetails, credits } = movieData
    
    const director = credits.crew.find(member => member.job === "Director")?.name || ""
    const writers = credits.crew
        .filter(member => ["Writer", "Screenplay"].includes(member.job))
        .map(writer => writer.name)
        .join(", ")
    const mainActors = credits.cast
        .slice(0, 3)
        .map(actor => actor.name)
        .join(", ")

    const englishMovie = {
        tmdb_id: englishDetails.id,
        title: englishDetails.title,
        genres: englishDetails.genres.map(genre => genre.name).join(", "),
        release_date: englishDetails.release_date,
        runtime: englishDetails.runtime,
        director,
        writers,
        main_actors: mainActors,
        original_language: englishDetails.original_language,
        overview: englishDetails.overview,
        poster_path: englishDetails.poster_path ? `${config.tmdb.imageUrl}${englishDetails.poster_path}` : null,
        tagline: englishDetails.tagline || null
    }

    const finnishMovie = {
        tmdb_id: finnishDetails.id,
        otsikko: finnishDetails.title,
        lajityypit: finnishDetails.genres.map(genre => genre.name).join(", "),
        valmistumisvuosi: new Date(finnishDetails.release_date).getFullYear(),
        pituus: finnishDetails.runtime,
        ohjaaja: director,
        kasikirjoittajat: writers,
        paanayttelijat: mainActors,
        alkuperainen_kieli: finnishDetails.original_language,
        kuvaus: finnishDetails.overview,
        kuvan_polku: finnishDetails.poster_path ? `${config.tmdb.imageUrl}${finnishDetails.poster_path}` : null,
        iskulause: finnishDetails.tagline || null
    }

    return { englishMovie, finnishMovie }
}

const insertMovie = async (connection, { englishMovie, finnishMovie }) => {
    try {
        await connection.execute(`
            INSERT INTO movie (
                tmdb_id, title, genres, release_date, runtime,
                director, writers, main_actors, original_language,
                overview, poster_path, tagline
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            englishMovie.tmdb_id,
            englishMovie.title,
            englishMovie.genres,
            englishMovie.release_date,
            englishMovie.runtime,
            englishMovie.director,
            englishMovie.writers,
            englishMovie.main_actors,
            englishMovie.original_language,
            englishMovie.overview,
            englishMovie.poster_path,
            englishMovie.tagline
        ])

        await connection.execute(`
            INSERT INTO elokuva (
                tmdb_id, otsikko, lajityypit, valmistumisvuosi,
                pituus, ohjaaja, kasikirjoittajat, paanayttelijat,
                alkuperainen_kieli, kuvaus, kuvan_polku, iskulause
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            finnishMovie.tmdb_id,
            finnishMovie.otsikko,
            finnishMovie.lajityypit,
            finnishMovie.valmistumisvuosi,
            finnishMovie.pituus,
            finnishMovie.ohjaaja,
            finnishMovie.kasikirjoittajat,
            finnishMovie.paanayttelijat,
            finnishMovie.alkuperainen_kieli,
            finnishMovie.kuvaus,
            finnishMovie.kuvan_polku,
            finnishMovie.iskulause
        ])

        console.log(`Successfully inserted movie: ${englishMovie.title} / ${finnishMovie.otsikko}`)
    } catch (error) {
        throw new Error(`Failed to insert movie: ${error.message}`)
    }
}

const discoverMovies = async (englishClient, finnishClient, page = 1) => {
    try {
        const [englishData, finnishData] = await Promise.all([
            englishClient.get('/discover/movie', {
                params: {
                    page,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 1000,
                    with_original_language: 'en'
                }
            }),
            finnishClient.get('/discover/movie', {
                params: {
                    page,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 1000,
                    with_original_language: 'en'
                }
            })
        ])
        
        const finnishTitlesMap = new Map(
            finnishData.data.results.map(movie => [movie.id, movie])
        )

        const results = englishData.data.results.map(englishMovie => ({
            ...englishMovie,
            finnishData: finnishTitlesMap.get(englishMovie.id)
        }))

        return {
            ...englishData.data,
            results
        }
    } catch (error) {
        if (error.response?.status === 429) {
            console.log(`Rate limit hit on page ${page}, waiting and retrying...`)
            throw error
        }
        throw new Error(`Failed to discover movies on page ${page}: ${error.message}`)
    }
}

const chunkArray = (array, chunkSize) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}


const main = async () => {
    const options = {
        maxMovies: 8000,
        batchSize: 5
    }
    
    const { maxMovies, batchSize } = options
    const englishClient = createApiClient('en-US')
    const finnishClient = createApiClient('fi-FI')
    let connection = null
    let processedCount = 0
    let failedCount = 0

    try {
        validateEnvironment()
        connection = await createDbConnection()

        const totalPages = Math.min(Math.ceil(maxMovies / 20), 500)
        console.log(`Will fetch up to ${maxMovies} movies across ${totalPages} pages`)

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            try {
                console.log(`\nFetching page ${currentPage} of ${totalPages}...`)
                const discoveredMovies = await discoverMovies(englishClient, finnishClient, currentPage)
                const movieBatches = chunkArray(discoveredMovies.results, batchSize)

                for (const batch of movieBatches) {
                    if (processedCount >= maxMovies) break

                    const promises = batch.map(async (movie) => {
                        try {
                            console.log(`Starting to process: ${movie.title} (ID: ${movie.id})`)
                            const movieDetails = await fetchMovieDetails(movie.id)
                            const processedData = processMovieData(movieDetails)
                            await insertMovie(connection, processedData)
                            processedCount++
                            console.log(`✓ Completed: ${movie.title} / ${movie.finnishData.title}`)
                            return true
                        } catch (error) {
                            failedCount++
                            console.error(`✗ Failed to process ${movie.title}:`, error.message)
                            return false
                        }
                    })

                    await Promise.all(promises)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }

                console.log(`\nProgress: ${processedCount} processed, ${failedCount} failed`)
                
                if (processedCount >= maxMovies) break
            } catch (error) {
                console.error(`Failed to process page ${currentPage}:`, error.message)
                continue
            }
        }

        console.log(`\nFinal Results:`)
        console.log(`Successfully processed: ${processedCount} movies`)
        console.log(`Failed to process: ${failedCount} movies`)

    } catch (error) {
        console.error('Application error:', error.message)
    } finally {
        if (connection) {
            await connection.end()
            console.log('Database connection closed')
        }
    }
}

const validateEnvironment = () => {
    const requiredEnvVars = ['TMDB_API_KEY', 'DB_HOST', 'DB_USER', 'DB_NAME']
    const missing = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
}

const createDbConnection = async () => {
    try {
        const connection = await mysql.createConnection(config.db)
        console.log('Connected to database successfully')
        return connection
    } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`)
    }
}

main().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})