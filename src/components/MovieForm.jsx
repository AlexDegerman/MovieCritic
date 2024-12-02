import { useState } from 'react'
import MCService from '../services/MCService'
import { useNavigate } from 'react-router-dom'
import { MOVIE_GENRES } from '../constants/movieGenres'
import { MOVIE_GENRES_FIN } from '../constants/movieGenresFin.js'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/MovieForm.css'
import { useLanguageUtils } from '../hooks/useLanguageUtils.js'
import { useAuth } from '../context/AuthContext'

// This component displays a form to add movies to the database
const MovieForm = ({ setUpdateMovieList }) => {
  const navigate = useNavigate()
  const {showSuccess, showError, showInfo} = useAlertMessages()
  const {language, getText} = useLanguageUtils()
  const genres = language === 'fi' ? MOVIE_GENRES_FIN : MOVIE_GENRES
  const { isDemoUser } = useAuth() 
  const [movie, setMovie] = useState({
    otsikko: "",
    lajityypit: [],
    valmistumisvuosi: "",
    pituus: "",
    ohjaaja: "",
    kasikirjoittajat: "",
    paanayttelijat: "",
    kieli: "",
    kuvaus: "",
    kuva: "",
    title: "",
    genres: [],
    release_date: "",
    runtime: "",
    director: "",
    writers: "",
    main_actors: "",
    original_language: "",
    overview: "",
    poster_path: "",
    selectedLanguage: language
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    
    if (name === "lajityypit" || name === "genres") {
      const selectedOptions = Array.from(event.target.selectedOptions, option => option.value)
      setMovie((prevMovie) => ({
        ...prevMovie,
        lajityypit: selectedOptions,
        genres: selectedOptions,
      }))
    } else if (name === "kuva" || name === "poster_path") {
      const isValidImageLink = value.match(/\.(jpeg|jpg|png)$/i) && value.match(/^https?:\/\/.+$/)
      if (isValidImageLink) {
        setMovie((prevMovie) => ({
          ...prevMovie,
          kuva: value,
          poster_path: value
        }))
      } else {
        showInfo(getText("Anna kelvollinen kuvalinkki, jonka pääte on .jpeg, .jpg tai .png.", "Please provide a valid image URL ending in .jpeg, .jpg, or .png."))
      }
    } else {
      const fieldMappings = {
        otsikko: 'title',
        valmistumisvuosi: 'release_date',
        pituus: 'runtime',
        ohjaaja: 'director',
        kasikirjoittajat: 'writers',
        paanayttelijat: 'main_actors',
        kieli: 'original_language',
        kuvaus: 'overview'
      }

      const reverseFieldMappings = Object.fromEntries(
        Object.entries(fieldMappings).map(([key, value]) => [value, key])
      )

      setMovie((prevMovie) => ({
        ...prevMovie,
        [name]: value,
        [fieldMappings[name] || reverseFieldMappings[name] || name]: value
      }))
    }
  }

  //Adds a new movie to the database
  const addMovie = async (event) => {
    event.preventDefault()
    if (isDemoUser) {
      showInfo(getText("Elokuvien lisääminen on poissa käytöstä demotilassa.", "Adding movies is disabled in demo mode."))
      return
    }
    const movieData = {
      selectedLanguage: movie.selectedLanguage,
      ...(movie.selectedLanguage === 'fi' ? {
        otsikko: movie.otsikko,
        lajityypit: movie.lajityypit.join(', '),
        valmistumisvuosi: movie.valmistumisvuosi,
        pituus: movie.pituus,
        ohjaaja: movie.ohjaaja,
        kasikirjoittajat: movie.kasikirjoittajat,
        paanayttelijat: movie.paanayttelijat,
        kieli: movie.kieli,
        kuvaus: movie.kuvaus,
        kuva: movie.kuva,
      } : {
        title: movie.title,
        genres: movie.genres.join(', '),
        release_date: movie.release_date,
        runtime: movie.runtime,
        director: movie.director,
        writers: movie.writers,
        main_actors: movie.main_actors,
        original_language: movie.original_language,
        overview: movie.overview,
        poster_path: movie.poster_path,
      })
    }
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await MCService.postMovie(movieData, token)
        showSuccess(getText("Elokuva lisätty onnistuneesti!", "Successfully added the movie!"), () => {
          setUpdateMovieList(prev => !prev)
          navigate('/')
        })
      } catch {
        showError(getText("Elokuvan lisääminen epäonnistui. Yritä uudelleen.", "Failed to add movie. Please try again."))
      }
    } else {
      showError(getText("Puuttuva kirjautuminen.", "Missing login"))
    }
  }

  return (
    <div className="movie-form">
      <form onSubmit={addMovie} className="movie-form-container">
        <h1 className="movie-title">{getText('Lisää Elokuva', 'Add Movie')}</h1>
        {/* Movie Form Inputs */}
        <label className="movie-input-label">
          {getText('Elokuvan Otsikko', `Movie's Title`)}
          <input 
            type="text" 
            name={language === 'fi' ? 'otsikko' : 'title'} 
            value={language === 'fi' ? movie.otsikko : movie.title} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <label className="movie-input-label">
          {getText('Lajityypit', 'Genres')}
          <select 
            type="text" 
            name={language === 'fi' ? 'lajityypit' : 'genres'} 
            value={language === 'fi' ? movie.lajityypit : movie.genres} 
            onChange={handleChange} 
            multiple 
            required 
            className="movie-select"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label className="movie-input-label">
          {getText('Julkaisuvuosi', 'Release Year')}
          <input 
            type="text" 
            name={language === 'fi' ? 'valmistumisvuosi' : 'release_date'} 
            value={language === 'fi' ? movie.valmistumisvuosi : movie.release_date} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <label className="movie-input-label">
          {getText('Pituus minuutteina', 'Runtime in minutes')}
          <input 
            type="text" 
            name={language === 'fi' ? 'pituus' : 'runtime'} 
            value={language === 'fi' ? movie.pituus : movie.runtime} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <label className="movie-input-label">
          {getText('Ohjaaja', 'Director')}
          <input 
            type="text" 
            name={language === 'fi' ? 'ohjaaja' : 'director'} 
            value={language === 'fi' ? movie.ohjaaja : movie.director} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <label className="movie-input-label">
          {getText('Käsikirjoittajat', 'Screenwriters')}
          <input 
            type="text" 
            name={language === 'fi' ? 'kasikirjoittajat' : 'writers'} 
            value={language === 'fi' ? movie.kasikirjoittajat : movie.writers} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <label className="movie-input-label">
          {getText('Päänäyttelijät', 'Main Actors')}
          <input 
            type="text" 
            name={language === 'fi' ? 'paanayttelijat' : 'main_actors'} 
            value={language === 'fi' ? movie.paanayttelijat : movie.main_actors} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <label className="movie-input-label">
          {getText('Kieli puhuttuna', 'Language spoken')}
          <input 
            type="text" 
            name={language === 'fi' ? 'kieli' : 'original_language'} 
            value={language === 'fi' ? movie.kieli : movie.original_language} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <label className="movie-input-label">
          {getText('Elokuvan kuvaus', `Movie's description`)}
          <textarea 
            type="text" 
            name={language === 'fi' ? 'kuvaus' : 'overview'} 
            value={language === 'fi' ? movie.kuvaus : movie.overview} 
            onChange={handleChange} 
            required 
            className="movie-input-area"
          />
        </label>

        <label className="movie-input-label">
          {getText('Elokuvan kuva linkkinä', `Movie's poster as link`)}
          <input 
            type="text" 
            name={language === 'fi' ? 'kuva' : 'poster_path'} 
            value={language === 'fi' ? movie.kuva : movie.poster_path} 
            onChange={handleChange} 
            required 
            className="movie-input"
          />
        </label>

        <div className="movie-button-container">
          <button type="submit" className="movie-button">
            {getText('Lisää Elokuva', 'Add Movie')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MovieForm