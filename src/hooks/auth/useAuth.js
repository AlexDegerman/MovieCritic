import useAuthStore from '../../stores/authStore'

// Hook for accessing auth state and actions
export const useAuth = () => {
  const isDemoUser = useAuthStore(s => s.isDemoUser)
  const currentMember = useAuthStore(s => s.currentMember)
  const logout = useAuthStore(s => s.logout)
  const loginWithCredentials = useAuthStore(s => s.loginWithCredentials)
  const addMember = useAuthStore(s => s.addMember)
  const changePassword = useAuthStore(s => s.changePassword)
  const isOwner = useAuthStore(s => s.isOwner)

  return {
    isDemoUser,
    currentMember,
    logout,
    loginWithCredentials,
    addMember,
    changePassword,
    isOwner
  }
}

export default useAuth
