import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { useDebounce } from '../hooks/useDebounce'
import { useEffect, useCallback } from 'react'
import '../styles/Filter.css'
import useMovieList from '../hooks/movies/useMovieList'
import useMovieFilters from '../hooks/movies/useMovieFilters'
import { useGenres } from '../hooks/useGenres'

// This component displays a search bar and a genre selector
const Filter = () => {
  const { language, getText } = useLanguageUtils()
  const genres = useGenres()
  const { search, genre, setSearch, setGenre, setPage } = useMovieFilters()
  const { loadMovies } = useMovieList()

  // Debounce search input to reduce API calls
  const debouncedSearch = useDebounce(search, 500)
  
  // Load first page of results
  const loadFirstPage = useCallback(() => {
    setPage(1)
    loadMovies(1)
    window.scrollTo(0, 0)
  }, [setPage, loadMovies])
  
  // Load first page when search changes
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      loadFirstPage()
    }
  }, [debouncedSearch, genre, loadFirstPage])

  return (
    <div className="filter">
      {/* Search Bar */}
      <div className="search-bar">
        <label>{getText('Etsi elokuvia niiden nimellä', 'Search movies by title')}</label>
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="search-input" 
          placeholder={getText('Etsi', 'Search')} 
        />
      </div>
      {/* Genre Selector */}
      <div className="genre-window">
        <label>{getText('Suodata lajityypin mukaan', 'Filter movies by genre')}</label>
        <select 
          value={genre}
          onChange={e => setGenre(e.target.value)} 
          className="genre-select"
        >
          <option value="">{language === 'fi' ? 'Kaikki lajityypit' : 'All Genres'}</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Filter