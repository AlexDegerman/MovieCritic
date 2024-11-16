import { Link } from 'react-router-dom'
import Filter from './Filter'
import { useEffect, useState } from 'react'
import  '../styles/Movies.css'

// This component displays a list of movies
const Movies = ({ movies, image }) => {
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [filtered, setFilter] = useState([])

  useEffect(() => {
    const filteredMovies = movies.filter(movie => {
      const matchesSearch = movie.alkuperainennimi.toLowerCase().includes(search.toLowerCase())
      const matchesGenre = genre === "" || movie.lajityyppi.toLowerCase() === genre.toLowerCase()
      return matchesSearch && matchesGenre
    })
    setFilter(filteredMovies)
  }, [search, genre, movies,])

  return (
    <div className="main-content">
      <Filter search={search} setSearch={setSearch} genre={genre} setGenre={setGenre} />
      {filtered.length > 0 ? (
        <ul className="movie-list">
          {filtered.map((movie, index) => (
            <li key={movie.id} className="movie-card">
              <Link to={`/movie/${index}`} className="movie-title">{movie.alkuperainennimi}
              <img src={image[movie.id]} alt={`${movie.alkuperainennimi} image`} className="movies-image" />
              </Link>
              <ul className="movie-details">
                <li>
                  <span className="movie-detail-label">Genre</span>
                  <span className="movie-detail-value">{movie.lajityyppi}</span>
                </li>
                <li>
                  <span className="movie-detail-label">Release Year</span>
                  <span className="movie-detail-value">{movie.valmistumisvuosi}</span>
                </li>

                <li>
                  <span className="movie-detail-label">tagline from tmdb</span>
                  <span className="movie-detail-value">{movie.kuvaus}</span>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-match-container">
        <p className="no-match">No movies match this search</p>
        </div>
      )}
    </div>
  )
}

export default Movies