import { MOVIE_GENRES } from '../constants/movieGenres'
import { MOVIE_GENRES_FIN } from '../constants/movieGenresFin'

import '../styles/Filter.css'
// This component displays a search bar and a genre selector
const Filter = ( {setSearch, search, genre, setGenre}) => {

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleGenre = (event) => {
    setGenre(event.target.value)
  }

  return (
    <div className="filter">
      <div className="search-bar">
        <label> Search movies by name  </label>
        <input value={search} onChange={handleSearch} className="search-input" placeholder="Search"/>
      </div>
      <div className="genre-window">
        <label>Filter by genre</label>
        <select value={genre} onChange={handleGenre} className="genre-select">
          <option value="">All Genres</option>
          {MOVIE_GENRES_FIN.map((genre) => (
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