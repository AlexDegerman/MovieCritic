import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAlertMessages } from '../hooks/alert/useAlertMessages'
import '../styles/PasswordChange.css'
import useAuth from '../hooks/auth/useAuth'
import useLanguage from '../hooks/language/useLanguage'

// Displays a form for changing member's password
const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { showSuccess, showError } = useAlertMessages()
  const { getText } = useLanguage()
  const { changePassword } = useAuth()

const handleChangePassword = async (event) => {
  event.preventDefault()

  if (newPassword !== confirmPassword) {
    showError(getText(
      "Uudet salasanat eivät täsmää",
      "New passwords do not match"
    ))
    return
  }

  if (newPassword.length < 4) {
    showError(getText(
      "Salasanan pituuden tulee olla vähintään 4 merkkiä",
      "Password should be at least 4 characters long"
    ))
    return
  }

  await changePassword(
    currentPassword,
    newPassword,
    showSuccess,
    showError,
    getText,
    () => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  )
}

  return (
    <div className="password-change-container">
      <h2>
        <Lock/> {getText("Vaihda Salasana", "Change Password")}
      </h2>

      <form onSubmit={handleChangePassword}>
        <div className="password-change-inputs-container">
          {/* Current Password Input */}
          <label htmlFor="currentPassword">
            {getText("Nykyinen salasana", "Current Password")}
          </label>
          <div>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => {
                const val = e.target.value
                if (val.length <= 100) setCurrentPassword(val)
              }}
              className="password-change-input"
              required
              maxLength={100}
              title={getText("Nykyinen salasana, enintään 100 merkkiä", "Current password, maximum 100 characters")}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="toggle-visibility"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password Input */}
          <label htmlFor="newPassword">
            {getText("Uusi salasana", "New Password")}
          </label>
          <div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                const val = e.target.value
                if (val.length <= 100) setNewPassword(val)
              }}
              className="password-change-input"
              required
              maxLength={100}
              title={getText("Uusi salasana, enintään 100 merkkiä", "New password, maximum 100 characters")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="toggle-visibility"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm New Password Input */}
          <label htmlFor="confirmPassword">
            {getText("Vahvista uusi salasana", "Confirm New Password")}
          </label>
          <div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                const val = e.target.value
                if (val.length <= 100) setConfirmPassword(val)
              }}
              className="password-change-input"
              required
              maxLength={100}
              title={getText("Vahvista uusi salasana, enintään 100 merkkiä", "Confirm new password, maximum 100 characters")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-visibility"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Change Password Button */}
        <div className="password-change-button-container">
          <button type="submit" className="password-change-button">
            {getText("Vaihda salasana", "Change Password")}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PasswordChange