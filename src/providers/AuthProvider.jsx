import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { AuthContext } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'


export const AuthProvider = ({ children }) => {
  const [isDemoUser, setIsDemoUser] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      setIsDemoUser(decodedToken.isDemoUser === true)
    }
  }, [location.pathname])

  return (
    <AuthContext.Provider value={{ isDemoUser, setIsDemoUser }}>
      {children}
    </AuthContext.Provider>
  )
}
