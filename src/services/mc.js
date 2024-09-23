import axios from "axios"
const movieUrl = "http://localhost:3000/elokuva"

// returns a list of movies
const getMovies = ()  => {
  return axios.get(movieUrl)
}

export default {getMovies}