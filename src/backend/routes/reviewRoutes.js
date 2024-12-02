const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const authenticateToken = require('../middlewares/authenticateToken')
const checkOwnership = require('../middlewares/checkOwnership')
const isReviewOwner = checkOwnership("arvostelut")

// Get all reviews for a specific movie
router.get('/:id', reviewController.getReviewsByMovieId)

// Get all reviews by a specific member
router.get('/jasen/:id', reviewController.getReviewsByMemberId)

// Add a review
router.post('/', authenticateToken, reviewController.addReview)

// Delete a review (owned by the authenticated user)
router.delete('/:id', authenticateToken, isReviewOwner, reviewController.deleteReview)

// Increment the like count for a review
router.post('/:id/like', reviewController.likeReview)

module.exports = router
