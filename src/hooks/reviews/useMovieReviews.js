import useMovieStore from '../../stores/movieStore'

// Hook for accessing and managing movie reviews
export const useMovieReviews = () => {
  const reviews = useMovieStore(s => s.reviews)
  const isLoading = useMovieStore(s => s.isLoading)
  const loadReviews = useMovieStore(s => s.loadReviews)
  const addReview = useMovieStore(s => s.addReview)
  const deleteReview = useMovieStore(s => s.deleteReview)
  const likeReview = useMovieStore(s => s.likeReview)
  
  return {
    reviews,
    isLoading,
    loadReviews,
    addReview,
    deleteReview,
    likeReview
  }
}

export default useMovieReviews