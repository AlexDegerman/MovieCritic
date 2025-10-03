import { create } from 'zustand'
import MCService from '../services/MCService'
import { handleApiError } from '../utils/apiErrorHandler'
import { safeApiCall } from '../utils/safeApiCall'
import { checkAuth} from '../utils/tokenUtils'

const useMovieStore = create((set, get) => ({
  movies: [],
  currentMovie: null,
  
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
    const authCheck = checkAuth()
    if (!authCheck.success) return authCheck
    
    const result = await safeApiCall(
      () => MCService.postMovie(movieData, authCheck.token),
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
    const authCheck = checkAuth()
    if (!authCheck.success) return authCheck
    
    const result = await safeApiCall(
      () => MCService.deleteMovie(movieId, authCheck.token),
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