import axios from 'axios'
const movieUrl = "http://localhost:5173/api/elokuva"
const memberUrl = "http://localhost:5173/api/jasen"
const reviewUrl = "http://localhost:5173/api/arvostelut"
const loginUrl = "http://localhost:5173/api/login"

// This service handles backend requests
// Returns a list of movies
const getMovies = (page) => {
  return axios.get(movieUrl, { params: { page, limit: 50 } })
}

// Returns image of a specific movie / unused, reuse for profile pic maybe
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

//Delete specific movie
const deleteMovie = (id, token) => {
  return axios.delete(movieUrl + '/' + `${id}`, {
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}

// Login to website
const Login = (email, password) => {
  return axios.post(loginUrl,
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

const deleteMember = (id, token) => {
  return axios.delete(memberUrl + '/' + `${id}`, {
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

// Delete own review
const deleteReview = (id, token) => {
  return axios.delete(reviewUrl + '/'+ `${id}`, {
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}

// Returns all reviews made by a specific memebr
const getReviewsfromMember = (id) => {
  return axios.get(memberUrl + '/'+ `${id}` + '/arvostelut' )
}

export default {getMovies, getImage, postMovie, Login, postMember, getProfile, updateProfileDetails, postReview, getReviews, getReviewsfromMember, deleteMember, deleteReview, deleteMovie}