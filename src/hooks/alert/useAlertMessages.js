/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'
import { useAlertStore } from '../../stores/alertStore'
import useLanguage from '../language/useLanguage'

export const useAlertMessages = () => {
  const showAlert = useAlertStore(state => state.showAlert)
  const { getText } = useLanguage()

  const showSuccess = useCallback((message, onClose) => {
    showAlert(getText('Onnistui', 'Success'), message, { type: 'success', onClose })
  }, [showAlert, getText])

  const showError = useCallback((message, onClose) => {
    showAlert(getText('Virhe', 'Error'), message, { type: 'error', onClose })
  }, [showAlert, getText])

  const showInfo = useCallback((message, onClose) => {
    showAlert('Info', message, { type: 'info', onClose })
  }, [showAlert, getText])

  const showWarning = useCallback((message, { onConfirm, onCancel } = {}) => {
    showAlert(getText('Varoitus', 'Warning'), message, {
      type: 'warning',
      onClose: onConfirm,
      onCancel,
      showCancelButton: true
    })
  }, [showAlert, getText])

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
  }, [showAlert, getText])

  return { showSuccess, showError, showInfo, showWarning, showDoubleWarning }
}