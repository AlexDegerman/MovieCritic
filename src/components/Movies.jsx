import { Link, useLocation } from 'react-router-dom'
import Filter from './Filter'
import { useEffect} from 'react'
import '../styles/Movies.css'
import { useLanguageUtils } from '../hooks/useLanguageUtils'

// This component displays a list of movies
const Movies = ({movies, movieRatings, search, setSearch, genre, setGenre, isLoadingMore, isInitialLoading}) => {
  const {getText, getMovieField } = useLanguageUtils()
  const location = useLocation()

// Scroll to top when route changes
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }, [location.key])

  const getMovieDescription = (movie) => {
    const tagline = getMovieField(movie, 'iskulause', 'tagline')
    if (tagline) return tagline

    const description = getMovieField(movie, 'kuvaus', 'overview')
    return description ? `${description.slice(0, 50)}...` : ''
  }

  return (
    <div className="main-content">
      <Filter search={search} setSearch={setSearch} genre={genre} setGenre={setGenre}/>
      {isInitialLoading ? (
        <div className="loading-movies-container">
          <div>
            <p className="loading-movies">{getText("Elokuvia ladataan...", "Loading movies...")}</p>
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="no-match-container">
          <p className="no-match">{getText('Ei löytynyt elokuvia tällä haulla', 'No movies match this search')}</p>
        </div>
      ) : (
        <>
          <ul className="movie-list">
            {movies.map((movie) => (
              <li key={movie.fi_id || movie.id} className="movie-card">
                <Link to={`/movie/${movie.fi_id}`} className="movie-title" onClick={() => setSearch('')}>
                  {getMovieField(movie, 'otsikko', 'title')}
                  <img
                    src={getMovieField(movie, 'kuvan_polku', 'poster_path')}
                    alt={`${getMovieField(movie, 'otsikko', 'title')} image`}
                    className="movies-image"
                    loading="lazy"
                    // eslint-disable-next-line react/no-unknown-property
                    fetchpriority="low"
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
                      {movieRatings[movie.fi_id]
                        ? (movieRatings[movie.fi_id] === "Unrated"
                          ? getText('Ei arvosteltu', 'Unrated')
                          : `${movieRatings[movie.fi_id]} / 5`)
                        : getText('Ei arvosteltu', 'Unrated')}
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
            ))}
          </ul>
          
          {isLoadingMore && (
            <div className="loading-more-container active">
              <p className="loading-more">
                {getText('Ladataan lisää elokuvia...', 'Loading more movies...')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Movies