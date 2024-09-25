import axios from "axios"
const movieUrl = "http://localhost:3000/elokuva"

// returns a list of movies
const getMovies = ()  => {
  return axios.get(movieUrl)
}
const getImage = (id) => {

  return axios.get(movieUrl + '/' + `${id}` + '/kuva',{responseType: 'arraybuffer'})
}

export default {getMovies, getImage}