import { create } from 'zustand'
import MCService from '../services/MCService.js'
import { 
  getStoredToken, 
  setStoredToken, 
  removeStoredToken, 
  isTokenValid, 
  getTokenData 
} from '../utils/tokenUtils.js'

const useAuthStore = create((set, get) => ({
  currentMember: {},
  isDemoUser: false,
  isAuthenticated: false,
  isInitialized: false,

  setCurrentMember: (member) => set({ currentMember: member }),
  setIsDemoUser: (isDemo) => set({ isDemoUser: isDemo }),

  clearAuth: () => {
    removeStoredToken()
    set({
      currentMember: {},
      isDemoUser: false,
      isAuthenticated: false
    })
  },

  // Initializes authentication state using stored token
  initializeAuth: async () => {
    const token = getStoredToken()
    
    if (!token || !isTokenValid(token)) {
      get().clearAuth()
      set({ isInitialized: true })
      return false
    }

    try {
      const tokenData = getTokenData(token)
      const profile = await MCService.getProfile(tokenData.id, token)
      
      set({ 
        currentMember: profile.data,
        isDemoUser: tokenData.isDemoUser === true,
        isAuthenticated: true,
        isInitialized: true
      })
      return true
    } catch {
      get().clearAuth()
      set({ isInitialized: true })
      return false
    }
  },

  // Tries to initialize auth, falls back to demo login if needed
  autoInitialize: async (showInfo, showError, getText, executeRecaptcha) => {
    const isValid = await get().initializeAuth()
    
    if (!isValid) {
      try {
        await get().demoLogin(showInfo, getText, executeRecaptcha)
        return true
      } catch (error) {
        const { handleApiError } = await import('../utils/apiErrorHandler.js')
        showError(handleApiError(error, getText(
          "Automaattinen kirjautuminen epäonnistui.", 
          "Automatic login failed."
        )))
        return false
      }
    }
    return true
  },

  // Starts interval to check for token expiration and logout if expired
  startTokenChecker: (showInfo, getText, navigate) => {
    const checkExpiration = () => {
      const token = getStoredToken()
      if (token && !isTokenValid(token)) {
        get().logout()
        showInfo(getText(
          "Istunto on päättynyt, kirjaudutaan ulos...", 
          "Session expired, logging out..."
        ), () => navigate('/'))
      }
    }
    
    checkExpiration()
    const interval = setInterval(checkExpiration, 60 * 1000)
    return () => clearInterval(interval)
  },

  // Logs in a user using a token
  login: async (token) => {
    try {
      setStoredToken(token)
      const tokenData = getTokenData(token)
      const profile = await MCService.getProfile(tokenData.id, token)
      
      set({
        currentMember: profile.data,
        isDemoUser: tokenData.isDemoUser === true,
        isAuthenticated: true
      })
      return true
    } catch (error) {
      get().clearAuth()
      throw error
    }
  },

  // Logs in a user with email and password
  loginWithCredentials: async (email, password, executeRecaptcha) => {
    const recaptchaToken = await executeRecaptcha('login')
    const response = await MCService.Login(email, password, recaptchaToken)
    await get().login(response.data.token)
    return response
  },

  // Logs in as a demo user
  demoLogin: async (showInfo, getText, executeRecaptcha) => {
    showInfo(getText("Kirjaudutaan sisään demo-käyttäjänä", "Logging in as Demo User"))
    const demoToken = await MCService.getDemoToken()
    const recaptchaToken = await executeRecaptcha('demo_login')
    const response = await MCService.demoLogin(demoToken, recaptchaToken)
    
    if (response.data.token) {
      await get().login(response.data.token)
      return true
    }
    return false
  },

  // Logs out the user and attempts automatic demo login
  logout: async (showSuccess, showInfo, getText, navigate, executeRecaptcha) => {
    get().clearAuth()
    
    showSuccess(getText("Uloskirjautuminen onnistui!", "Successfully logged out!"))
    
    setTimeout(async () => {
      try {
        await get().demoLogin(showInfo, getText, executeRecaptcha)
        navigate?.('/')
      } catch (error) {
        console.error('Auto demo login failed:', error)
      }
    }, 1500)
  },

  // Updates the current member's data in the state
  updateCurrentMember: (updates) => {
    set(state => ({
      currentMember: {
        ...state.currentMember,
        ...updates
      }
    }))
  },

  // Checks whether the user is authenticated
  requireAuth: (showError, getText) => {
    const token = getStoredToken()
    const { currentMember } = get()
    
    if (!token || !currentMember) {
      showError(getText(
        "Kirjautumistietoja ei löydy.", 
        "Authentication details not found."
      ))
      return false
    }
    return true
  },

  // Checks if the logged-in user owns the specified resource
  isOwner: (resourceOwnerId) => {
    const { currentMember } = get()
    return currentMember.id === resourceOwnerId
  },

  // Adds a new member if authenticated
  addMember: async (memberData, showSuccess, showError, getText, onSuccess) => {
    if (!get().requireAuth(showError, getText)) return false

    try {
      await MCService.postMember(memberData, getStoredToken())
      showSuccess(getText(
        `Jäsen ${memberData.nimimerkki} lisättiin onnistuneesti!`,
        `Member ${memberData.nimimerkki} was successfully added!`
      ), onSuccess)
      return true
    } catch (error) {
      const message = error.response?.status === 409 
        ? getText("Nimimerkki tai sähköpostiosoite on jo käytössä.", "Nickname or email already exists.")
        : getText("Jäsenen lisääminen epäonnistui.", "Failed to add member.")
      showError(message)
      return false
    }
  },

  // Changes the user's password
  changePassword: async (currentPassword, newPassword, showSuccess, showError, getText, onSuccess) => {
    if (!get().requireAuth(showError, getText)) return false

    try {
      const { currentMember } = get()
      await MCService.changePassword(currentMember.id, { currentPassword, newPassword }, getStoredToken())
      showSuccess(getText("Salasana vaihdettu onnistuneesti.", "Password changed successfully."), onSuccess)
      return true
    } catch (error) {
      const { handleApiError } = await import('../utils/apiErrorHandler.js')
      showError(handleApiError(error, getText(
        "Salasanan vaihtaminen epäonnistui.", 
        "Failed to change the password."
      )))
      return false
    }
  }
}))

export default useAuthStore