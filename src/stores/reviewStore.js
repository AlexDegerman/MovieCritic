import { create } from 'zustand'
import MCService from '../services/MCService'
import { safeApiCall } from '../utils/safeApiCall'
import { checkAuth } from '../utils/tokenUtils'

const useReviewStore = create((set, get) => ({
  reviews: [],
  error: null,
  isLoading: false,

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Load reviews for a movie
  loadReviews: async (movieId) => {
    if (!movieId) {
      return { success: false, error: "No movie ID provided" }
    }
    set({ error: null, isLoading: true })
    const result = await safeApiCall(
      () => MCService.getReviews(movieId),
      "Error loading reviews"
    )
    if (result.success) {
      const sortedReviews = result.data.sort((a, b) => b.tykkaykset - a.tykkaykset)
      set({
        reviews: sortedReviews,
        isLoading: false
      })
    } else {
      set({ error: result.error, isLoading: false })
    }
    return result
  },
  
  // Add a review
  addReview: async (reviewData) => {
    const authCheck = checkAuth()
    if (!authCheck.success) return authCheck
  
    const result = await safeApiCall(
      () => MCService.postReview(reviewData, authCheck.token),
      "Failed to add review"
    )
  
    if (result.success) {
      if (reviewData.elokuvaid) {
        await get().loadReviews(reviewData.elokuvaid)
      }
    } else {
      set({ error: result.error })
    }
  
    return result
  },

  // Delete a review
  deleteReview: async (reviewId, movieId = null) => {
    const authCheck = checkAuth()
    if (!authCheck.success) return authCheck
  
    const result = await safeApiCall(
      () => MCService.deleteReview(reviewId, authCheck.token),
      "Error deleting review"
    )
  
    if (result.success) {
      set(state => ({
        reviews: state.reviews.filter(review => review.id !== reviewId)
      }))
    
      if (movieId) {
        get().loadReviews(movieId)
      }
    } else {
      set({ error: result.error })
    }
  
    return result
  },

  // Like a review
  likeReview: async (reviewId) => {
    const likedReviews = JSON.parse(localStorage.getItem('likedReviews')) || []
  
    if (likedReviews.includes(reviewId)) {
      return { success: false, error: "You have already liked this review." }
    }
  
    const result = await safeApiCall(
      () => MCService.incrementLikeOnReview(reviewId),
      "Error liking the review"
    )
  
    if (result.success) {
      set(state => ({
        reviews: state.reviews.map(review =>
          review.id === reviewId
            ? { ...review, tykkaykset: review.tykkaykset + 1 }
            : review
        )
      }))
    
      likedReviews.push(reviewId)
      localStorage.setItem('likedReviews', JSON.stringify(likedReviews))
    } else {
      set({ error: result.error })
    }
  
    return result
  },

  // Utility function to calculate average rating from current reviews
  calculateAverageRating: (reviewsToCalculate = null) => {
    const reviewsData = reviewsToCalculate || get().reviews
  
    if (!reviewsData || reviewsData.length === 0) return "Unrated"
  
    const total = reviewsData.reduce((sum, review) => sum + review.tahdet, 0)
    return (total / reviewsData.length).toFixed(1)
  }
}))

export default useReviewStore