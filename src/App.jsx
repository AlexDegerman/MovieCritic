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

const App = () => {
  const [movies, setMovies] = useState([])
  const [image, setImage] = useState({})
  const [currentMember, setCurrentMember] = useState({})
  const [updateMovieList, setUpdateMovieList] = useState(false)
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

  // Populate list of movies
  useEffect(() => {
    MCService
      .getMovies()
      .then(response => {
        const sortedMovies = response.data.sort((a,b) => b.id - a.id)
        setMovies(sortedMovies)
      })
      .catch((error) => {
        showError(handleApiError(error, "Failed to load movie images. Please try again."))
      })
  },[updateMovieList, showError])
  
  // Fetch image for every movie
  useEffect(() => {
    setImage({})

      movies.forEach(movie => {
        MCService.getImage(movie.id)
        .then(response => {
          const b64 = Buffer.from(response.data,'binary').toString('base64')
          const mime = 'image/jpeg'
          setImage(prevImage => ({
            ...prevImage,
            [movie.id]: `data:${mime};base64,${b64}`
          }))
        })
        .catch((error) => {
          showError(handleApiError(error, "Failed to load movie image. Please try again."))
        })
      })
  },[movies, showError])

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
      />
    
    <main className="main-content">
      <Outlet />
    </main>

    <Footer />
  </div>
  )
}

export default App
