import { useEffect } from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Info, Languages, MessageCircle, Pen, Star, Tag, UserCircle, Video, Trash2 } from 'lucide-react'
import ReviewSection from './ReviewSection'
import { useAlertMessages } from '../hooks/useAlertMessages'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import '../styles/MoviePage.css'
import { useAuth } from '../context/AuthContext'
import useMovieDetails from '../hooks/movies/useMovieDetails'
import useMovieReviews from '../hooks/reviews/useMovieReviews'

const MoviePage = ({ currentMember }) => {
  const navigate = useNavigate()
  const { index } = useParams()
  const { getText, getMovieField, getOppositeField, formatters } = useLanguageUtils()
  const { showSuccess, showError, showWarning, showInfo } = useAlertMessages()
  const { isDemoUser } = useAuth()
  const { 
    movie, 
    isLoading: loading, 
    loadMovie, 
    deleteMovie 
  } = useMovieDetails()
  const { reviews, movieRatings } = useMovieReviews()

  // Fetch current movie
  useEffect(() => {
    if (index !== undefined) {
      loadMovie(index).then(result => {
        if (!result.success) {
          showError(getText("Elokuvan lataaminen epäonnistui", "Failed to load movie"))
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Delete movie button handler
  const handleDeleteMovie = (id) => {
    if (isDemoUser) {
      showInfo(getText("Elokuvien poistaminen on poissa käytöstä demotilassa.", "Deleting movies is disabled in demo mode."))
      return
    }
    
    showWarning(
      getText(
        "Oletko varma, että haluat poistaa elokuvan? Kaikki siihen liittyvät arvostelut poistetaan myös.", 
        "Are you sure you want to delete the movie? All reviews on it will be removed as well."
      ),
      {
        onConfirm: async () => {
          const result = await deleteMovie(id)
          if (result.success) {
            showSuccess(getText("Elokuva on poistettu onnistuneesti!", "Successfully deleted the movie!"))
            navigate('/')
          } else {
            showError(result.error)
          }
        },
        onCancel: () => {
          setTimeout(() => {
            showInfo(getText("Poisto peruutettu.", "Cancelled deletion."))
          }, 100)
        }
      }
    )
  }

  // Temporary returns while movie loads or movie is not found
  if (loading) {
    return <div className="loading-container">Loading movie details...</div>
  }
  
  if (!movie || Object.keys(movie).length === 0) {
    return <div className="error-container">
      <h2>Movie not found</h2>
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft/> Return to Movies
      </button>
    </div>
  }

  const averageRating = movieRatings[movie.fi_id] || getText("Ei arvosteltu", "Unrated")
  const reviewCount = reviews.length

  return (
    <section className="movie-page-container">
      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft/>
        </button>
      </div>

      {/* Movie Title and Poster */}
      <div className="movie-title-container">
        <h1 className="movie-title">
          {getMovieField(movie, 'otsikko', 'title')}
        </h1>
        <img 
          src={getMovieField(movie, 'kuvan_polku', 'poster_path')} 
          alt={`${getMovieField(movie, 'otsikko', 'title')} image`} 
          className="movie-image" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-movie-poster.jpg'; // Replace with your default poster path
          }}
        />
      </div>

      {/* Movie Details Section */}
      <div className="movie-details">
        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Star size="20px"/>
            <label className="movie-detail-label">
              {getText('Arvostelun keskiarvo', 'Average Rating')}
            </label>
          </div>
          <p className="movie-detail">
            {averageRating}
            {reviewCount > 0 && ` (${formatters.reviews(reviewCount)})`}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Languages size="20px"/>
            <label className="movie-detail-label">
              {getText('Englanninkielinen nimi', 'Finnish Name')}
            </label>
          </div>
          <p className="movie-detail">
            {getOppositeField(movie, movie, 'otsikko', 'title')}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Tag size="20px"/>
            <label className="movie-detail-label">
              {getText('Lajityypit', 'Genres')}
            </label>
          </div>
          <p className="movie-detail">
            {getMovieField(movie, 'lajityypit', 'genres')}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Calendar size="20px"/>
            <label className="movie-detail-label">
              {getText('Julkaisuvuosi', 'Release Year')}
            </label>
          </div>
          <p className="movie-detail">
            {movie.valmistumisvuosi}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Clock size="20px"/>
            <label className="movie-detail-label">
              {getText('Pituus', 'Duration')}
            </label>
          </div>
          <p className="movie-detail">
            {formatters.duration(movie.pituus)}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Video size="20px"/>
            <label className="movie-detail-label">
              {getText('Ohjaaja', 'Director')}
            </label>
          </div>
          <p className="movie-detail">
            {getMovieField(movie, 'ohjaaja', 'director')}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Pen size="20px"/>
            <label className="movie-detail-label">
              {getText('Käsikirjoittajat', 'Screenwriters')}
            </label>
          </div>
          <p className="movie-detail">
            {getMovieField(movie, 'kasikirjoittajat', 'screenwriters')}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <UserCircle size="20px"/>
            <label className="movie-detail-label">
              {getText('Päänäyttelijät', 'Main Actors')}
            </label>
          </div>
          <p className="movie-detail">
            {getMovieField(movie, 'paanayttelijat', 'main_actors')}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <MessageCircle size="20px"/>
            <label className="movie-detail-label">
              {getText('Kieli', 'Language')}
            </label>
          </div>
          <p className="movie-detail">
            {getMovieField(movie, 'alkuperainen_kieli', 'original_language')}
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Info size="20px"/>
            <label className="movie-detail-label">
              {getText('Kuvaus', 'Overview')}
            </label>
          </div>
          <p className="movie-detail">
            {getMovieField(movie, 'kuvaus', 'overview')}
          </p>
        </div>
      </div>

      
      {/* Delete Movie Button (only for logged-in members) */}
      {currentMember && (
        <div className="delete-movie-btn-container">
          <Trash2 size={20} color="#7e7c7c"/>
          <button 
            onClick={() => handleDeleteMovie(index)} 
            className="delete-movie-btn"
          >
            {getText('Poista Elokuva', 'Delete Movie')}
          </button>
        </div>
      )}

      {/* Reviews Section */}
      <ReviewSection currentMember={currentMember} />
    </section>
  )
}

export default MoviePage