import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MCService from './services/MCService.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { Buffer } from 'buffer'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [movies, setMovies] = useState([])
  const [image, setImage] = useState({})
  const [currentMember, setCurrentMember] = useState({})
  const [updateMovieList, setUpdateMovieList] = useState(false)
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
        console.error('Error fetching user data:', error)
      })
    } 
  },[updateMovieList])
  //Logout user when token expires
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token')
        alert('Session expired, logging out...')
        setCurrentMember([])
        navigate('/')
      }
    }
    const interval = setInterval( 60 * 1000)
    return () => clearInterval(interval)
  },[navigate])

  //Populate list of movies
  useEffect(() => {
    MCService
      .getMovies()
      .then(response => {
        setMovies(response.data)
      })
      .catch((error) => {
        console.error('Error populating movies:', error)
      })
  },[updateMovieList])
  
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
          console.error(`Error loading image for movie ${movie.id}:`, error)
        })
      })
  },[movies])

  return (
    <div>
    <Header movies={movies} image={image} currentMember={currentMember} setCurrentMember={setCurrentMember} updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList}/>
    <Footer/>
    </div>
  )
}

export default App
