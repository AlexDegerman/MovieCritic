import { useCallback } from 'react'

const useRecaptcha = () => {
  const executeRecaptcha = useCallback(async (action) => {
    if (!window.grecaptcha) {
      throw new Error('reCAPTCHA not loaded')
    }

    try {
      const token = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action }
      )
      return token
    } catch (error) {
      console.error('reCAPTCHA execution error:', error)
      throw error
    }
  }, [])

  return { executeRecaptcha }
}

export default useRecaptcha