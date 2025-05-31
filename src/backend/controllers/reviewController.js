const db = require('../models')
const { Sequelize } = require('sequelize')

// Controller for managing movie reviews, including adding, deleting, liking, and fetching reviews by member or movie

// Get all reviews by a specific member
const getReviewsByMemberId = async (req, res) => {
  const memberId = req.params.id

  try {
    const reviews = await db.arvostelut.findAll({
      where: { jasenid: memberId }
    })

    res.status(200).json(reviews)
  } catch (error) {
    console.error('Error in getReviewsByMemberId:', error)
    res.status(500).json({ error: 'Error in query' })
  }
}

// Add a review
const addReview = async (req, res) => {
  const {
    elokuvaid,
    jasenid,
    otsikko,
    sisalto,
    tahdet,
    nimimerkki,
    elokuvanOtsikko,
    elokuvanTitle,
    tmdb_id
  } = req.body

  try {
    await db.arvostelut.create({
      elokuvaid,
      jasenid,
      otsikko,
      sisalto,
      tahdet,
      nimimerkki,
      luotuaika: new Date(),
      elokuvanOtsikko,
      elokuvanTitle,
      tmdb_id
    })

    res.status(201).json({ message: 'Review added successfully' })
  } catch (error) {
    console.error('Error adding review:', error)
    res.status(500).json({ error: 'Error adding review' })
  }
}

// Delete own review
const deleteReview = async (req, res) => {
  const reviewId = req.params.id

  try {
    const deletedRowsCount = await db.arvostelut.destroy({
      where: { id: reviewId }
    })

    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Review not found' })
    }

    res.status(200).json({ message: 'Review deleted successfully!' })
  } catch (error) {
    console.error('Error deleting review:', error)
    res.status(500).json({ error: 'Error deleting review' })
  }
}

// Increment the like count for a review
const likeReview = async (req, res) => {
  const reviewId = req.params.id
  try {
    const [updatedRowsCount] = await db.arvostelut.update(
      {
        tykkaykset: db.Sequelize.literal('tykkaykset + 1')
      },
      {
        where: { id: reviewId }
      }
    )
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Review not found' })
    }
    res.status(200).json({ message: 'Like added successfully' })
  } catch (error) {
    console.error('Error updating like count:', error)
    res.status(500).json({ error: 'Error updating like count' })
  }
}

// Get all reviews from a movie
const getReviewsByMovieId = async (req, res) => {
  const elokuvaId = req.params.id

  try {
    const reviews = await db.arvostelut.findAll({
      where: { elokuvaid: elokuvaId },
      include: [{
        model: db.jasen,
        as: 'jasen',
        required: false,
        attributes: ['id', 'nimimerkki']
      }],
      raw: false
    })
    const transformedReviews = reviews.map(review => {
      const reviewData = review.toJSON()
      return {
        ...reviewData,
        displayed_nimimerkki: reviewData.jasen ? reviewData.nimimerkki : 'Deleted User'
      }
    })

    res.status(200).json(transformedReviews)
  } catch (error) {
    console.error('Error in getReviewsByMovieId:', error)
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