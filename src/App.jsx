import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MCService from './services/MCService.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { Buffer } from 'buffer'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from './hooks/useAlertMessages.js'
import { handleApiError } from './utils/apiErrorHandler.js'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const App = () => {
  const [movies, setMovies] = useState([])
  const [image, setImage] = useState({})
  const [currentMember, setCurrentMember] = useState({})
  const [updateMovieList, setUpdateMovieList] = useState(false)
  const [movieRatings, setMovieRatings] = useState({})
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const { showInfo, showError } = useAlertMessages()
  const navigate = useNavigate()

  //Fetch logged in member's data
  useEffect(() => { 
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      const memberId = decodedToken.id
      
      MCService
        .getProfile(memberId, token)
        .then(response => {setCurrentMember(response.data)})
        .catch((error) => {
          showError(handleApiError(error, "Failed to get current member's data. Please try again."))
          
      })
    } 
  },[updateMovieList, showError])

  // Logout user when token expires
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token')
      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000
      
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token')
          showInfo("Session expired, logging out...", () => {
            setCurrentMember([])
            navigate('/')
          })
        }
      }
    }
    checkToken()

    const interval = setInterval(checkToken, 60 * 1000)
    return () => clearInterval(interval)
  },[navigate, showInfo])

  // Populate list of movies and check for duplicates
  useEffect(() => {
    const loadMovies = () => {
      setIsLoading(true)
      MCService.getMovies(page)
        .then(response => {
          const sortedMovies = response.data.sort((a, b) => b.id - a.id)
          setMovies(prevMovies => {
            const newMovies = sortedMovies.filter(
              movie => !prevMovies.some(existingMovie => existingMovie.id === movie.id)
            )
            return [...prevMovies, ...newMovies]
          })
        })
        .catch(error => {
          showError(handleApiError(error, "Failed to load movies. Please try again."))
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    loadMovies()
  },[updateMovieList, showError, page])

  useEffect(() => {
    console.log(movies)
  },[movies])


  // Add scroll event listener to detect when the user reaches the bottom of the page
  useEffect(() => {
    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  // Load intial ratings when movies load
  useEffect(() => {
    setMovieRatings({})
    movies.forEach(movie => {
      MCService.getReviews(movie.id)
      .then(response => {
        const reviews = response.data
        const rating = reviews.length === 0 ? "Unrated" : (reviews.reduce((sum, review) => sum + review.tahdet, 0) / reviews.length)

        setMovieRatings(prevRatings => ({
          ...prevRatings,
          [movie.id]: rating
        }))
      })
      .catch(error => {
        showError(handleApiError(error, "Failed to load movie rating. Please try again."))
        setMovieRatings(prevRatings => ({
          ...prevRatings,
          [movie.id]: "Unrated"
        }))
      })
    })
  }, [movies, showError])

  // Load more movies when user scrolls to bottom of movie list
  const handleScroll = () => {
    if (location.pathname === '/' && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && !isLoading) {
      setPage(prevPage => prevPage + 1)
    }
  }
  
  // Updates movie ratings
  const updateMovieRating = (movieId, rating) => {
    setMovieRatings(prev => ({
      ...prev,
      [movieId]: rating
    }))
  }

  return (
    <div className="container">
      <Header 
      movies={movies} 
      image={image} 
      currentMember={currentMember} 
      setCurrentMember={setCurrentMember} 
      updateMovieList={updateMovieList} 
      setUpdateMovieList={setUpdateMovieList} 
      setMovies={setMovies} 
      movieRatings={movieRatings}
      updateMovieRating={updateMovieRating}
      isLoading={isLoading}
      />
    
    <main className="main-content">
      <Outlet />
    </main>

    <Footer />
  </div>
  )
}

export default App
