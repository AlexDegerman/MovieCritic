/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../alert/useAlertMessages.js'
import useAuthStore from '../../stores/authStore'
import useLanguage from '../language/useLanguage.js'
import useRecaptcha from '../useRecaptcha.js'

export const useAuthInit = () => {
  const navigate = useNavigate()
  const { showInfo, showError } = useAlertMessages()
  const { getText } = useLanguage()
  const { executeRecaptcha } = useRecaptcha()
  const {
    isInitialized,
    autoInitialize,
    startTokenChecker
  } = useAuthStore()

  // Initialize auth once on app start
  useEffect(() => {
    autoInitialize(showInfo, showError, getText, executeRecaptcha)
  }, [])

  // Start token checker
  useEffect(() => {
    const cleanup = startTokenChecker(showInfo, getText, navigate)
    return cleanup
  }, [])

  return { isInitialized }
}