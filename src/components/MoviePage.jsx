/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import MCService from '../services/MCService'
import { ArrowLeft, Calendar, Clock, Info, Languages, MessageCircle, Pen, Star, Tag, UserCircle, Video, Trash2 } from 'lucide-react'
import ReviewSection from './ReviewSection'
import { useAlertMessages } from '../hooks/useAlertMessages'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import '../styles/MoviePage.css'

const MoviePage = ({ currentMember, setMovies }) => {
  const navigate = useNavigate()
  const { index } = useParams()
  const [movie, setMovie] = useState({})
  const { getText, getMovieField, getOppositeField, formatters } = useLanguageUtils()
  const [movieRating, setMovieRating] = useState({
    averageRating: getText("Ei arvosteltu", "Unrated"),
    reviewCount: 0
  })
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError, showWarning, showInfo } = useAlertMessages()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch current movie
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (index !== undefined) {
          const response = await MCService.getMovie(index) 
          setMovie(response.data)
          setLoading(false)
        }
      } catch (error) {
        console.error(getText("Virhe elokuvan hakemisessa: ", "Error fetching movie: "), error)
        showError(getText("Elokuvan lataaminen epäonnistui", "Failed to load movie"))
        setLoading(false)
      }
    }

    fetchMovie()
  }, [index])

  // Update movie rating from ReviewSection
  const updateMovieRating = (averageRating, reviewCount) => {
    setMovieRating({
      averageRating: averageRating,
      reviewCount: reviewCount
    })
  }

  const deleteMovie = (id) => {
    const token = localStorage.getItem('token')
    if (token) {
      showWarning(
        getText(
          "Oletko varma, että haluat poistaa elokuvan? Kaikki siihen liittyvät arvostelut poistetaan myös.", 
          "Are you sure you want to delete the movie? All reviews on it will be removed as well."
        ),
        {
          onConfirm: async () => {
            try {
              setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id))
              await MCService.deleteMovie(id, token)
              showSuccess(getText("Elokuva on poistettu onnistuneesti!", "Successfully deleted the movie!"))
              navigate('/')
            } catch {
              showError(getText("Virhe elokuvan poistamisessa.", "Error deleting movie."))
            }
          },
          onCancel: () => {
            setTimeout(() => {
              showInfo(getText("Poisto peruutettu.", "Cancelled deletion."))
            }, 100)
          }
        }
      )
    } else {
      showError(getText("Kirjaudu sisään poistaaksesi elokuvan", "Please log in to delete the movie"))
    }
  }

  // Temporary returns while movie loads or movie is not found
  if (loading) {
    return <div>Loading movie details...</div>
  }
  if (!movie || Object.keys(movie).length === 0) {
    return <div>Movie not found</div>
  }

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
            {movieRating.averageRating}
            {movieRating.reviewCount > 0 && ` (${formatters.reviews(movieRating.reviewCount)})`}
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
            onClick={() => deleteMovie(index)} 
            className="delete-movie-btn"
          >
            {getText('Poista Elokuva', 'Delete Movie')}
          </button>
        </div>
      )}

      {/* Reviews Section */}
      <ReviewSection 
        movie={movie} 
        currentMember={currentMember} 
        updateMovieRating={updateMovieRating} 
      />
    </section>
  )
}

export default MoviePage