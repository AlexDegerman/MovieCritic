const pool = require('../config/db') 

// Get all rows from Elokuva and Movies with search support
const getMovies = async (req, res) => {
  const { page = 1, limit = 21, search = '', genre = '', seed = Date.now() } = req.query
  const offset = (page - 1) * limit
  try {
    let whereClause = '1=1'
    const params = []

    if (search) {
      whereClause += ` AND (
        COALESCE(e.otsikko, '') LIKE ? OR 
        COALESCE(m.title, '') LIKE ?
      )`
      params.push(`%${search}%`, `%${search}%`)
    }

    if (genre) {
      whereClause += ` AND (
        COALESCE(e.lajityypit, '') LIKE ? OR 
        COALESCE(m.genres, '') LIKE ?
      )`
      params.push(`%${genre}%`, `%${genre}%`)
    }

    const seedClause = `RAND(${String(seed)})`

    const countQuery = `
      SELECT COUNT(DISTINCT COALESCE(e.id, m.id)) as total_count
      FROM elokuva e
      LEFT JOIN movie m ON e.tmdb_id = m.tmdb_id
      WHERE ${whereClause}
    `
    const [countRows] = await pool.execute(countQuery, params)
    const totalCount = countRows[0].total_count

    const mainQuery = `
      SELECT DISTINCT
        e.id as fi_id,
        e.tmdb_id,
        e.otsikko,
        e.lajityypit,
        e.valmistumisvuosi,
        e.pituus,
        e.ohjaaja,
        e.kasikirjoittajat,
        e.paanayttelijat,
        e.alkuperainen_kieli,
        e.kuvaus,
        e.kuvan_polku,
        e.iskulause,
        m.id as en_id,
        m.title,
        m.genres,
        m.release_date,
        m.runtime,
        m.director,
        m.writers,
        m.main_actors,
        m.original_language,
        m.overview,
        m.poster_path,
        m.tagline
      FROM elokuva e
      LEFT JOIN movie m ON e.tmdb_id = m.tmdb_id
      WHERE ${whereClause}
      ORDER BY ${seedClause}
      LIMIT ? OFFSET ?
    `
    const queryParams = [
      ...params,
      String(parseInt(limit, 10)),
      String(parseInt(offset, 10))
    ]
    const [rows] = await pool.execute(mainQuery, queryParams)
    res.status(200).json({
      movies: rows,
      totalCount: totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      seed: seed,
    })

  } catch (error) {
    res.status(500).json({ error: 'Error in query: ' + error.message })
  }
}

// Get specific movie
const getMovieById = async (req, res) => {
  const movieId = req.params.id
  try {
    const [rows] = await pool.execute(`
      SELECT
        e.id as fi_id,
        e.tmdb_id,
        e.otsikko,
        e.lajityypit,
        e.valmistumisvuosi,
        e.pituus,
        e.ohjaaja,
        e.kasikirjoittajat,
        e.paanayttelijat,
        e.alkuperainen_kieli,
        e.kuvaus,
        e.kuvan_polku,
        e.iskulause,
        m.id as en_id,
        m.title,
        m.genres,
        m.release_date,
        m.runtime,
        m.director,
        m.writers,
        m.main_actors,
        m.original_language,
        m.overview,
        m.poster_path,
        m.tagline
      FROM elokuva e
      LEFT JOIN movie m ON e.tmdb_id = m.tmdb_id
      WHERE e.id = ?
    `, [movieId])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' })
    }
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error in query: ' + error.message })
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
        kuva,
      } = req.body

      await pool.execute(
        `INSERT INTO elokuva (
          otsikko, 
          lajityypit, 
          valmistumisvuosi, 
          pituus, 
          ohjaaja, 
          kasikirjoittajat, 
          paanayttelijat, 
          alkuperainen_kieli, 
          kuvaus, 
          kuvan_polku, 
          iskulause
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
        [
          otsikko,
          lajityypit,
          valmistumisvuosi,
          pituus,
          ohjaaja,
          kasikirjoittajat,
          paanayttelijat,
          kieli,
          kuvaus,
          kuva,
        ]
      )
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
        poster_path,
      } = req.body

      await pool.execute(
        `INSERT INTO movie (
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
          tagline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
        [
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
        ]
      )
    }

    res.status(201).json({
      message: selectedLanguage === 'fi' 
        ? 'Elokuva lisätty onnistuneesti' 
        : 'Movie added successfully',
    })
  } catch (error) {
    res.status(500).json({
      error: selectedLanguage === 'fi'
        ? 'Virhe elokuvan lisäämisessä: ' + error.message
        : 'Error adding movie: ' + error.message,
    })
  }
}

// Delete specific movie
const deleteMovie = async (req, res) => {
  try {
    await pool.execute('DELETE FROM elokuva WHERE id = ?', [req.params.id])
    res.status(200).json({ message: 'Movie deleted successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting movie: ' + error.message })
  }
}

module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  deleteMovie
}
