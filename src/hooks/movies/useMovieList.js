import useMovieStore from '../../stores/movieStore'

// Hook for accessing movies and related store actions
export const useMovieList = () => {
  const movies = useMovieStore(s => s.movies)
  const isLoading = useMovieStore(s => s.isLoading) 
  const isLoadingMore = useMovieStore(s => s.isLoadingMore)
  const hasMoreMovies = useMovieStore(s => s.hasMoreMovies)
  const loadMovies = useMovieStore(s => s.loadMovies)
  const loadMovieRatings = useMovieStore(s => s.loadMovieRatings)
  const addMovie = useMovieStore(s => s.addMovie)
  const resetAndLoadMovies = useMovieStore(s => s.resetAndLoadMovies)
  const handleScrollForMoreMovies = useMovieStore(s => s.handleScrollForMoreMovies)
  const checkIfMoreContentNeeded = useMovieStore(s => s.checkIfMoreContentNeeded)
  
  return {
    movies,
    isLoading,
    isLoadingMore,
    hasMoreMovies,
    loadMovies,
    loadMovieRatings,
    addMovie,
    resetAndLoadMovies,
    handleScrollForMoreMovies,
    checkIfMoreContentNeeded
  }
}

export default useMovieList