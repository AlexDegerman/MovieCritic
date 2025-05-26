import { create } from 'zustand'
import MCService from '../services/MCService'
import { handleApiError } from '../utils/apiErrorHandler'
import { safeApiCall } from '../utils/safeApiCall'

const useReviewStore = create((set, get) => ({
  reviews: [],
  movieRatings: {},
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
      const averageRating = get().calculateAverageRating(sortedReviews)

      set({ 
        reviews: sortedReviews,
        movieRatings: { ...get().movieRatings, [movieId]: averageRating },
        isLoading: false
      })
    } else {
      set({ error: result.error, isLoading: false })
    }

    return result
  },

  // Load ratings for multiple movies
  loadMovieRatings: async (movies) => {
    const { movieRatings } = get()

    const moviesToLoad = movies
      .filter(movie => !movieRatings[movie.fi_id])
      .slice(0, 20)

    if (moviesToLoad.length === 0) return { success: true }

    const newRatings = { ...movieRatings }
    const errors = []

    for (const movie of moviesToLoad) {
      try {
        const response = await MCService.getReviews(movie.fi_id)
        const reviews = response.data
        const rating = reviews.length === 0 
          ? "Unrated" 
          : (reviews.reduce((sum, review) => sum + review.tahdet, 0) / reviews.length).toFixed(1)

        newRatings[movie.fi_id] = rating
      } catch (error) {
        errors.push(handleApiError(error, "Failed to load rating"))
        newRatings[movie.fi_id] = "Unrated"
      }
    }

    set({ movieRatings: newRatings })

    return { success: errors.length === 0, errors }
  },
  
  // Add a review
  addReview: async (reviewData) => {
    const token = localStorage.getItem('token')
    if (!token) return { success: false, error: "Missing login. Please login." }
    
    const result = await safeApiCall(
      () => MCService.postReview(reviewData, token),
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
    const token = localStorage.getItem('token')
    if (!token) return { success: false, error: "Please login to delete a review" }
    
    const result = await safeApiCall(
      () => MCService.deleteReview(reviewId, token),
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
  
  // Utility function to calculate average rating
  calculateAverageRating: (reviewsToCalculate = null) => {
    const reviewsData = reviewsToCalculate || get().reviews
    
    if (!reviewsData || reviewsData.length === 0) return "Unrated"
    
    const total = reviewsData.reduce((sum, review) => sum + review.tahdet, 0)
    return (total / reviewsData.length).toFixed(1)
  },

  // Get rating for a specific movie
  getMovieRating: (movieId) => {
    const { movieRatings } = get()
    return movieRatings[movieId] || "Unrated"
  }
}))

export default useReviewStore