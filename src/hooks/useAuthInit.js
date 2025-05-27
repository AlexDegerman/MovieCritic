/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from './useAlertMessages.js'
import { useLanguageUtils } from './useLanguageUtils.js'
import useAuthStore from '../stores/authStore.js'

export const useAuthInit = () => {
  const navigate = useNavigate()
  const { showInfo, showError } = useAlertMessages()
  const { getText } = useLanguageUtils()
  
  const {
    isInitialized,
    autoInitialize,
    startTokenChecker
  } = useAuthStore()

  // Initialize auth once on app start
  useEffect(() => {
    autoInitialize(showInfo, showError, getText)
  }, [])

  // Start token checker
  useEffect(() => {
    const cleanup = startTokenChecker(showInfo, getText, navigate)
    return cleanup
  }, [])

  return { isInitialized }
}