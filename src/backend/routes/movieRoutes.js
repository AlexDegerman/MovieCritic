const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController')
const authenticateToken = require('../middlewares/authenticateToken')

// Get all movies with search support
router.get('/', movieController.getMovies)

// Get specific movie
router.get('/:id', movieController.getMovieById)

// Add a movie
router.post('/', authenticateToken, movieController.addMovie)

// Delete specific movie
router.delete('/:id', authenticateToken, movieController.deleteMovie)

module.exports = router
