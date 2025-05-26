import useReviewStore from '../../stores/reviewStore'

// Hook for accessing and managing movie reviews and ratings
export const useMovieReviews = () => {
  const reviews = useReviewStore(s => s.reviews)
  const movieRatings = useReviewStore(s => s.movieRatings)
  const loadReviews = useReviewStore(s => s.loadReviews)
  const loadMovieRatings = useReviewStore(s => s.loadMovieRatings)
  const addReview = useReviewStore(s => s.addReview)
  const deleteReview = useReviewStore(s => s.deleteReview)
  const likeReview = useReviewStore(s => s.likeReview)
  const getMovieRating = useReviewStore(s => s.getMovieRating)

  return {
    reviews,
    movieRatings,
    loadReviews,
    loadMovieRatings,
    addReview,
    deleteReview,
    likeReview,
    getMovieRating
  }
}

export default useMovieReviews
