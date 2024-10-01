import axios from "axios"
const movieUrl = "http://localhost:3000/elokuva"

// returns a list of movies
const getMovies = ()  => {
  return axios.get(movieUrl)
}
//returns image of a specific movie
const getImage = (id) => {
  return axios.get(movieUrl + '/' + `${id}` + '/kuva',{responseType: 'arraybuffer'})
}

const postMovie = (movie) => {
  return axios.post(movieUrl,movie, {headers: {'Content-Type': 'multipart/form-data'}})
}

export default {getMovies, getImage, postMovie}