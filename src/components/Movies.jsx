import { Link } from 'react-router-dom'
import Filter from './Filter'
import { useEffect, useState } from 'react'
import  '../styles/Movies.css'

// This component displays a list of movies
const Movies = ({ movies, image, movieRatings, isLoading}) => {
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [filtered, setFilter] = useState([])

  useEffect(() => {
    const filteredMovies = movies.filter(movie => {
      const matchesSearch = movie.otsikko.toLowerCase().includes(search.toLowerCase())
      const matchesGenre = genre === "" || movie.lajityypit.toLowerCase().includes(genre.toLowerCase())
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
              <Link to={`/movie/${index}`} className="movie-title">{movie.otsikko}
              <img src={movie.kuvan_polku} alt={`${movie.otsikko} image`} className="movies-image" />
              </Link>
              <ul className="movie-details">
                <li>
                  <span className="movie-detail-label">Genres</span>
                  <span className="movie-detail-value">{movie.lajityypit}</span>
                </li>
                <li>
                  <span className="movie-detail-label">Release Year</span>
                  <span className="movie-detail-value">{movie.valmistumisvuosi}</span>
                </li>

                <li>
                  <span className="movie-detail-label">Average Rating</span>
                  <span className="movie-detail-value">
                    {movieRatings[movie.id] ? (movieRatings[movie.id] === "Unrated" ? "Unrated" : `${movieRatings[movie.id]} / 5`): "Unrated"}
                  </span>
                </li>
                
                <li>
                  <span className="movie-detail-label">Iskulause</span>
                  <span className="movie-detail-value">{movie.iskulause}</span>
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
      {isLoading && <p>Loading more movies...</p>}
    </div>
  )
}

export default Movies