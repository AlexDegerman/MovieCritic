const pool = require('../config/db') 

// Controller for managing movie reviews, including adding, deleting, liking, and fetching reviews by member or movie

// Get all reviews by a specific member
const getReviewsByMemberId = async (req, res) => {
  const memberid = req.params.id
  try {
    const [rows] = await pool.execute('SELECT * FROM arvostelut WHERE jasenid = ?', [memberid])
    res.status(200).json(rows)
  } catch {
    res.status(500).json({ error: 'Error in query' })
  }
}

// Add a review
const addReview = async (req, res) => {
  const { elokuvaid, jasenid, otsikko, sisalto, tahdet, nimimerkki, elokuvanOtsikko, elokuvanTitle, tmdb_id } = req.body
  try {
    await pool.execute(
      'INSERT INTO arvostelut (elokuvaid, jasenid, otsikko, sisalto, tahdet, nimimerkki, luotuaika, elokuvanOtsikko, elokuvanTitle, tmdb_id) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
      [elokuvaid, jasenid, otsikko, sisalto, tahdet, nimimerkki, elokuvanOtsikko, elokuvanTitle, tmdb_id]
    )
    res.status(201).json({ message: 'Review added successfully' })
  } catch {
    res.status(500).json({ error: 'Error adding review' })
  }
}

// Delete own review
const deleteReview = async (req, res) => {
  try {
    await pool.execute('DELETE FROM arvostelut WHERE id = ?', [req.params.id])
    res.status(200).json({ message: 'Review deleted successfully!' })
  } catch {
    res.status(500).json({ error: 'Error deleting review' })
  }
}

// Increment the like count for a review
const likeReview = async (req, res) => {
  const reviewId = req.params.id

  try {
    const [result] = await pool.execute(
      'UPDATE arvostelut SET tykkaykset = tykkaykset + 1 WHERE id = ?',
      [reviewId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' })
    }

    res.status(200).json({ message: 'Like added successfully' })
  } catch {
    res.status(500).json({ error: 'Error updating like count' })
  }
}

// Get all reviews from a movie
const getReviewsByMovieId = async (req, res) => {
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
  } catch {
    res.status(500).json({ error: 'Error in query' })
  }
}

module.exports = {
  getReviewsByMemberId,
  addReview,
  deleteReview,
  likeReview,
  getReviewsByMovieId
}
