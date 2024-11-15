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

  const showWarning = useCallback((message, { onConfirm, onCancel } = {}) => {
    showAlert('Warning', message,{
      type: 'warning',
      onClose: onConfirm,
      onCancel,
      showCancelButton: true
    })
  }, [showAlert])

  const showDoubleWarning = useCallback((firstMessage, secondMessage, { onFinalConfirm, onCancel } = {}) => {
    const handleFirstConfirm = () => {
      setTimeout(() => {
        showAlert('Final Warning', secondMessage, {
          type: 'warning',
          showCancelButton: true,
          onClose: () => {
            if (onFinalConfirm) {
              onFinalConfirm()
            }
          },
          onCancel: () => {
            if (onCancel) {
              onCancel()
            }
          }
        })
      }, 100)
    }

    const handleFirstCancel = () => {
      if (onCancel) {
        onCancel()
      }
    }

    showAlert('Warning', firstMessage, {
      type: 'warning',
      showCancelButton: true,
      onClose: handleFirstConfirm,
      onCancel: handleFirstCancel
    })
  }, [showAlert])

  return { showSuccess, showError, showInfo, showWarning, showDoubleWarning }
}