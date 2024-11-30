import { MOVIE_GENRES } from '../constants/movieGenres'
import { MOVIE_GENRES_FIN } from '../constants/movieGenresFin'
import { useLanguageUtils } from '../hooks/useLanguageUtils'

import '../styles/Filter.css'
// This component displays a search bar and a genre selector
const Filter = ( {setSearch, search, genre, setGenre}) => {
  const {language, getText} = useLanguageUtils()
  const genres = language === 'fi' ? MOVIE_GENRES_FIN : MOVIE_GENRES

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleGenre = (event) => {
    setGenre(event.target.value)
  }

  return (
    <div className="filter">
      {/* Search Bar */}
      <div className="search-bar">
        <label>{getText('Etsi elokuvia niiden nimellä', 'Search movies by title')}</label>
        <input value={search} onChange={handleSearch} className="search-input" placeholder={getText('Etsi', 'Search')} />
      </div>
      {/* Genre Selector */}
      <div className="genre-window">
        <label>{getText('Suodata lajityypin mukaan', 'Filter movies by genre')}</label>
        <select value={genre}onChange={(e) => {handleGenre(e); window.scrollTo(0, 0)}} className="genre-select">
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