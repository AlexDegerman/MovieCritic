import { useState } from 'react'
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
    onCancel: null,
    showCancelButton: false,
  })

  const showAlert = (title, message, options = {}) => {
    setAlertInfo({
      isOpen: true,
      type: options.type || 'info',
      title,
      message,
      onClose: options.onClose,
      onCancel: options.onCancel,
      showCancelButton: options.showCancelButton || false
    })
  }

  const hideAlert = (isCancel = false) => {
    if (isCancel) {
      alertInfo.onCancel?.()
    }
    else {
      alertInfo.onClose?.()
    }

    setAlertInfo({
      isOpen: false,
      type: 'info',
      title: "",
      message: "",
      onClose: null,
      onCancel: null,
      showCancelButton: false,
    })
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Alert
        {...alertInfo}
        onClose={() => hideAlert(false)}
        onCancel={() => hideAlert(true)}
      />
    </AlertContext.Provider>
  )
}
