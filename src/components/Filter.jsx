import { MOVIE_GENRES } from '../constants/movieGenres'

// This component displays a search bar and a genre selector
const Filter = ( {setSearch, search, genre, setGenre}) => {

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleGenre = (event) => {
    setGenre(event.target.value)
  }

  return (
    <>
      <div>
        Search movies by name <input value={search} onChange={handleSearch} />
      </div>
      <div>
        Filter by genre
        <select value={genre} onChange={handleGenre}>
          <option value="">All Genres</option>
          {MOVIE_GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default Filter