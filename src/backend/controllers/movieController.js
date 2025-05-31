const { Op } = require('sequelize')
const db = require('../models')

// Controller for managing movie data, including fetching, adding, and deleting movies with search functionality

// Get all movies with search support
const getMovies = async (req, res) => {
  const { page = 1, limit = 21, search = '', genre = '', seed = Date.now() } = req.query
  const offset = (page - 1) * limit
  
  try {
    const whereConditions = []
    
    if (search) {
      whereConditions.push({
        [Op.or]: [
          { otsikko: { [Op.like]: `%${search}%` } },
          { '$movie.title$': { [Op.like]: `%${search}%` } }
        ]
      })
    }

    if (genre) {
      whereConditions.push({
        [Op.or]: [
          { lajityypit: { [Op.like]: `%${genre}%` } },
          { '$movie.genres$': { [Op.like]: `%${genre}%` } }
        ]
      })
    }

    const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

    const totalCount = await db.elokuva.count({
      include: [{
        model: db.movie,
        as: 'movie',
        required: false
      }],
      where: whereClause,
      distinct: true,
      col: 'id'
    })

    const movies = await db.elokuva.findAll({
      include: [{
        model: db.movie,
        as: 'movie',
        required: false
      }],
      where: whereClause,
      order: db.Sequelize.literal(`RAND(${seed})`),
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: true,
      nest: true
    })

    const transformedMovies = movies.map(movie => ({
      fi_id: movie.id,
      tmdb_id: movie.tmdb_id,
      otsikko: movie.otsikko,
      lajityypit: movie.lajityypit,
      valmistumisvuosi: movie.valmistumisvuosi,
      pituus: movie.pituus,
      ohjaaja: movie.ohjaaja,
      kasikirjoittajat: movie.kasikirjoittajat,
      paanayttelijat: movie.paanayttelijat,
      alkuperainen_kieli: movie.alkuperainen_kieli,
      kuvaus: movie.kuvaus,
      kuvan_polku: movie.kuvan_polku,
      iskulause: movie.iskulause,
      en_id: movie.movie?.id || null,
      title: movie.movie?.title || null,
      genres: movie.movie?.genres || null,
      release_date: movie.movie?.release_date || null,
      runtime: movie.movie?.runtime || null,
      director: movie.movie?.director || null,
      writers: movie.movie?.writers || null,
      main_actors: movie.movie?.main_actors || null,
      original_language: movie.movie?.original_language || null,
      overview: movie.movie?.overview || null,
      poster_path: movie.movie?.poster_path || null,
      tagline: movie.movie?.tagline || null
    }))

    res.status(200).json({
      movies: transformedMovies,
      totalCount: totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      seed: seed,
    })

  } catch (error) {
    console.error('Error in getMovies:', error)
    res.status(500).json({ error: 'Error in query' })
  }
}

// Get specific movie
const getMovieById = async (req, res) => {
  const movieId = req.params.id
  
  try {
    const movie = await db.elokuva.findOne({
      where: { id: movieId },
      include: [{
        model: db.movie,
        as: 'movie',
        required: false
      }],
      raw: true,
      nest: true
    })
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    const transformedMovie = {
      fi_id: movie.id,
      tmdb_id: movie.tmdb_id,
      otsikko: movie.otsikko,
      lajityypit: movie.lajityypit,
      valmistumisvuosi: movie.valmistumisvuosi,
      pituus: movie.pituus,
      ohjaaja: movie.ohjaaja,
      kasikirjoittajat: movie.kasikirjoittajat,
      paanayttelijat: movie.paanayttelijat,
      alkuperainen_kieli: movie.alkuperainen_kieli,
      kuvaus: movie.kuvaus,
      kuvan_polku: movie.kuvan_polku,
      iskulause: movie.iskulause,
      en_id: movie.movie?.id || null,
      title: movie.movie?.title || null,
      genres: movie.movie?.genres || null,
      release_date: movie.movie?.release_date || null,
      runtime: movie.movie?.runtime || null,
      director: movie.movie?.director || null,
      writers: movie.movie?.writers || null,
      main_actors: movie.movie?.main_actors || null,
      original_language: movie.movie?.original_language || null,
      overview: movie.movie?.overview || null,
      poster_path: movie.movie?.poster_path || null,
      tagline: movie.movie?.tagline || null
    }

    res.status(200).json(transformedMovie)
  } catch (error) {
    console.error('Error in getMovieById:', error)
    res.status(500).json({ error: 'Error in query' })
  }
}

// Add a movie
const addMovie = async (req, res) => {
  const { selectedLanguage } = req.body
  
  try {
    if (selectedLanguage === 'fi') {
      const {
        otsikko, 
        lajityypit, 
        valmistumisvuosi, 
        pituus, 
        ohjaaja, 
        kasikirjoittajat, 
        paanayttelijat, 
        kieli,
        kuvaus,
        kuva
      } = req.body

      await db.elokuva.create({
        otsikko,
        lajityypit,
        valmistumisvuosi,
        pituus,
        ohjaaja,
        kasikirjoittajat,
        paanayttelijat,
        alkuperainen_kieli: kieli,
        kuvaus,
        kuvan_polku: kuva,
        iskulause: null
      })
    } else if (selectedLanguage === 'en') {
      const {
        title,
        genres,
        release_date,
        runtime,
        director,
        writers,
        main_actors,
        original_language,
        overview,
        poster_path
      } = req.body

      await db.movie.create({
        title,
        genres,
        release_date,
        runtime,
        director,
        writers,
        main_actors,
        original_language,
        overview,
        poster_path,
        tagline: null
      })
    }

    res.status(201).json({
      message: selectedLanguage === 'fi' 
        ? 'Elokuva lisätty onnistuneesti' 
        : 'Movie added successfully',
    })
  } catch (error) {
    console.error('Error in addMovie:', error)
    res.status(500).json({
      error: selectedLanguage === 'fi'
        ? 'Virhe elokuvan lisäämisessä'
        : 'Error adding movie' 
    })
  }
}

// Delete specific movie
const deleteMovie = async (req, res) => {
  try {
    const deleted = await db.elokuva.destroy({
      where: { id: req.params.id }
    })

    if (deleted === 0) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    res.status(200).json({ message: 'Movie deleted successfully!' })
  } catch (error) {
    console.error('Error in deleteMovie:', error)
    res.status(500).json({ error: 'Error deleting movie' })
  }
}

module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  deleteMovie
}