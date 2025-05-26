import useMovieStore from '../../stores/movieStore'

// Hook for accessing movie details and related actions
export const useMovieDetails = () => {
  const movie = useMovieStore(s => s.currentMovie)
  const movieRatings = useMovieStore(s => s.movieRatings)
  const isLoading = useMovieStore(s => s.isMovieLoading)
  const loadMovie = useMovieStore(s => s.loadMovie)
  const loadRatings = useMovieStore(s => s.loadMovieRatings)
  const deleteMovie = useMovieStore(s => s.deleteMovie)
  
  return {
    movie,
    movieRatings,
    isLoading,
    loadMovie,
    loadRatings,
    deleteMovie
  }
}

export default useMovieDetails