import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL

// Define endpoints dynamically based on the base URL
const movieUrl = `${baseUrl}/api/elokuva`
const memberUrl = `${baseUrl}/api/jasen`
const reviewUrl = `${baseUrl}/api/arvostelut`
const authUrl = `${baseUrl}/api/auth`

// This service handles backend requests

// Get a list of movies with pagination, search, and genre
const getMovies = (page, search = '', genre = '', seed) => {
  return axios.get(`${movieUrl}`, {
    params: {
      page,
      limit: 21,
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
const Login = (email, password, recaptchaToken) => {
  return axios.post(authUrl + '/login', {
    sahkopostiosoite: email,
    salasana: password,
    recaptchaToken
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
      Authorization: `Bearer ${token}`
    }
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
const getDemoToken = () => {
  return axios.post(authUrl + "/demo-token")
}

// Logs in as a demo user
const demoLogin = (demoToken, recaptchaToken) => {
  return axios.post(authUrl + "/demo-login", {
    data: {
      ...demoToken.data,
      recaptchaToken
    }
  })
}

export default {
  getMovies,
  getMovie,
  postMovie,
  Login,
  postMember,
  getProfile,
  updateProfileDetails,
  postReview,
  getReviews,
  getReviewsfromMember,
  deleteMember,
  deleteReview,
  deleteMovie,
  changePassword,
  incrementLikeOnReview,
  demoLogin,
  getDemoToken
}