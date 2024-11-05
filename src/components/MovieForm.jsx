import { useState } from 'react'
import MCService from '../services/MCService'
import { useNavigate } from 'react-router-dom'
import { MOVIE_GENRES } from '../constants/movieGenres'
import { useAlertMessages } from '../hooks/useAlertMessages'

// This component displays a form to add movies to the database
const MovieForm = ({ setUpdateMovieList }) => {
  const navigate = useNavigate()
  const {showSuccess, showError } = useAlertMessages()
  const [movie, setMovie] = useState({
    alkuperainennimi: "",
    suomalainennimi: "",
    lajityyppi: "",
    valmistumisvuosi: "",
    pituus: "",
    ohjaaja: "",
    kasikirjoittajat: "",
    paanayttelijat: "",
    kieli: "",
    kuvaus: "",
    kuva: null
  })

  // Handle all input field changes
  const handleChange = (event) => {
    const { name, value, type, files } = event.target

    if (type === "file") {
      setMovie((prevMovie) => ({
        ...prevMovie,
        [name]: files[0]
      }))
    } else {
      setMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value
      }))
    }
  }

  //Adds a new movie to the database
  const addMovie = async (event) => {
    event.preventDefault()
    
    const newMovie = new FormData()
    Object.keys(movie).forEach((key) => {
      newMovie.append(key, movie[key])
    })

    const token = localStorage.getItem('token')
    if (token) {
    try {
      await MCService.postMovie(newMovie, token)
      showSuccess("Succesfully added the movie!", () => {
        setUpdateMovieList(prev => !prev)
        navigate('/')
      })
    } catch {
        showError("Failed to add movie. Please try again.")
      }
    } else {
      showError("Missing login")
    }
  }

  return (
    <div>
      <h1>Add Movie</h1>
      <form onSubmit={addMovie}>
        <label>
          Alkuperäinen nimi:
          <input type="text" name="alkuperainennimi" value={movie.alkuperainennimi} onChange={handleChange} required />
        </label>
        <label>
          Suomalainen nimi:
          <input type="text" name="suomalainennimi" value={movie.suomalainennimi} onChange={handleChange} required />
        </label>
        <label>
          Lajityypit:
          <select type="text" name="lajityyppi" value={movie.lajityyppi} onChange={handleChange} required>
            <option>Select Genre</option>
            {MOVIE_GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Valmistumisvuosi:
          <input type="text" name="valmistumisvuosi" value={movie.valmistumisvuosi} onChange={handleChange} required />
        </label>
        <label>
          Pituus minuutteina:
          <input type="text" name="pituus" value={movie.pituus} onChange={handleChange} required />
        </label>
        <label>
          Ohjaaja:
          <input type="text" name="ohjaaja" value={movie.ohjaaja} onChange={handleChange} required />
        </label>
        <label>
          Käsikirjoittajat:
          <input type="text" name="kasikirjoittajat" value={movie.kasikirjoittajat} onChange={handleChange} required />
        </label>
        <label>
          Päänäyttelijät:
          <input type="text" name="paanayttelijat" value={movie.paanayttelijat} onChange={handleChange} required />
        </label>
        <label>
          Kieli puhuttuna ja tekstitettynä:
          <input type="text" name="kieli" value={movie.kieli} onChange={handleChange} required />
        </label>
        <label>
          Elokuvan kuvaus:
          <textarea type="text" name="kuvaus" value={movie.kuvaus} onChange={handleChange} required />
        </label>
        <label>
          Elokuvan kuva JPEG muodossa:
          <input type="file" name="kuva" onChange={handleChange} accept="image/jpeg" required />
        </label>
        <button type="submit"> Submit </button>
      </form>
    </div>
  )
}

export default MovieForm