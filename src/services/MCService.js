import axios from "axios"
const movieUrl = "http://localhost:3000/elokuva"
const memberUrl = "http://localhost:3000/jasen"
const reviewUrl = "http://localhost:3000/arvostelut"

// Returns a list of movies
const getMovies = ()  => {
  return axios.get(movieUrl)
}
// Returns image of a specific movie
const getImage = (id) => {
  return axios.get(movieUrl + '/' + `${id}` + '/kuva', {
    responseType: 'arraybuffer'})
}

// Adds a new movie to the database
const postMovie = (movie, token) => {
  return axios.post(movieUrl,movie, {
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}

// Login to website
const Login = (email, password) => {
  return axios.post('http://localhost:3000/login',
    {sahkopostiosoite: email, salasana: password}
  )
}

// Returns a specific member's profile's data
const getProfile = (id, token) => {
  return axios.get(memberUrl + '/' + `${id}`, {
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}

// Update a specific profile's details
const updateProfileDetails = (id, details, token) => {
  return axios.put(memberUrl + '/' + `${id}`, details, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}

// Adds a new member to the database
const postMember = (member, token) => {
  return axios.post(memberUrl, member, {
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}

// Returns all Reviews from a specific movie
const getReviews = (id) => {
  return axios.get(reviewUrl + '/'+ `${id}` )
}

// Adds a new review to the database
const postReview = (review, token) => {
  return axios.post(reviewUrl, review, {
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}

// Returns all reviews made by a specific memebr
const getReviewsfromMember = (id) => {
  return axios.get(memberUrl + '/'+ `${id}` + '/arvostelut' )
}

export default {getMovies, getImage, postMovie, Login, postMember, getProfile, updateProfileDetails, postReview, getReviews, getReviewsfromMember}