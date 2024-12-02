import axios from 'axios'
const movieUrl = "http://localhost:5173/api/elokuva"
const memberUrl = "http://localhost:5173/api/jasen"
const reviewUrl = "http://localhost:5173/api/arvostelut"
const authUrl = "http://localhost:5173/api/auth"

// This service handles backend requests
// Get a list of movies with pagination, search, and genre
// Get a list of movies with pagination, search, and genre
const getMovies = (page, search = '', genre = '', seed) => {
  return axios.get('/api/elokuva', {
    params: {
      page,
      limit: 51,
      search,
      genre,
      seed
    }
  })
}

// Get a specific movie by ID
const getMovie = (id) => {
  return axios.get(`${movieUrl}/${id}`)
}

// Add a new movie to the database
const postMovie = (movie, token) => {
  return axios.post(movieUrl, movie, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Delete a specific movie
const deleteMovie = (id, token) => {
  return axios.delete(`${movieUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Login to the website
const Login = (email, password) => {
  return axios.post(authUrl + '/login', {
    sahkopostiosoite: email,
    salasana: password
  })
}

// Get a specific member's profile data
const getProfile = (id, token) => {
  return axios.get(`${memberUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Update a specific member's profile details
const updateProfileDetails = (id, details, token) => {
  return axios.put(`${memberUrl}/${id}`, details, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}

// Add a new member to the database
const postMember = (member, token) => {
  return axios.post(memberUrl, member, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Delete a member
const deleteMember = (id, token) => {
  return axios.delete(`${memberUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Change password for a specific member
const changePassword = (id, passwordData, token) => {
  return axios.put(`${memberUrl}/${id}/change-password`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

// Get all reviews for a specific movie
const getReviews = (id) => {
  return axios.get(`${reviewUrl}/${id}`)
}

// Add a new review to the database
const postReview = (review, token) => {
  return axios.post(reviewUrl, review, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Delete own review
const deleteReview = (id, token) => {
  return axios.delete(`${reviewUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// Get all reviews made by a specific member
const getReviewsfromMember = (id) => {
  return axios.get(`${reviewUrl}/jasen/${id}`)
}

// Increment like count on a review
const incrementLikeOnReview = (id) => {
  return axios.post(`${reviewUrl}/${id}/like`)
}

// Get a demo token used for logging in as a demo user
const getDemoToken = (demoSecret) => {
  return axios.post(authUrl + "/demo-token", { secret: demoSecret })
}

// Logs in as a demo user
const demoLogin = (demoSecret) => {
  return axios.post(authUrl + "/demo-login", { demoToken: demoSecret })
}



export default {getMovies, getMovie, postMovie, Login, postMember, getProfile, updateProfileDetails, postReview, getReviews, getReviewsfromMember, deleteMember, deleteReview, deleteMovie, changePassword, incrementLikeOnReview, demoLogin, getDemoToken}