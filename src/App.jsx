import './App.css'
import Header from './components/Header'
import Movies from './components/Movies'
import Footer from './components/Footer'
import mc from './services/mc'
import { useState } from 'react'
import { useEffect } from 'react'

const App = () => {
  const [movies, setMovies] = useState([])

  //Populate list of movies
  useEffect(() => {
    mc
      .getMovies()
      .then(response => {
        setMovies(response.data)
        console.log(response.data)
    })
    
  },[])

  return (
    <div>
    <Header/>
    <ul>
      {/* Display every movie in list */}
      {movies.map((movie, index) =>
      <div key={index}>
        <Movies movie={movie}/>
        </div>
      )}
    </ul>
    <Footer/>
    </div>
  )
}

export default App
