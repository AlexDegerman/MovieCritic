import { useCallback } from 'react'
import { useAlert } from '..//context/AlertContext'

// Custom hook providing pre-defined alert patterns
export const useAlertMessages = () => {
  const { showAlert } = useAlert()

  const showSuccess = useCallback((message, onClose) => {
    showAlert('Success', message, { type: 'success', onClose })
  }, [showAlert])

  const showError = useCallback((message, onClose) => {
    showAlert('Error', message, { type: 'error', onClose })
  }, [showAlert])

  const showInfo = useCallback((message, onClose) => {
    showAlert('Info', message, { type: 'info', onClose })
  }, [showAlert])

  const showWarning = useCallback((message, onClose) => {
    showAlert('Warning', message, { type: 'warning', onClose })
  }, [showAlert])

  return { showSuccess, showError, showInfo, showWarning }
}