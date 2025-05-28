import { Link } from 'react-router-dom'
import useMovieFilters from '../hooks/movies/useMovieFilters'
import useLanguage from '../hooks/language/useLanguage'

const MovieCard = ({ movie, movieRating }) => {
  const { getText, getMovieField, getMovieDescription } = useLanguage()
  const { setSearch } = useMovieFilters()

  const getRatingDisplay = () => {
    if (!movieRating) return getText('Ladataan...', 'Loading...')
    if (movieRating === "Unrated") return getText('Ei arvosteltu', 'Unrated')
    return `${movieRating} / 5`
  }

  return (
    <li className="movie-card">
      <Link 
        to={`/movie/${movie.fi_id}`} 
        className="movie-title" 
        onClick={() => setSearch('')}
      >
        {getMovieField(movie, 'otsikko', 'title')}
        <img
          src={getMovieField(movie, 'kuvan_polku', 'poster_path')}
          alt={`${getMovieField(movie, 'otsikko', 'title')} poster`}
          className="movies-image"
          loading="lazy"
        />
      </Link>
      <ul className="movie-details">
        <li>
          <span className="movie-detail-label">
            {getText('Laji tyypit', 'Genres')}
          </span>
          <span className="movie-detail-value">
            {getMovieField(movie, 'lajityypit', 'genres')}
          </span>
        </li>
        <li>
          <span className="movie-detail-label">
            {getText('Julkaisu vuosi', 'Release Year')}
          </span>
          <span className="movie-detail-value">
            {movie.valmistumisvuosi}
          </span>
        </li>
        <li>
          <span className="movie-detail-label">
            {getText('Keski arvo', 'Average Rating')}
          </span>
          <span className="movie-detail-value">
            {getRatingDisplay()}
          </span>
        </li>
        <li>
          <span className="movie-detail-label">
            {getText('Iskulause', 'Tagline')}
          </span>
          <span className="movie-detail-value">
            {getMovieDescription(movie)}
          </span>
        </li>
      </ul>
    </li>
  )
}

export default MovieCard