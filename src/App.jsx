/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MCService from './services/MCService.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useAlertMessages } from './hooks/useAlertMessages.js'
import { handleApiError } from './utils/apiErrorHandler.js'
import { useLocation } from 'react-router-dom'
import { useLanguageUtils } from './hooks/useLanguageUtils.js'
import { useDebounce } from './hooks/useDebounce.js'
import MovieForm from './components/MovieForm.jsx'
import MemberForm from './components/MemberForm.jsx'
import Profile from './components/Profile.jsx'
import Movies from './components/Movies.jsx'
import MoviePage from './components/MoviePage.jsx'
import Login from './components/Login.jsx'
import About from './components/About.jsx'
import PasswordChange from './components/PasswordChange.jsx'
import { useAuth } from './context/AuthContext.js'

const App = () => {
  const [movies, setMovies] = useState([])
  const [currentMember, setCurrentMember] = useState({})
  const [updateMovieList, setUpdateMovieList] = useState(false)
  const [movieRatings, setMovieRatings] = useState({})
  const [loadedMovieRatings, setLoadedMovieRatings] = useState({})
  const [page, setPage] = useState(1)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [seed, setSeed] = useState(Date.now())
  const [triggerDemoLogin, setTriggerDemoLogin] = useState(false)
  const location = useLocation()
  const { showInfo, showError } = useAlertMessages()
  const navigate = useNavigate()
  const {getText} = useLanguageUtils()
  const debouncedSearch = useDebounce(search, 500)
  const debouncedGenre = useDebounce(genre, 500)
  const { isDemoUser, setIsDemoUser } = useAuth() 

  // Autologin as demo user to view full features of website without having to login
  useEffect(() => {
    const autoDemoLogin = async () => {
        showInfo(getText("Kirjaudutaan sisään demo-käyttäjänä", "Logging in as Demo User"))
        try {
          const demoToken = await MCService.getDemoToken()
          
          const response = await MCService.demoLogin(demoToken)

          if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            const decodedToken = jwtDecode(response.data.token)
            const memberId = decodedToken.id
            const profileResponse = await MCService.getProfile(memberId, response.token)
            setCurrentMember(profileResponse.data)
            setIsDemoUser(decodedToken.isDemoUser === true)

            if (location.pathname !== '/') {
              navigate('/')
            }
          }
        } catch (error) {
          showError(
            handleApiError(error, getText("Automaattinen kirjautuminen epäonnistui.", "Automatic login failed."))
          )
        }
      }
    const token = localStorage.getItem('token')
    if (!token && location.pathname !== '/login') {
      autoDemoLogin()
    }
  }, [location.pathname, triggerDemoLogin, setIsDemoUser])

  // Fetch logged in member's data
  useEffect(() => { 
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      const memberId = decodedToken.id
      
      MCService
        .getProfile(memberId, token)
        .then(response => {
          setCurrentMember(response.data)
        })
        .catch((error) => {
          showError(
            handleApiError(error, getText("Nykyisen jäsenen tietojen hakeminen epäonnistui. Yritä uudelleen.", "Failed to get current member's data. Please try again."))
          )
        })
    }
  }, [updateMovieList, showError])
  

  // Logout user when token expires
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token')
      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000
      
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token')
          showInfo(getText("Istunto on päättynyt, kirjaudutaan ulos...", "Session expired, logging out..."), () => {
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

  // Populate movie list and remove duplicates
  useEffect(() => {
    if (location.pathname === '/') {
    const newSeed = Date.now()
    setSeed(newSeed)
    
    const loadMovies = () => {
      if (page === 1) {
        setIsInitialLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      MCService.getMovies(page, search, genre, seed)
        .then(response => {

          setMovies(prevMovies => {
            if (page === 1) {
              return response.data.movies
            }
            const newMovies = response.data.movies.filter(movie =>
              !prevMovies.some(existingMovie =>
                existingMovie.tmdb_id === movie.tmdb_id
              )
            )
            return [...prevMovies, ...newMovies]
          })

          if (!seed) setSeed(response.data.seed)
        })
        .catch(error => {
          showError(handleApiError(error, getText("Elokuvia ei saatu ladattua. Yritä uudelleen.", "Failed to load movies. Please try again.")))
        })
        .finally(() => {
          setIsInitialLoading(false)
          setIsLoadingMore(false)
        })
    }
    
    loadMovies()
    }
  }, [updateMovieList, page, debouncedSearch, debouncedGenre, location.pathname])

  // Reset page when search or genre changes
  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    }
  }, [debouncedSearch, debouncedGenre])

  // Add scroll event listener to detect when the user reaches the bottom of the page
  useEffect(() => {
    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [location.pathname, isLoadingMore])

  // Load ratings for movies
  useEffect(() => {
    const moviesToLoadRatings = movies.filter(movie => 
      !loadedMovieRatings[movie.fi_id]
    ).slice(0, 21)

    const loadRatings = async () => {
      for (const movie of moviesToLoadRatings) {
        try {
          const response = await MCService.getReviews(movie.fi_id)
          const reviews = response.data
          const rating = reviews.length === 0 
            ? "Unrated" 
            : (reviews.reduce((sum, review) => sum + review.tahdet, 0) / reviews.length).toFixed(1)

          setMovieRatings(prevRatings => ({
            ...prevRatings,
            [movie.fi_id]: rating
          }))

          setLoadedMovieRatings(prev => ({
            ...prev,
            [movie.fi_id]: true
          }))
        } catch (error) {
          showError(handleApiError(error, getText("Elokuvien arvosteluita ei saatu ladattua. Yritä uudelleen.", "Failed to load movie rating. Please try again.")))
          
          setMovieRatings(prevRatings => ({
            ...prevRatings,
            [movie.fi_id]: "Unrated"
          }))
        }
      }
    }

    if (moviesToLoadRatings.length > 0) {
      loadRatings()
    }
  }, [movies])

  // Load more movies when user scrolls to bottom of movie list
  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const windowHeight = window.innerHeight
    const scrollHeight = document.documentElement.scrollHeight
  
    if (
      location.pathname === '/' && 
      windowHeight + scrollTop >= scrollHeight && 
      !isLoadingMore
    ) {
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
      <Header currentMember={currentMember} setCurrentMember={setCurrentMember} setTriggerDemoLogin={setTriggerDemoLogin}/>

    <main className="main-content">
    {isDemoUser && (
        <div className="demo-mode-banner" onClick={() => navigate('/login')}>{getText("DEMO TILA","DEMO MODE")}</div>
      )}
    <Routes>
        <Route path="/addmovie" element={<MovieForm updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList} />} />
        <Route path="/addmember" element={<MemberForm />} />
        <Route path="/profile/:id" element={<Profile currentMember={currentMember} setCurrentMember={setCurrentMember} movies={movies} />} />
        <Route path="/" element={<Movies movies={movies} movieRatings={movieRatings} search={search} setSearch={setSearch} genre={genre} setGenre={setGenre} isInitialLoading={isInitialLoading} isLoadingMore={isLoadingMore}  />} />
        <Route path="/movie/:index" element={<MoviePage movies={movies} currentMember={currentMember} setMovies={setMovies} updateMovieRating={updateMovieRating} />} />
        <Route path="/login" element={<Login updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList} />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/change-password" element={<PasswordChange currentMember={currentMember}/>}/>
      </Routes>
    </main>

    <Footer />
  </div>
  )
}

export default App