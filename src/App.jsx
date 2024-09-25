import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import mc from './services/mc'
import { useState } from 'react'
import { useEffect } from 'react'
import { Buffer } from 'buffer'
const App = () => {
  const [movies, setMovies] = useState([])
  const [image, setImage] = useState([])

  //Populate list of movies and their images
  useEffect(() => {
    mc
      .getMovies()
      .then(response => {
        setMovies(response.data)
    })
  },[])
  
  // Fetch image for every movie
  useEffect(() => {
    movies.map((movies,index) => 
      mc.getImage(index + 1)
        .then((response => {
          const b64 = Buffer.from(response.data, 'binary').toString('base64')
          const mime = response.headers['image/jpeg']
          setImage((previmage) => previmage.concat(`data:${mime};base64,${b64}`))
        })
      )) 
  },[movies])

  return (
    <div>
    <Header movies={movies} image={image}/>
    <Footer/>
    </div>
  )
}

export default App
