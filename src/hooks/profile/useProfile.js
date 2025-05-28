import useProfileStore from '../../stores/profileStore'

// Hook to access profile state and actions
export const useProfile = () => {
  const currentProfile = useProfileStore(s => s.currentProfile)
  const profileReviews = useProfileStore(s => s.profileReviews)
  const profileLoading = useProfileStore(s => s.profileLoading)
  const reviewsLoading = useProfileStore(s => s.reviewsLoading)
  const isEditing = useProfileStore(s => s.isEditing)
  const editFormData = useProfileStore(s => s.editFormData)

  const loadProfile = useProfileStore(s => s.loadProfile)
  const loadMemberReviews = useProfileStore(s => s.loadMemberReviews)
  const startEditing = useProfileStore(s => s.startEditing)
  const cancelEditing = useProfileStore(s => s.cancelEditing)
  const updateFormData = useProfileStore(s => s.updateFormData)
  const saveProfile = useProfileStore(s => s.saveProfile)
  const deleteProfile = useProfileStore(s => s.deleteProfile)
  const clearProfile = useProfileStore(s => s.clearProfile)
  const hasProfileField = useProfileStore(s => s.hasProfileField)
  const getProfileField = useProfileStore(s => s.getProfileField)

  return {
    currentProfile,
    profileReviews,
    profileLoading,
    reviewsLoading,
    isEditing,
    editFormData,
    loadProfile,
    loadMemberReviews,
    startEditing,
    cancelEditing,
    updateFormData,
    saveProfile,
    deleteProfile,
    clearProfile,
    hasProfileField,
    getProfileField
  }
}

export default useProfile
