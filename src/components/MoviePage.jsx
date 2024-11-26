/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import MCService from '../services/MCService'
import { Link } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import { handleApiError } from '../utils/apiErrorHandler'
import { useNavigate } from 'react-router-dom'
import '../styles/MoviePage.css'
import { ArrowLeft, Calendar, Clock, Info, Languages, MessageCircle, Pen, Star, Tag, Trash2, UserCircle, Video } from 'lucide-react'
import { useLanguageUtils } from '../hooks/useLanguageUtils'

// This component displays a movie's page
const MoviePage = ({ currentMember, setMovies, updateMovieRating }) => {
  const navigate = useNavigate()
  const {index} = useParams()
  const [review, setReview] = useState({
    otsikko: "",
    sisalto: "",
    tahdet: "",
    nimimerkki: currentMember.nimimerkki,
    elokuvanOtsikko: "",

  })
  const [movie, setMovie] = useState({})
  const [reviews, setReviews] = useState([])
  const [updateReviews, setUpdateReviews] = useState(false)
  const [loading, setLoading] = useState(true)
  const {showSuccess, showError, showWarning, showInfo } = useAlertMessages()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const reviewFormRef = useRef(null)
  const {language, getText, getMovieField, getOppositeField, formatters } = useLanguageUtils()

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
        }
      } catch (error) {
        console.error(getText("Virhe elokuvan hakemisessa: ", "Error fetching movie: "), error)
      }
    }

    fetchMovie()
  }, [index])

  // Populate review list
  useEffect(() => {
    if (movie && movie.fi_id) {
      setLoading(true)
      MCService
        .getReviews(movie.fi_id)
        .then(response => {
        const sortedReviews = response.data.sort((a,b) =>
          new Date(b.luotuaika) - new Date(a.luotuaika)
        )
          setReviews(sortedReviews)
          setLoading(false)
      })
        .catch((error) => {
          showError(handleApiError(error, getText("Virhe arvostelujen lataamisessa. Yritä uudelleen.", "Error loading reviews. Please try again.")))
          setLoading(false)
      })
    } else {
      setLoading(false)
    }
  },[updateReviews, movie, showError])

  // Set nimimerkki to current member's
  useEffect(() => {
    if (currentMember) {
      setReview(prev => ({
        ...prev,
        nimimerkki: currentMember.nimimerkki
      }))
    }
  }, [currentMember])

  // Set scroll to review form
  useEffect(() => {
    if (showReviewForm && reviewFormRef.current) {
      const offset = 70
      const elementPosition = reviewFormRef.current.getBoundingClientRect().top + window.scrollY 
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [showReviewForm])

  const calculateAverage = (reviews) => {
    if (reviews.length === 0) return getText("Ei arvosteltu", "Unrated")
    const total = reviews.reduce((sum, review) => sum + review.tahdet, 0)
    return (total / reviews.length).toFixed(1)
  }

  // Recalculates and updates the movie rating when reviews change
  useEffect(() => {
    if (movie?.fi_id) {
      const average = calculateAverage(reviews)
      updateMovieRating(movie.fi_id, average, reviews.length > 0)
    }
  }, [reviews])

  // Temporary returns while movie loads or movie is not found
  if (loading) {
    return <div>Loading movie details...</div>
  }
  if (!movie || Object.keys(movie).length === 0) {
    return <div>Movie not found</div>
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setReview(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingChange = (event) => {
    setReview(prev => ({
      ...prev,
      tahdet: Number(event.target.value)
    }))
  }

  const addReview = async (event) => {
    event.preventDefault()
    if (!currentMember) {
      showError(getText("Kirjaudu sisään voidaksesi jättää arvostelun.", "Please log in to submit a review"))
      return
    }
    const newReview = {
      ...review,
      elokuvaid: movie.fi_id,
      jasenid: currentMember.id,
      luotuaika: new Date().toISOString(),
      elokuvanOtsikko: movie.otsikko,
      elokuvanTitle: movie.title,
      tmdb_id: movie.tmdb_id
    }
    const token = localStorage.getItem('token')
    if (token) {
    try {
      const savedReview = await MCService.postReview(newReview, token)
      setReviews(prev => [{
        ...savedReview,
        luotuaika: savedReview.luotuaika || newReview.luotuaika
      }, ...prev])
      setReview({
        otsikko: "",
        sisalto: "",
        tahdet: "",
        nimimerkki: currentMember.nimimerkki,
      })
      setShowReviewForm(false)
      showSuccess(getText("Arvostelu lisätty onnistuneesti!", "Succesfully added the review!"))
      setUpdateReviews(!updateReviews)
      
    } catch {
      showError(getText("Arvostelun lisääminen epäonnistui. Yritä uudelleen.", "Failed to add review. Please try again"))
      }
    } else {
      showError(getText("Puuttuva kirjautuminen. Kirjaudu sisään.", "Missing login. Please login."))
    }
  }

  const deleteReview = (id) => {
    const token = localStorage.getItem('token')
    if (token) {
    showWarning(getText("Oletko varma, että haluat poistaa arvostelusi?", "Are you sure you want to delete your review?"), 
      {
        onConfirm: async () => {
          try {
            await MCService.deleteReview(id, token)
            showSuccess(getText("Arvostelusi on poistettu onnistuneesti!", "Successfully deleted your review!"))
          } catch {
            showError(getText("Virhe arvostelun poistamisessa.", "Error deleting review."))
          }
        },
        onCancel: () => {
          setTimeout(() => {
            showInfo(getText("Poisto peruutettu.", "Cancelled deletion."))
          }, 100)
        }
      })}
  }

  const deleteMovie = (id) => {
    const token = localStorage.getItem('token')
    if (token) {
    showWarning(getText("Oletko varma, että haluat poistaa elokuvan? Kaikki siihen liittyvät arvostelut poistetaan myös.",
      "Are you sure you want to delete the movie? All reviews on it will be removed aswell."),
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
      })}
  }

  return (
    <section className="movie-page-container">
      <div className="back-button-container">
        <button className="back-button"onClick={() => navigate(-1)}>
            <ArrowLeft/>
        </button>
      </div>
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

      <div className="movie-details">
        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Star size="20px"/>
            <label className="movie-detail-label">
              {getText('Arvostelun keskiarvo', 'Average Rating')}
            </label>
          </div>
          <p className="movie-detail">
            {calculateAverage(reviews)}
            {reviews.length > 0 && `/ 5 `}
            <span className="review-count">
              {reviews.length > 0 && `(${formatters.reviews(reviews.length)})`}
            </span>
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

      <button onClick={() => setShowReviewForm(!showReviewForm)} className="show-review-form-btn" ref={reviewFormRef}>{showReviewForm 
        ? getText('Piilota arvostelulomake', 'Hide Review Form') 
        : getText('Lisää arvostelu', 'Add a Review')}
      </button>
      {showReviewForm && (
      <div className="review-form">
        <p className="review-form-header">{getText('Kirjoita arvostelu', 'Write a Review')}</p>
        <form onSubmit={addReview}>
          <div className="review-form-input-container">
            <label className="review-form-label">{getText('Otsikko', 'Title')}</label>
              <input 
              className="review-form-input" 
              type="text" 
              name="otsikko" 
              value={review.otsikko} 
              onChange={handleChange} 
              required 
            />
            </div>
          <div className="review-form-input-container">
            <label className="review-form-label">{getText('Arvostelun sisältö', 'Review content')}</label>
            <textarea 
            className="review-form-textarea" 
            name="sisalto" 
            value={review.sisalto} 
            onChange={handleChange} 
            required 
          />
          </div>
            <div className="review-form-input-container">
              <label className="review-form-label">{getText('Arvostelu (0-5)', 'Rating (0-5)')}</label>
              <select 
                className="review-form-select" 
                name="tahdet" 
                value={review.tahdet} 
                onChange={handleRatingChange} 
                required
                >
                <option hidden>{getText('Valitse Arvostelu', 'Select a Rating')}</option>
                <option value="5" className="review-rating">★★★★★ (5)</option>
                <option value="4" className="review-rating">★★★★☆ (4)</option>
                <option value="3" className="review-rating">★★★☆☆ (3)</option>
                <option value="2" className="review-rating">★★☆☆☆ (2)</option>
                <option value="1" className="review-rating">★☆☆☆☆ (1)</option>
                <option value="0" className="review-rating">☆☆☆☆☆ (0)</option>
              </select>
              </div>
            <button type="submit" className="review-form-button">{getText('Lähetä arvostelu', 'Submit Review')}</button>
          </form>
        </div>
      )}
        {currentMember && (
        <div className="delete-movie-btn-container">
          <Trash2 size={20} color="#7e7c7c"/>
          <button onClick={() => deleteMovie(index)} className="delete-movie-btn">{getText('Poista Elokuva', 'Delete Movie')}</button>
        </div>
        )}
        <div className="reviews-section">
          <p className="reviews-header">{getText('Arvostelut', 'Reviews')}</p>
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <div className="review-item" key={i}>
                <p className="review-item-title">{review.otsikko}</p>
                <span className={`review-rating ${review.tahdet === 5 && 'perfect-rating'}`}>
                  {"★".repeat(Number(review.tahdet))}
                  {"☆".repeat(5 - Number(review.tahdet))}
                </span>
                <p className="review-content">{review.sisalto}</p>
                <div className="review-author">
                  <Link to={`/profile/${review.jasenid}`} className="review-author-link">{review.nimimerkki}</Link> • {new Date(review.luotuaika).toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US')}
                </div>
                {review.nimimerkki === currentMember.nimimerkki && (
                <div className="delete-review-btn-container">
                  <Trash2 size={20} color="#7e7c7c"/>
                  <button onClick={() => deleteReview(review.id)} className="delete-review-btn">{getText('Poista Arvostelu', 'Delete Review')}</button>
                </div>
                )}
              </div>
            ))
          ) : (
          <p className="no-reviews">{getText('Tätä elokuvaa ei ole vielä arvosteltu. Ole ensimmäinen, joka kirjoittaa arvostelun!', 'No reviews yet. Be the first to review this movie!')}</p>
        )}
      </div>
    </section>
  )
}

export default MoviePage