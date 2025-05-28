import { useState } from 'react'
import { useAlertMessages } from '../hooks/alert/useAlertMessages'
import '../styles/MemberForm.css'
import { Eye, EyeOff } from 'lucide-react'
import useAuth from '../hooks/auth/useAuth'
import useLanguage from '../hooks/language/useLanguage'

// This component displays a form to add members to the database
const MemberForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const {showSuccess, showError, showInfo } = useAlertMessages()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const {getText} = useLanguage()
  const { addMember, isDemoUser } = useAuth()

  // Validate email field
  const handleBlur = (event) => {
    const { name, value } = event.target
    if (name === "email" && value !== '') {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        showInfo(getText("Anna kelvollinen sähköpostiosoite (esimerkiksi: example@example.com).", "Provide a valid email address (for example: example@example.com)."))
        setEmail("")  
      }
    }
  }

  // Adds a new member to the database
  const handleAddMember = async (event) => {
    event.preventDefault()
    if (isDemoUser) {
      showInfo(getText("Jäsenien lisääminen on poissa käytöstä demotilassa.", "Adding members is disabled in demo mode."))
      return
    }
    if (password.length < 4) {
      showError('Password should be at least 4 characters long')
      return
    }

    const today = new Date()
    const joinDate = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`
    
    const member = {
      sahkopostiosoite: email,
      salasana: password,
      nimimerkki: nickname,
      liittymispaiva: joinDate
    }

    await addMember(member, showSuccess, showError, getText, () => {
      setNickname("")
      setPassword("")
    })
  }

  return (
    <div className="member-form">
      <form onSubmit={handleAddMember} className="member-form-container" autoComplete='off'>
        <h1 className="member-form-title">{getText('Lisää Jäsen', 'Add Member')}</h1>
        <label className="member-input-label">{getText('Sähköpostiosoite', 'Email')}</label>
        <input type="email" name="email" placeholder={getText('Sähköpostiosoite', 'Email')} value={email} onChange={(e => setEmail(e.target.value))} onBlur={handleBlur} required className="member-form-input"/>
        <label className="member-input-label">{getText('Salasana', 'Password')}</label>
        <div className="password-input-wrapper">
          <input 
            type={showCurrentPassword ? 'text' : 'password'} 
            placeholder={getText('Salasana', 'Password')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="member-form-input"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="password-toggle-visibility"
          >
          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
        <label className="member-input-label">{getText('Nimimerkki', 'Nickname')}</label>
        <input type="nickname" placeholder={getText('Nimimerkki', 'Nickname')} value={nickname} onChange={(e => setNickname(e.target.value))} required className="member-form-input"/>
        <div className="member-form-button-container">
          <button type="submit" className="member-form-button">{getText('Lisää Jäsen', 'Add Member')}</button>
        </div>
      </form>
    </div>
  )
}
export default MemberForm