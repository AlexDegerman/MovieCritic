import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import MCService from '../services/MCService'
import { Link } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import { handleApiError } from '../utils/apiErrorHandler'
import { useNavigate } from 'react-router-dom'
import '../styles/MoviePage.css'
import { Calendar, Clock, Info, Languages, MessageCircle, Pen, Star, Subtitles, Tag, Trash2, UserCircle, Video } from 'lucide-react'

// This component displays a movie's page
const MoviePage = ({ movies, image, currentMember, setMovies, updateMovieRating }) => {
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

  // Set current movie from movies prop
  useEffect(() => {
    if (movies && movies.length > 0) {
      const currentMovie = movies[index]
        setMovie(currentMovie)
    }
  }, [movies, index])

  // Populate review list
  useEffect(() => {
    if (movie && movie.id) {
      setLoading(true)
      MCService
        .getReviews(movie.id)
        .then(response => {
        const sortedReviews = response.data.sort((a,b) =>
          new Date(b.luotuaika) - new Date(a.luotuaika)
        )
          setReviews(sortedReviews)
          setLoading(false)
      })
        .catch((error) => {
          showError(handleApiError(error, "Error loading reviews. Please try again."))
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
    if (reviews.length === 0) return "Unrated"
    const total = reviews.reduce((sum, review) => sum + review.tahdet, 0)
    return (total / reviews.length).toFixed(1)
  }

  useEffect(() => {
    if (movie?.id) {
      const average = calculateAverage(reviews)
      updateMovieRating(movie.id, average, reviews.length > 0)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews])

  // Temporary returns while movie loads or movie is not found
  if (loading) {
    return <div>Loading movie details...</div>
  }
  if (!movie || Object.keys(movie).length === 0) {
    return <div>Movie not found</div>
  }

  const movieImage = image[movie.id]

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
      showError("Please log in to submit a review")
      return
    }
    const newReview = {
      ...review,
      elokuvaid: movie.id,
      jasenid: currentMember.id,
      luotuaika: new Date().toISOString(),
      elokuvanOtsikko: movie.otsikko,
    }
    const token = localStorage.getItem('token')
    if (token) {
    try {
      const savedReview = await MCService.postReview(newReview, token)
      setReviews(prev => [savedReview, ...prev])
      setReview({
        otsikko: "",
        sisalto: "",
        tahdet: "",
        nimimerkki: currentMember.nimimerkki,
      })
      setShowReviewForm(false)
      showSuccess("Succesfully added the review!")
      setUpdateReviews(!updateReviews)
      
    } catch {
      showError("Failed to add review. Please try again")
      }
    } else {
      showError("Missing login. Please login.")
    }
  }

  const deleteReview = (id) => {
    const token = localStorage.getItem('token')
    if (token) {
    showWarning("Are you sure you want to delete your review?", 
      {
        onConfirm: async () => {
          try {
            await MCService.deleteReview(id, token)
            showSuccess("Successfully deleted your review!")
          } catch {
            showError("Error deleting review.")
          }
        },
        onCancel: () => {
          setTimeout(() => {
            showInfo("Cancelled deletion.")
          }, 100)
        }
      })}
  }

  const deleteMovie = (id) => {
    const token = localStorage.getItem('token')
    if (token) {
    showWarning("Are you sure you want to delete the movie? All reviews on it will be removed aswell.", 
      {
        onConfirm: async () => {
          try {
            setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id))
            await MCService.deleteMovie(id, token)
            showSuccess("Successfully deleted the movie!")
            navigate('/')
          } catch {
            showError("Error deleting movie.")
          }
        },
        onCancel: () => {
          setTimeout(() => {
            showInfo("Cancelled deletion.")
          }, 100)
        }
      })}
  }

  return (
    <section className="movie-page-container">
      <div className="movie-title-container">
        <h1 className="movie-title">{movie.otsikko}</h1>
        <img src={movie.kuvan_polku} alt={`${movie.otsikko} image`} className="movie-image" />
      </div>

      <div className="movie-details">
        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Star size="20px"/>
            <label className="movie-detail-label"> Average Rating</label>
          </div>
          <p className="movie-detail">
            {calculateAverage(reviews)}
            {reviews.length > 0 && ` / 5 `}
            <span className="review-count">
            {reviews.length > 0 && `(${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`}
            </span>
          </p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Languages size="20px"/>
            <label className="movie-detail-label"> Suomalainen nimi</label>
          </div>
          <p className="movie-detail">{movie.otsikko}</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Tag size="20px"/>
            <label className="movie-detail-label"> Lajityypit </label>
          </div>
          <p className="movie-detail">{movie.lajityypit}</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Calendar size="20px"/>
            <label className="movie-detail-label"> Valmistumisvuosi</label>
          </div>
          <p className="movie-detail">{movie.valmistumisvuosi}</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Clock size="20px"/>
            <label className="movie-detail-label"> Pituus</label>
          </div>
          <p className="movie-detail">{movie.pituus} min</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Video size="20px"/>
            <label className="movie-detail-label"> Ohjaaja</label>
          </div>
          <p className="movie-detail">{movie.ohjaaja}</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Pen size="20px"/>
            <label className="movie-detail-label"> Käsikirjoittajat</label>
          </div>
          <p className="movie-detail">{movie.kasikirjoittajat}</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <UserCircle size="20px"/>
            <label className="movie-detail-label"> Päänäyttelijät</label>
          </div>
          <p className="movie-detail">{movie.paanayttelijat}</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <MessageCircle size="20px"/>
            <Subtitles size="20px"/>
            <label className="movie-detail-label"> Kieli</label>
          </div>
          <p className="movie-detail">{movie.alkuperainen_kieli}</p>
        </div>

        <div className="movie-detail-item">
          <div className="icon-label-container">
            <Info size="20px"/>
            <label className="movie-detail-label"> Kuvaus</label>
          </div>
          <p className="movie-detail">{movie.kuvaus}</p>
        </div>
      </div>

      <button onClick={() => setShowReviewForm(!showReviewForm)} className="show-review-form-btn" ref={reviewFormRef}> {showReviewForm ? 'Hide Review Form' : 'Add a Review'}</button>
      {showReviewForm && (
      <div className="review-form">
        <p className="review-form-header">Write a Review</p>
        <form onSubmit={addReview}>
          <div className="review-form-input-container">
            <label className="review-form-label">Title</label>
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
            <label className="review-form-label">Review</label>
            <textarea 
            className="review-form-textarea" 
            name="sisalto" 
            value={review.sisalto} 
            onChange={handleChange} 
            required 
          />
          </div>
            <div className="review-form-input-container">
              <label className="review-form-label">Rating (0-5)</label>
              <select 
                className="review-form-select" 
                name="tahdet" 
                value={review.tahdet} 
                onChange={handleRatingChange} 
                required
                >
                <option hidden>Select a Rating</option>
                <option value="5" className="review-rating">★★★★★ (5)</option>
                <option value="4" className="review-rating">★★★★☆ (4)</option>
                <option value="3" className="review-rating">★★★☆☆ (3)</option>
                <option value="2" className="review-rating">★★☆☆☆ (2)</option>
                <option value="1" className="review-rating">★☆☆☆☆ (1)</option>
                <option value="0" className="review-rating">☆☆☆☆☆ (0)</option>
              </select>
              </div>
            <button type="submit" className="review-form-button">Submit Review</button>
          </form>
        </div>
      )}
        {currentMember && (
        <div className="delete-movie-btn-container">
          <Trash2 size={20} color="#7e7c7c"/>
          <button onClick={() => deleteMovie(movie.id)} className="delete-movie-btn">Delete Movie</button>
        </div>
        )}
        <div className="reviews-section">
          <p className="reviews-header">Reviews</p>
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
                  <Link to={`/profile/${review.jasenid}`} className="review-author-link">{review.nimimerkki}</Link> • {new Date(review.luotuaika).toLocaleDateString('en-GB')}
                </div>
                {review.nimimerkki === currentMember.nimimerkki && (
                <div className="delete-review-btn-container">
                  <Trash2 size={20} color="#7e7c7c"/>
                  <button onClick={() => deleteReview(review.id)} className="delete-review-btn">Delete Review</button>
                </div>
                )}
              </div>
            ))
          ) : (
          <p className="no-reviews">No reviews yet. Be the first to review this movie!</p>
        )}
      </div>
    </section>
  )
}

export default MoviePage