import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/PasswordChange.css'
import MCService from '../services/MCService'
import { handleApiError } from '../utils/apiErrorHandler'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { useAuth } from '../context/AuthContext'

const PasswordChange = ({currentMember}) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { showSuccess, showError, showInfo } = useAlertMessages()
  const { getText } = useLanguageUtils()
  const { isDemoUser } = useAuth() 

  const changePassword = (event) => {
    event.preventDefault()
    if (isDemoUser) {
      showInfo(getText("Salasanan vaihtaminen on poissa käytöstä demotilassa.", "Changing password is disabled in demo mode."))
      return
    }
    if (newPassword !== confirmPassword) {
      showError(getText("Uudet salasanat eivät täsmää", "New passwords do not match"))
      return
    }
    if (newPassword.length < 4) {
      showError(getText("Salasanan pituuden tulee olla vähintään 4 merkkiä", "Password should be at least 4 characters long"))
      return
    }
    if (newPassword.length > 20) {
      showError(getText("Salasana ei saa olla yli 20 merkkiä pitkä", "Password should not exceed 20 characters"))
      return
    }
    const token = localStorage.getItem('token')
    if (token && currentMember) {
      const memberId = currentMember.id
      MCService
      .changePassword(memberId, { currentPassword, newPassword }, token)
      .then(() => {
        showSuccess(getText("Salasana vaihdettu onnistuneesti.", "Password changed successfully."))
      })
      .catch((error) => {
        showError(
          handleApiError(error, getText("Salasanan vaihtaminen epäonnistui. Yritä uudelleen.", "Failed to change the password. Please try again."))
        )
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
  } else {
    showError(getText("Kirjautumistietoja ei löydy.", "Authentication details not found."))
    }
  }

  return (
    <div className="password-change-container">
      <h2>
        <Lock/> {getText("Vaihda Salasana","Change Password")}
      </h2>
      
      <form onSubmit={changePassword}>

        <div className="password-change-inputs-container">
          <label>
          {getText("Nykyinen salasana","Current Password")}
          </label>
          <div>
            <input 
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="password-change-input"
              required
            />
            <button 
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="toggle-visibility"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <label htmlFor="newPassword">
          {getText("Uusi salasana","New Password")}
          </label>
          <div>
            <input 
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="password-change-input"
              required
            />
            <button 
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="toggle-visibility"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <label htmlFor="confirmPassword">
          {getText("Vahvista uusi salasana","Confirm New Password")}
          </label>
          <input 
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="password-change-input"
            required
          />
        </div>
        <div className="password-change-button-container">
        <button 
          type="submit" 
          className="password-change-button"
        >
          {getText("Vaihda salasana","Change Password")}
        </button>
        </div>
      </form>
    </div>
  )
}

export default PasswordChange