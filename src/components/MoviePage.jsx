import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MCService from "../services/MCService"
import { Link } from "react-router-dom"

// This component displays a movie's page
const MoviePage = ({ movies, image, currentMember }) => {
  const {index} = useParams()
  const [review, setReview] = useState({
    otsikko: "",
    sisalto: "",
    tahdet: "",
    nimimerkki: currentMember.nimimerkki,
    elokuvanalkuperainenimi: "",
    elokuvansuomalainennimi: ""
  })
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([])
  const [updateReviews, setUpdateReviews] = useState(false)
  const [loading, setLoading] = useState(true)

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
          console.error('Error loading reviews:', error)
          setLoading(false)
      })
    } else {
      setLoading(false)
    }
  },[updateReviews, movie])

  // Set nimimerkki to current member's
  useEffect(() => {
    if (currentMember) {
      setReview(prev => ({
        ...prev,
        nimimerkki: currentMember.nimimerkki
      }));
    }
  }, [currentMember]);

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
      console.error("Please log in to submit a review")
      return
    }
    const newReview = {
      ...review,
      elokuvaid: movie.id,
      jasenid: currentMember.id,
      luotuaika: new Date().toISOString(),
      elokuvanalkuperainennimi: movie.alkuperainennimi,
      elokuvansuomalainennimi: movie.suomalainennimi
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
      alert("Succesfully added the review!")
      setUpdateReviews(!updateReviews)
    } catch (error) {
      console.error("Error adding new review:", error)
      }
    } else {
      console.error('No token found')
    }
  }

  return (
    <>
      <div>
        <h1>{movie.alkuperainennimi}</h1>
        <img src={movieImage} alt={`${movie.alkuperainennimi} image`} />
      </div>

      <div>
        <h2>Write a Review</h2>
        <form onSubmit={addReview}>
          <div>
            <label>Title</label>
            <input type="text" name="otsikko" value={review.otsikko} onChange={handleChange} required/>
          </div>
          <div>
            <label>Review</label>
            <textarea name="sisalto" value={review.sisalto} onChange={handleChange} required/>
          </div>
          <div>
            <label>Rating (0-5)</label>
            <select name="tahdet" value={review.tahdet === undefined|| '' ? '' : String(review.tahdet)} onChange={handleRatingChange} required>
              <option value="" hidden>Select a Rating</option>
              <option style={{color: "#ffe400"}} value="5">★★★★★ (5)</option>
              <option style={{color: "#ffe400"}} value="4">★★★★☆ (4)</option>
              <option style={{color: "#ffe400"}} value="3">★★★☆☆ (3)</option>
              <option style={{color: "#ffe400"}} value="2">★★☆☆☆ (2)</option>
              <option style={{color: "#ffe400"}} value="1">★☆☆☆☆ (1)</option>
              <option style={{color: "#ffe400"}} value="0">☆☆☆☆☆ (0)</option>
            </select>
          </div>
          <button type="submit">Submit Review</button>
        </form>
      </div>

      <div>
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, i) => (
            <div key={i}>
              <div>
                <h3>{review.otsikko}</h3>
                <span style={{color: "#ffe400"}}>
                {'★'.repeat(Number(review.tahdet))}
                {'☆'.repeat(5 - Number(review.tahdet))}
                </span>
              </div>
              <p>{review.sisalto}</p>
              <div>
                <Link to={`/profile/${review.jasenid}`}>
                  {review.nimimerkki}
                </Link>
                {' • '}
                {new Date(review.luotuaika).toLocaleDateString('en-GB')}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this movie!</p>
        )}
      </div>
    </>
  )
}

export default MoviePage