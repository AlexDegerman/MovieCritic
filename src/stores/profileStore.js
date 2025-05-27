import { create } from 'zustand'
import MCService from '../services/MCService.js'
import { getStoredToken } from '../utils/tokenUtils.js'
import { safeApiCall } from '../utils/safeApiCall.js'

const useProfileStore = create((set, get) => ({
  currentProfile: {},
  profileReviews: [],
  profileLoading: false,
  reviewsLoading: false,
  isEditing: false,
  editFormData: {},

  clearProfile: () => {
    set({
      currentProfile: {},
      profileReviews: [],
      profileLoading: false,
      reviewsLoading: false,
      isEditing: false,
      editFormData: {}
    })
  },

  // Loads profile data by ID
  loadProfile: async (id, showError, getText, navigate) => {
    set({ profileLoading: true })
    
    const result = await safeApiCall(
      () => MCService.getProfile(id),
      getText(
        "Profiilitietojen hakeminen epäonnistui. Yritä uudelleen.", 
        "Failed to get profile details. Please try again."
      )
    )
    
    if (result.success) {
      set({ 
        currentProfile: result.data,
        profileLoading: false
      })
      return result.data
    } else {
      // Check if it's a 404 error for navigation
      const is404 = result.error?.response?.status === 404
      showError(result.error, is404 ? () => navigate('/') : undefined)
      
      set({ 
        currentProfile: {},
        profileLoading: false
      })
      return null
    }
  },

  // Loads and sorts reviews for a member by ID
  loadMemberReviews: async (id, showError, getText) => {
    set({ reviewsLoading: true })
    
    const result = await safeApiCall(
      () => MCService.getReviewsfromMember(id),
      getText(
        "Jäsenen arvostelujen lataaminen epäonnistui. Yritä uudelleen.", 
        "Failed to load member's reviews. Please try again."
      )
    )
    
    if (result.success) {
      const sortedReviews = result.data.sort((a, b) =>
        new Date(b.luotuaika) - new Date(a.luotuaika)
      )
      set({ 
        profileReviews: sortedReviews,
        reviewsLoading: false
      })
      return sortedReviews
    } else {
      showError(result.error)
      set({ 
        profileReviews: [],
        reviewsLoading: false
      })
      return []
    }
  },

  // Initializes editing mode and fills the form with current profile data
  startEditing: () => {
    const { currentProfile } = get()
    set({
      isEditing: true,
      editFormData: {
        nimimerkki: currentProfile.nimimerkki || "",
        sukupuoli: currentProfile.sukupuoli || "",
        paikkakunta: currentProfile.paikkakunta || "",
        harrastukset: currentProfile.harrastukset || "",
        suosikkilajityypit: currentProfile.suosikkilajityypit || "",
        suosikkifilmit: currentProfile.suosikkifilmit || "",
        omakuvaus: currentProfile.omakuvaus || "",
      }
    })
  },

  // Cancels editing mode and clears the form
  cancelEditing: () => {
    set({ isEditing: false, editFormData: {} })
  },

  // Updates a single field in the edit form
  updateFormData: (field, value) => {
    set(state => ({
      editFormData: { ...state.editFormData, [field]: value }
    }))
  },

  // Updates multiple fields in the edit form at once
  updateMultipleFormFields: (updates) => {
    set(state => ({
      editFormData: { ...state.editFormData, ...updates }
    }))
  },

  // Saves the edited profile data to the backend
  saveProfile: async (showSuccess, showError, getText) => {
    const { editFormData, currentProfile } = get()
    const token = getStoredToken()

    if (!token) {
      showError(getText(
        "Kirjautumistietoja ei löydy.", 
        "Authentication details not found."
      ))
      return false
    }

    const result = await safeApiCall(
      () => MCService.updateProfileDetails(currentProfile.id, editFormData, token),
      getText(
        "Virhe profiilitietojen päivittämisessä.", 
        "Error updating profile details."
      )
    )

    if (result.success) {
      set(state => ({
        currentProfile: { ...state.currentProfile, ...editFormData },
        isEditing: false,
        editFormData: {}
      }))
      
      showSuccess(getText(
        "Profiilitiedot päivitetty onnistuneesti!", 
        "Profile updated successfully!"
      ))
      
      return true
    } else {
      showError(result.error)
      return false
    }
  },

  // Deletes the current user's profile
  deleteProfile: async (showError, getText, navigate) => {
    const { currentProfile } = get()
    const token = getStoredToken()

    if (!token) {
      showError(getText(
        "Kirjautumistietoja ei löydy.", 
        "Authentication details not found."
      ))
      return false
    }

    const result = await safeApiCall(
      () => MCService.deleteMember(currentProfile.id, token),
      getText(
        "Virhe tilin poistamisessa.", 
        "Error deleting account."
      )
    )

    if (result.success) {
      get().clearProfile()
      navigate('/')
      return true
    } else {
      showError(result.error)
      return false
    }
  },

  // Checks if a specific field exists in the profile
  hasProfileField: (fieldName) => {
    const { currentProfile } = get()
    return Boolean(currentProfile[fieldName])
  },

  // Retrieves the value of a specific profile field
  getProfileField: (fieldName) => {
    const { currentProfile } = get()
    return currentProfile[fieldName] || ""
  },
}))

export default useProfileStore
