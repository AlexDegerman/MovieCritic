const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware to parse incoming JSON and URL encoded data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Middleware to allow frontend to interact with backend
app.use(cors())
// Middleware to manage movie image upload
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Connect to MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) return res.status(401).json({ error: 'Token missing'})
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid token'})
  }
}


const checkOwnership = (tableName) => {
  return async (req, res, next) => {
    try {
      const resourceId = parseInt(req.params.id)
      const authenticatedUserId = req.user.id

      if (tableName === 'jasen') {
        if (resourceId !== authenticatedUserId) {
          return res.status(403).json({ 
            error: 'Unauthorized: You can only modify your own profile' 
          })
        }
        
        const [rows] = await pool.execute(
          'SELECT id FROM jasen WHERE id = ?',
          [resourceId]
        )

        if (rows.length === 0) {
          return res.status(404).json({ error: 'Profile not found' })
        }
      } 
      else {
        const [rows] = await pool.execute(
          `SELECT jasenid FROM ${tableName} WHERE id = ?`,
          [resourceId]
        )
        if (rows.length === 0) {
          return res.status(404).json({ 
            error: `${tableName} not found` 
          })
        }

        if (rows[0].jasenid !== authenticatedUserId) {
          return res.status(403).json({ 
            error: `Unauthorized: You can only modify your own ${tableName}` 
          })
        }
      }

      next()
    } catch {
      res.status(500).json({ error: 'Server error' })
    }
  }
}

const isProfileOwner = checkOwnership('jasen')
const isReviewOwner = checkOwnership('arvostelut')

// Routes
// Member login
app.post('/api/login', async (req, res) => {
  const { sahkopostiosoite, salasana } = req.body
  try {
    const [rows] = await pool.execute('SELECT * FROM jasen WHERE sahkopostiosoite = ?', [sahkopostiosoite])
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid email or password' })

    const member = rows[0]
    const validPassword = await bcrypt.compare(salasana, member.salasana)
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' })

    const memberToken = { id: member.id, sahkopostiosoite: member.sahkopostiosoite }
    const token = jwt.sign(memberToken, process.env.SECRET, { expiresIn: '24h' })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error.message })
  }
})

// Add Member
app.post('/api/jasen', authenticateToken, async (req, res) => {
  const { sahkopostiosoite, salasana, nimimerkki, liittymispaiva } = req.body
  try {
    const hashedPassword = await bcrypt.hash(salasana, 10)
    await pool.execute(
      'INSERT INTO jasen (sahkopostiosoite, salasana, nimimerkki, liittymispaiva) VALUES (?, ?, ?, ?)',
      [sahkopostiosoite, hashedPassword, nimimerkki, liittymispaiva]
    )
    res.status(201).json({ message: 'Member added successfully!' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Nickname already exists. Please choose a different one.' })
    }
    res.status(500).json({ error: 'Error adding member: ' + error.message })
  }
})

// Get specific member
app.get('/api/jasen/:id', async (req, res) => {
  const memberId = req.params.id
  try {
    const [rows] = await pool.execute('SELECT * FROM jasen WHERE id = ?', [memberId])
    if (rows.length === 0) return res.status(404).json({ message: 'The member’s page is unavailable. It might have been deleted or the link is incorrect.' })
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error in member search: ' + error.message })
  }
})

// Update specific member's profile details
app.put('/api/jasen/:id', authenticateToken, async (req, res) => {
  const memberId = req.params.id
  const { nimimerkki, sukupuoli, paikkakunta, harrastukset, suosikkilajityypit, suosikkifilmit, omakuvaus } = req.body
  try {
    await pool.execute(
      'UPDATE jasen SET nimimerkki = ?, sukupuoli = ?, paikkakunta = ?, harrastukset = ?, suosikkilajityypit = ?, suosikkifilmit = ?, omakuvaus = ? WHERE id = ?',
      [nimimerkki, sukupuoli, paikkakunta, harrastukset, suosikkilajityypit, suosikkifilmit, omakuvaus, memberId]
    )
    res.status(200).json({ message: 'Profile details updated successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile details: ' + error.message })
  }
})

// Get all rows from Jasen
app.get('/api/jasen', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM jasen')
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Error in query: ' + error.message })
  }
})

// Delete own account
app.delete('/api/jasen/:id', authenticateToken, isProfileOwner, async (req, res) => {
  try {
    await pool.execute('DELETE FROM jasen WHERE id = ?', [req.params.id])
    res.status(200).json({ message: 'Account deleted successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting profile: ' + error.message })
  }
})

//Change password
app.put('/api/jasen/:id/change-password', authenticateToken, isProfileOwner, async (req, res) => {
  const memberId = req.params.id
  const { currentPassword, newPassword } = req.body

  try {
    const [rows] = await pool.execute('SELECT salasana FROM jasen WHERE id = ?', [memberId])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, rows[0].salasana)
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await pool.execute('UPDATE jasen SET salasana = ? WHERE id = ?', [hashedNewPassword, memberId])

    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error changing password: ' + error.message })
  }
})

// Get all rows from Elokuva and/or Movies with search support
app.get('/api/elokuva', async (req, res) => {
  const {
    page = 1,
    limit = 51,
    search = '',
    genre = '',
    seed = Date.now()
  } = req.query
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

    const seedClause = `RAND(${seed})`

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

    const queryParams = [...params, parseInt(limit), offset]
    const [rows] = await pool.execute(mainQuery, queryParams)

    res.status(200).json({
      movies: rows,
      totalCount: totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      seed: seed
    })
  } catch (error) {
    res.status(500).json({ error: 'Error in query: ' + error.message })
  }
})

// Get specific movie
app.get('/api/elokuva/:id', async (req, res) => {
  const movieId = req.params.id
  try {
    const [rows] = await pool.execute(
      `SELECT
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
})


// Add a movie
app.post('/api/elokuva', authenticateToken, async (req, res) => {
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
        : 'Movie added successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: selectedLanguage === 'fi'
        ? 'Virhe elokuvan lisäämisessä: ' + error.message
        : 'Error adding movie: ' + error.message
    })
  }
})

//Delete specific movie
app.delete('/api/elokuva/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM elokuva WHERE id = ?', [req.params.id])
    res.status(200).json({ message: 'Movie deleted successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting movie: ' + error.message })
  }
})

// Get all reviews from a movie
app.get('/api/arvostelut/:id', async (req, res) => {
  const elokuvaid = req.params.id
  try {
    const [rows] = await pool.execute(`
      SELECT 
        arvostelut.*,
        CASE 
          WHEN jasen.id IS NULL THEN 'Deleted User'
          ELSE arvostelut.nimimerkki 
        END AS displayed_nimimerkki
      FROM arvostelut
      LEFT JOIN jasen ON arvostelut.jasenid = jasen.id
      WHERE arvostelut.elokuvaid = ?
    `, [elokuvaid])
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Error in query: ' + error.message })
  }
})

//Get all reviews from a specific member
app.get('/api/jasen/:id/arvostelut', async (req, res) => {
  const memberid = req.params.id
  try {
    const [rows] = await pool.execute('SELECT * FROM arvostelut WHERE jasenid = ?', [memberid])
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Error in query: ' + error.message })
  }
})

// Add a review
app.post('/api/arvostelut', authenticateToken, async (req, res) => {
  const { elokuvaid, jasenid, otsikko, sisalto, tahdet, nimimerkki, luotuaika, elokuvanOtsikko, elokuvanTitle, tmdb_id } = req.body

  try {
    await pool.execute(
      'INSERT INTO arvostelut (elokuvaid, jasenid, otsikko, sisalto, tahdet, nimimerkki, luotuaika, elokuvanOtsikko, elokuvanTitle, tmdb_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [elokuvaid, jasenid, otsikko, sisalto, tahdet, nimimerkki, luotuaika, elokuvanOtsikko, elokuvanTitle, tmdb_id]
    )
    res.status(201).json({ message: 'Review added successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error adding review: ' + error.message })
  }
})

//Delete own review
app.delete('/api/arvostelut/:id', authenticateToken, isReviewOwner, async (req, res) => {
  try {
    await pool.execute('DELETE FROM arvostelut WHERE id = ?', [req.params.id])
    res.status(200).json({ message: 'Review deleted successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting review: ' + error.message })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port + ${PORT}`)
})






