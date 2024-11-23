/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'
import { useAlert } from '..//context/AlertContext'
import { useLanguageUtils } from './useLanguageUtils'

// Custom hook providing pre-defined alert patterns
export const useAlertMessages = () => {
  const { showAlert } = useAlert()
  const {getText} = useLanguageUtils()

  const showSuccess = useCallback((message, onClose) => {
    showAlert(getText('Onnistui', 'Success'), message, { type: 'success', onClose })
  }, [showAlert])

  const showError = useCallback((message, onClose) => {
    showAlert(getText('Virhe', 'Error'), message, { type: 'error', onClose })
  }, [showAlert])

  const showInfo = useCallback((message, onClose) => {
    showAlert('Info', message, { type: 'info', onClose })
  }, [showAlert])

  const showWarning = useCallback((message, { onConfirm, onCancel } = {}) => {
    showAlert(getText('Varoitus', 'Warning'), message,{
      type: 'warning',
      onClose: onConfirm,
      onCancel,
      showCancelButton: true
    })
  }, [showAlert])

  const showDoubleWarning = useCallback((firstMessage, secondMessage, { onFinalConfirm, onCancel } = {}) => {
    const handleFirstConfirm = () => {
      setTimeout(() => {
        showAlert(getText('Viimeinen Varoitus', 'Final Warning'), secondMessage, {
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

    showAlert(getText('Varoitus', 'Warning'), firstMessage, {
      type: 'warning',
      showCancelButton: true,
      onClose: handleFirstConfirm,
      onCancel: handleFirstCancel
    })
  }, [showAlert])

  return { showSuccess, showError, showInfo, showWarning, showDoubleWarning }
}