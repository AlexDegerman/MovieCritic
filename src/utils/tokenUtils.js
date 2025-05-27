import { jwtDecode } from 'jwt-decode'

export const getStoredToken = () => localStorage.getItem('token')

export const setStoredToken = (token) => localStorage.setItem('token', token)

export const removeStoredToken = () => localStorage.removeItem('token')

export const isTokenValid = (token) => {
  if (!token) return false
  
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch {
    return false
  }
}

export const getTokenData = (token) => {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export const checkAuth = () => {
  const token = getStoredToken()
  if (!token || !isTokenValid(token)) {
    return { success: false, error: "Please log in to continue" }
  }
  return { success: true, token }
}