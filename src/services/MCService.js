import axios from "axios"
const movieUrl = "http://localhost:3000/elokuva"
const memberUrl = "http://localhost:3000/jasen"

// Returns a list of movies
const getMovies = ()  => {
  return axios.get(movieUrl)
}
// Returns image of a specific movie
const getImage = (id) => {
  return axios.get(movieUrl + '/' + `${id}` + '/kuva',{responseType: 'arraybuffer'})
}

// Adds a new movie to the database
const postMovie = (movie) => {
  return axios.post(movieUrl,movie, {headers: {'Content-Type': 'multipart/form-data'}})
}

// Login to website
const Login = (email, password) => {
  return axios.post('http://localhost:3000/login', {sahkopostiosoite: email, salasana: password})
}

//Returns a specific member's profile's data
const getProfile = (id, token) => {
  return axios.get(memberUrl + '/' + `${id}`, {headers: {Authorization: `Bearer ${token}`}})
}

//Adds a new member to the database
const postMember = (member) => {
  return axios.post(memberUrl, member)
}

export default {getMovies, getImage, postMovie, Login, postMember, getProfile}