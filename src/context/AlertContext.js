import { createContext, } from 'react'
import { useContext } from 'react'

// Creates alert context and hook for managing application-wide alerts
const AlertContext = createContext(undefined)

const useAlert = () => {
  const alert = useContext(AlertContext)

  return alert
}

export {AlertContext, useAlert}