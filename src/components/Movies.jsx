import Filter from './Filter'
import MovieCard from './MovieCard'
import '../styles/Movies.css'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { useEffect, useRef, useCallback } from 'react'
import useMovieList from '../hooks/movies/useMovieList'
import useMovieFilters from '../hooks/movies/useMovieFilters'

const Movies = () => {
  const { 
    movies, 
    movieRatings,
    isLoading: isInitialLoading, 
    isLoadingMore,
    hasMoreMovies,
    loadMovies,
    loadMovieRatings,
    handleScrollForMoreMovies,
    checkIfMoreContentNeeded,
  } = useMovieList()

  const { page } = useMovieFilters()
  const { getText } = useLanguageUtils()

  const initialLoadRef = useRef(false)
  const scrollTimeoutRef = useRef(null)

  // Manual debounce for scroll handler (from top code)
  const debouncedScrollHandler = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      handleScrollForMoreMovies()
    }, 150)
  }, [handleScrollForMoreMovies])

  // Load movies on initial render only once
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true
      loadMovies(1)
    }
  }, [loadMovies])

  // Load more movies on page change
  useEffect(() => {
    if (page > 1) {
      loadMovies(page)
    }
  }, [page, loadMovies])

  // Load movie ratings after movies load and initial loading finishes
  useEffect(() => {
    if (movies.length > 0 && !isInitialLoading) {
      loadMovieRatings()
    }
  }, [movies, isInitialLoading, loadMovieRatings])

  // Setup scroll listener
  useEffect(() => {
    const handleScroll = () => {
      debouncedScrollHandler()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    if (movies.length > 0) {
      const timer = setTimeout(checkIfMoreContentNeeded, 500)

      return () => {
        clearTimeout(timer)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        window.removeEventListener('scroll', handleScroll)
      }
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [debouncedScrollHandler, checkIfMoreContentNeeded, movies.length])

  return (
    <div className="main-content">
      {/* Filter bar */}
      <Filter />
      
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
              <MovieCard
                key={movie.fi_id || movie.id}
                movie={movie}
                movieRating={movieRatings[movie.fi_id]}
              />
            ))}
          </ul>
          
          {/* Loading More and End of results */}
          {isLoadingMore && (
            <div className="loading-more-container active">
              <p className="loading-more">
                {getText('Ladataan lisää elokuvia...', 'Loading more movies...')}
              </p>
            </div>
          )}
          {!hasMoreMovies && movies.length > 0 && (
            <div className="end-of-results-container active">
              <p className="end-of-results">
                {getText('Olet saavuttanut lopun.', `You've reached the end.`)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Movies