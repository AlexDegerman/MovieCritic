import { useState } from "react";
import MCService from "../services/MCService";
import { useNavigate } from 'react-router-dom';

const MovieForm = () => {
  const navigate = useNavigate()
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

  const addMovie = (event) => {
    event.preventDefault();
    
    const newMovie = new FormData()
    Object.keys(movie).forEach((key) => {
      newMovie.append(key, movie[key])
    })
    try {
      MCService.postMovie(newMovie)
      alert("Succesfully added the movie!")
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error("Error creating new movie: " + error)
    }
  }

  return (
    <div>
      <h1>Add Movie</h1>
      <form onSubmit={addMovie}>
        <label>
          Alkuperäinen nimi:
          <input type="text" name="alkuperainennimi" value={movie.alkuperainennimi} onChange={handleChange} required/>
        </label>
        <label>
          Suomalainen nimi:
          <input type="text" name="suomalainennimi" value={movie.suomalainennimi} onChange={handleChange} required/>
        </label>
        <label>
          Lajityypit:
          <input type="text" name="lajityyppi" value={movie.lajityyppi} onChange={handleChange} required/>
        </label>
        <label>
          Valmistumisvuosi:
          <input type="text" name="valmistumisvuosi" value={movie.valmistumisvuosi} onChange={handleChange} required/>
        </label>
        <label>
          Pituus minuutteina:
          <input type="text" name="pituus" value={movie.pituus} onChange={handleChange} required/>
        </label>
        <label>
          Ohjaaja:
          <input type="text" name="ohjaaja" value={movie.ohjaaja} onChange={handleChange} required/>
        </label>
        <label>
          Käsikirjoittajat:
          <input type="text" name="kasikirjoittajat" value={movie.kasikirjoittajat} onChange={handleChange} required/>
        </label>
        <label>
          Päänäyttelijät:
          <input type="text" name="paanayttelijat" value={movie.paanayttelijat} onChange={handleChange} required/>
        </label>
        <label>
          Kieli puhuttuna ja tekstitettynä:
          <input type="text" name="kieli" value={movie.kieli} onChange={handleChange} required/>
        </label>
        <label>
          Elokuvan kuvaus:
          <textarea type="text" name="kuvaus" value={movie.kuvaus} onChange={handleChange} required/>
        </label>
        <label>
          Elokuvan kuva JPEG:nä:
          <input type="file" name="kuva" onChange={handleChange} accept="image/jpeg" required/>
        </label>
        <button type="submit"> Submit </button>
      </form>
    </div>
  )
}

export default MovieForm