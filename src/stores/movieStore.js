import { create } from 'zustand'
import MCService from '../services/MCService'
import { handleApiError } from '../utils/apiErrorHandler'

const safeApiCall = async (apiCall, errorMessage) => {
  try {
    const response = await apiCall()
    return { success: true, data: response.data }
  } catch (error) {
    const errorText = handleApiError(error, errorMessage)
    return { success: false, error: errorText }
  }
}

const useMovieStore = create((set, get) => ({
  movies: [],
  currentMovie: null,
  reviews: [],
  movieRatings: {},
  
  isLoading: false,
  isLoadingMore: false,
  hasMoreMovies: true,
  error: null,
  isMovieLoading: false,
  
  page: 1,
  search: "",
  genre: "",
  seed: Date.now(),
  
  setSearch: (search) => {
  set({ search, page: 1 })
  get().resetAndLoadMovies()
  },
  setGenre: (genre) => set({ genre, page: 1 }),
  setPage: (page) => set({ page }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Load movies with pagination and filtering
  loadMovies: async (forcePage = null) => {
    const { page, search, genre, seed, isLoading, hasMoreMovies } = get()

    if (isLoading || (!forcePage && page > 1 && !hasMoreMovies)) return { success: false }

    const currentPage = forcePage || page
    const isInitialLoad = currentPage === 1

    set({
      isLoading: isInitialLoad,
      isLoadingMore: !isInitialLoad,
      error: null
    })

    try {
      const response = await MCService.getMovies(currentPage, search, genre, seed)
      const newMovies = response.data.movies || []
    
      set(state => {
        let updatedMovies
        
        if (currentPage === 1) {
          updatedMovies = newMovies
        } else {
          const existingIds = new Set(state.movies.map(movie => movie.fi_id || movie.id))
          const uniqueNewMovies = newMovies.filter(movie => 
            !existingIds.has(movie.fi_id || movie.id)
          )
          updatedMovies = [...state.movies, ...uniqueNewMovies]
        }
        
        return {
          movies: updatedMovies,
          seed: response.data.seed || state.seed,
          hasMoreMovies: newMovies.length > 0,
          isLoading: false,
          isLoadingMore: false
        }
      })
    
      setTimeout(() => get().checkIfMoreContentNeeded(), 100)
    
      return { success: true, data: newMovies }
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to load movies")
      set({
        isLoading: false,
        isLoadingMore: false,
        error: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  },
  
  // Reset and load fresh movies - used when filters change
  resetAndLoadMovies: () => {
    set({
      movies: [],
      page: 1,
      hasMoreMovies: true,
      error: null,
      seed: Date.now()
    })
    
    window.scrollTo(0, 0)
    get().loadMovies(1)
  },
  
  // Load a single movie by ID
  loadMovie: async (movieId) => {
    set({ isMovieLoading: true, error: null })

    const result = await safeApiCall(
      () => MCService.getMovie(movieId),
      "Failed to load movie"
    )

    set({ 
      currentMovie: result.success ? result.data : null,
      isMovieLoading: false,
      error: result.success ? null : result.error
    })

    return result
  },
  
  // Add a new movie
  addMovie: async (movieData) => {
    const token = localStorage.getItem('token')
    if (!token) return { success: false, error: "Missing login" }
    
    const result = await safeApiCall(
      () => MCService.postMovie(movieData, token),
      "Failed to add movie"
    )
    
    if (result.success) {
      get().resetAndLoadMovies()
    } else {
      set({ error: result.error })
    }
    
    return result
  },
  
  // Delete a movie
  deleteMovie: async (movieId) => {
    const token = localStorage.getItem('token')
    if (!token) return { success: false, error: "Please log in to delete the movie" }
    
    const result = await safeApiCall(
      () => MCService.deleteMovie(movieId, token),
      "Error deleting movie"
    )
    
    if (result.success) {
      set(state => ({
        movies: state.movies.filter(movie => movie.id !== movieId)
      }))
    } else {
      set({ error: result.error })
    }
    
    return result
  },
  
  // Load reviews for a movie
  loadReviews: async (movieId) => {
    if (!movieId) {
      const { currentMovie } = get()
      if (!currentMovie) return { success: false, error: "No movie selected" }
      movieId = currentMovie.fi_id
    }

    set({ error: null })

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
      })
    } else {
      set({ error: result.error })
    }

    return result
  },

  
// Load ratings for a page of movies
loadMovieRatings: async () => {
  const { movies, movieRatings } = get()

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
}
,
  
  // Add a review
  addReview: async (reviewData) => {
    const token = localStorage.getItem('token')
    if (!token) return { success: false, error: "Missing login. Please login." }
    
    const result = await safeApiCall(
      () => MCService.postReview(reviewData, token),
      "Failed to add review"
    )
    
    if (result.success) {
      set(state => ({
        reviews: [
          { ...result.data, luotuaika: result.data.luotuaika || new Date().toISOString() },
          ...state.reviews
        ]
      }))
      
      const { currentMovie } = get()
      if (currentMovie?.fi_id) {
        get().loadReviews(currentMovie.fi_id)
      }
    } else {
      set({ error: result.error })
    }
    
    return result
  },
  
  // Delete a review
  deleteReview: async (reviewId) => {
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
      
      const { currentMovie } = get()
      if (currentMovie?.fi_id) {
        get().loadReviews(currentMovie.fi_id)
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
  
  // Scroll handling for infinite loading
  checkIfMoreContentNeeded: () => {
    const { isLoading, hasMoreMovies, movies } = get()
    
    if (isLoading || !hasMoreMovies || movies.length === 0) return
    
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.offsetHeight
    
    if (documentHeight <= windowHeight * 1.2) {
      get().loadNextPage()
    }
  },
  
  // Handle scroll events for infinite loading
  handleScrollForMoreMovies: () => {
    const { isLoading, hasMoreMovies } = get()
    
    if (isLoading || !hasMoreMovies) return
    
    const scrollPosition = window.innerHeight + window.scrollY
    const documentHeight = document.documentElement.offsetHeight
    
    if (scrollPosition >= documentHeight * 0.8) {
      get().loadNextPage()
    }
  },
  
  // Load next page of results
  loadNextPage: () => {
    const { isLoading, hasMoreMovies } = get()
    
    if (!isLoading && hasMoreMovies) {
      set(state => ({ page: state.page + 1 }))
      
      setTimeout(() => {
        get().loadMovies()
      }, 0)
    }
  }
}))

export default useMovieStore