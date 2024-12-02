import { createContext, useContext } from 'react'

// Creates auth context and hook for managing authentication state
const AuthContext = createContext(null)

const useAuth = () => {
  const auth = useContext(AuthContext)
  return auth
}

export { AuthContext, useAuth }