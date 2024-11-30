import { useState } from 'react'
import MCService from '../services/MCService'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/MemberForm.css'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { Eye, EyeOff } from 'lucide-react'

// This component displays a form to add members to the database
const MemberForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const {showSuccess, showError } = useAlertMessages()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const {getText} = useLanguageUtils()

  // Adds a new member to the database
  const addMember = async (event) => {
    event.preventDefault()
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
    const token = localStorage.getItem('token')
    if (token) {
    try {
      await MCService.postMember(member, token)
      showSuccess(getText(`Jäsen ${member.nimimerkki} lisättiin onnistuneesti!`, `Member ${member.nimimerkki} was successfully added!`), () => {
      setNickname("")
      setPassword("")
      })
    } catch(error) {
      if (error.response && error.response.status === 409) {
        showError(getText("Nimimerkki tai sähköpostiosoite on jo käytössä. Valitse toinen.", "Nickname or email already exists. Please choose a different one."))
      } else {
      showError(getText("Jäsenen lisääminen epäonnistui. Yritä uudelleen.", "Failed to add member. Please try again."))
    }
    }
  } else {
    showError(getText("Puuttuva kirjautuminen. Kirjaudu sisään.", "Missing login. Please login."))
    }
  }
  return (
    <div className="member-form">
      <form onSubmit={addMember} className="member-form-container" autoComplete='off'>
        <h1 className="member-form-title">{getText('Lisää Jäsen', 'Add Member')}</h1>
        <label className="member-input-label">{getText('Sähköpostiosoite', 'Email')}</label>
        <input type="email" placeholder={getText('Sähköpostiosoite', 'Email')} value={email} onChange={(e => setEmail(e.target.value))} required className="member-form-input"/>
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