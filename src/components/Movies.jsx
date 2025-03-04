import { Link } from 'react-router-dom'
import Filter from './Filter'
import '../styles/Movies.css'
import { useLanguageUtils } from '../hooks/useLanguageUtils'

// This component displays a list of movie cards
const Movies = ({movies, movieRatings, search, setSearch, genre, setGenre, isLoadingMore, isInitialLoading}) => {
  const {language, getText, getMovieField } = useLanguageUtils()

  // Returns the first 50 characters of the movie description if tagline does not exist
  const getMovieDescription = (movie) => {
    const tagline = getMovieField(movie, 'iskulause', 'tagline')
    if (tagline) return tagline
  
    const fiDescription = movie.kuvaus
    const enDescription = movie.overview
    const description = language === 'fi' ? (fiDescription || enDescription) : (enDescription || fiDescription)
    
    return description ? `${description.slice(0, 50)}...` : ''
  }

  return (
    <div className="main-content">
      {/* Filter bar */}
      <Filter search={search} setSearch={setSearch} genre={genre} setGenre={setGenre}/>
      {/* Conditional renders */}
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
          {/* Movie Cards */}
          <ul className="movie-list">
            {movies.map((movie) => (
              <li key={movie.fi_id || movie.id} className="movie-card">
                <Link to={`/movie/${movie.fi_id}`} className="movie-title" onClick={() => setSearch('')}>
                  {getMovieField(movie, 'otsikko', 'title')}
                  <img
                    src={getMovieField(movie, 'kuvan_polku', 'poster_path')}
                    alt={`${getMovieField(movie, 'otsikko', 'title')} image`}
                    className="movies-image"
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
          {/* Loading More Box */}
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