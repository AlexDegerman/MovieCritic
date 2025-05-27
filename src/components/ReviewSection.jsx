import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsUp, Trash2 } from 'lucide-react'
import { useAlertMessages } from '../hooks/useAlertMessages'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import '../styles/ReviewSection.css'
import useMovieDetails from '../hooks/movies/useMovieDetails'
import useMovieReviews from '../hooks/reviews/useMovieReviews'
import useAuthStore from '../stores/authStore'

// This component displays a list of reviews
const ReviewSection = ({ currentMember }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const reviewFormRef = useRef(null)
  const { movie } = useMovieDetails()
  const { 
    reviews, 
    isLoading: loading,
    loadReviews, 
    addReview, 
    deleteReview, 
    likeReview 
  } = useMovieReviews()

  const [review, setReview] = useState({
    otsikko: "",
    sisalto: "",
    tahdet: "",
    nimimerkki: currentMember.nimimerkki,
  })

  const { showSuccess, showError, showWarning, showInfo } = useAlertMessages()
  const { language, getText } = useLanguageUtils()
  const likedReviews = JSON.parse(localStorage.getItem('likedReviews')) || []
  const isDemoUser = useAuthStore(state => state.isDemoUser)

  // Populate review list
  useEffect(() => {
    if (movie?.fi_id) {
      loadReviews(movie.fi_id).then(result => {
        if (!result.success) {
          showError(result.error)
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie])

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

  // Add review button handler
  const handleAddReview = async (event) => {
    event.preventDefault()
    if (isDemoUser) {
      showInfo(getText("Arvostelujen lisääminen on poissa käytöstä demotilassa.", "Adding reviews is disabled in demo mode."))
      return
    }
    if (!currentMember) {
      showError(getText("Kirjaudu sisään voidaksesi jättää arvostelun.", "Please log in to submit a review"))
      return
    }
    
    const newReview = {
      ...review,
      elokuvaid: movie.fi_id,
      jasenid: currentMember.id,
      elokuvanOtsikko: movie.otsikko,
      elokuvanTitle: movie.title,
      tmdb_id: movie.tmdb_id
    }
    
    const result = await addReview(newReview)
    
    if (result.success) {
      setReview({
        otsikko: "",
        sisalto: "",
        tahdet: "",
        nimimerkki: currentMember.nimimerkki,
      })
      setShowReviewForm(false)
      showSuccess(getText("Arvostelu lisätty onnistuneesti!", "Successfully added the review!"))
    } else {
      showError(result.error || getText("Arvostelun lisääminen epäonnistui. Yritä uudelleen.", "Failed to add review. Please try again"))
    }
  }

  // Delete review button handler
  const handleDeleteReview = (id) => {
    if (isDemoUser) {
      showInfo(getText("Arvostelujen poistaminen on poissa käytöstä demotilassa.", "Deleting reviews is disabled in demo mode."))
      return
    }
    
    showWarning(
      getText("Oletko varma, että haluat poistaa arvostelusi?", "Are you sure you want to delete your review?"), 
      {
        onConfirm: async () => {
          const result = await deleteReview(id)
          if (result.success) {
            showSuccess(getText("Arvostelusi on poistettu onnistuneesti!", "Successfully deleted your review!"))
          } else {
            showError(result.error || getText("Virhe arvostelun poistamisessa.", "Error deleting review."))
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

  // Like button handler
  const handleLike = async (id) => {
    const result = await likeReview(id)
    
    if (!result.success) {
      showError(result.error || getText("Virhe arvostelun tykkäyksen lisäämisessä", "Error liking the review"))
    }
  }

  if (loading) {
    return <div>{getText("Ladataan arvosteluja...", "Loading reviews...")}</div>
  }

  if (!movie) {
    return null
  }

  return (
    <div className="reviews-section">
      {/* Review Form Toggle Button */}
      <button 
        onClick={() => setShowReviewForm(!showReviewForm)} 
        className="show-review-form-btn"
        ref={reviewFormRef}
      >
        {showReviewForm 
          ? getText('Piilota arvostelulomake', 'Hide Review Form') 
          : getText('Lisää arvostelu', 'Add a Review')}
      </button>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
        <div className="review-form">
          <p className="review-form-header">{getText('Kirjoita arvostelu', 'Write a Review')}</p>
          <form onSubmit={handleAddReview}>
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
        </div>
      )}

      {/* Reviews List */}
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
              <Link 
                to={`/profile/${review.jasenid}`}  
                className={`review-author-link ${review.displayed_nimimerkki === 'Deleted User' ? 'deleted-user-link' : ''}`}
              >
                {review.displayed_nimimerkki}
              </Link> 
              • 
              {new Date(review.luotuaika).toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US')}
            </div>
            <button 
              className={`like-button ${likedReviews.includes(review.id) ? 'liked' : ''}`} 
              onClick={() => handleLike(review.id)}
            >
              <ThumbsUp size={20} /> {review.tykkaykset}
            </button>
            {currentMember && review.nimimerkki === currentMember.nimimerkki && (
              <div className="delete-review-btn-container">
                <Trash2 size={20} color="#7e7c7c"/>
                <button 
                  onClick={() => handleDeleteReview(review.id)} 
                  className="delete-review-btn"
                >
                  {getText('Poista Arvostelu', 'Delete Review')}
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="no-reviews">
          {getText('Tätä elokuvaa ei ole vielä arvosteltu. Ole ensimmäinen, joka kirjoittaa arvostelun!', 'No reviews yet. Be the first to review this movie!')}
        </p>
      )}
    </div>
  )
}

export default ReviewSection