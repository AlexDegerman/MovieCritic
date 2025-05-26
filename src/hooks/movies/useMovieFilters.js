import useMovieStore from '../../stores/movieStore'

// Hook for movie search, genre filter, and pagination state/actions
export const useMovieFilters = () => {
  const search = useMovieStore(s => s.search)
  const genre = useMovieStore(s => s.genre)
  const page = useMovieStore(s => s.page)
  const setSearch = useMovieStore(s => s.setSearch)
  const setGenre = useMovieStore(s => s.setGenre)
  const setPage = useMovieStore(s => s.setPage)
  
  return {
    search,
    genre,
    page,
    setSearch,
    setGenre,
    setPage
  }
}

export default useMovieFilters