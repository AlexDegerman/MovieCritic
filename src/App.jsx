import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MCService from './services/MCService.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { Buffer } from 'buffer'
const App = () => {
  const [movies, setMovies] = useState([])
  const [image, setImage] = useState([])

  //Populate list of movies
  useEffect(() => {
    MCService
      .getMovies()
      .then(response => {
        setMovies(response.data)
      })
      .catch((error) => {
        console.error(error.message)
      })
  },[])
  
  // Fetch image for every movie
  useEffect(() => {
      movies.map((movies,index) => 
        MCService.getImage(index + 1)
        .then((response => {
          const b64 = Buffer.from(response.data,'binary').toString('base64')
          const mime = response.headers['image/jpeg']
          setImage((previmage) => previmage.concat(`data:${mime};base64,${b64}`))
        }))
        .catch((error) => {
          console.error(error.message)
        }))
  },[movies])

  return (
    <div>
    <Header movies={movies} image={image}/>
    <Footer/>
    </div>
  )
}

export default App
