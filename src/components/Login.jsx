import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/Login.css'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../stores/authStore'

// This component displays a login page
const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showSuccess, showError } = useAlertMessages()
  const { getText } = useLanguageUtils(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const { loginWithCredentials } = useAuthStore()
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await loginWithCredentials(email, password)
      showSuccess(getText("Kirjautuminen onnistui!", "Successfully logged in!"), () => {
        navigate('/')
      })
    } catch (error) {
      if (error.response && error.response.status === 429) {
        showError(getText("Liian monta kirjautumisyritystä. Yritä uudelleen myöhemmin.", "Too many login attempts. Please try again later."))
      } else {
        showError(getText("Väärä sähköpostiosoite tai salasana!", "Wrong email or password!"))
      }
    }
  }
  

  return (
    <div className="login-form">
      <form onSubmit={handleLogin} className="login-container">
        <h1 className="login-title">{(getText("Kirjaudu Sisään","Login"))}</h1>
        <input type="email" className="login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="password-input-wrapper">
        <input type={showCurrentPassword ? 'text' : 'password'}  className="login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="password-toggle-visibility"
          >
          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        </div>
        <div className="login-button-container">
          <button type="submit"  className="login-button">{(getText("Kirjaudu Sisään","Login"))}</button>
        </div>
      </form>
    </div>
  )
}

export default Login