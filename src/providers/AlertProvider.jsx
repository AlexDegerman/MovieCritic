import { useCallback, useState } from 'react'
import {AlertContext} from '../context/AlertContext'
import {Alert} from '../components/Alert'

// This provides global alert state management and renders the alert dialog
export const AlertProvider = ({ children }) => {
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    type: 'info',
    title: "",
    message: "",
    onClose: null,
  })

  const showAlert = useCallback((title, message, options = {}) => {
    setAlertInfo({
      isOpen: true,
      type: options.type || 'info',
      title,
      message,
      onClose: options.onClose
    })
  }, [])

  const hideAlert = useCallback(() => {
    if (alertInfo.onClose) {
      alertInfo.onClose()
    }
      setAlertInfo({
        isOpen: false,
        type: 'info',
        title: "",
        message: "",
        onClose: null
      })
    
  }, [alertInfo])

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Alert
        {...alertInfo}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  )
}
