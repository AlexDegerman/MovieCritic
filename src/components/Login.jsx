import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/alert/useAlertMessages'
import '../styles/Login.css'
import { Eye, EyeOff } from 'lucide-react'
import useAuth from '../hooks/auth/useAuth'
import useLanguage from '../hooks/language/useLanguage'
import useRecaptcha from '../hooks/useRecaptcha'

// This component displays a login page
const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showSuccess, showError } = useAlertMessages()
  const { getText } = useLanguage()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const { loginWithCredentials } = useAuth()
  const { executeRecaptcha } = useRecaptcha()
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await loginWithCredentials(email, password, executeRecaptcha)
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
        <h1 className="login-title">{getText("Kirjaudu Sisään", "Login")}</h1>

        <input
          type="email"
          className="login-input"
          placeholder={getText("Sähköpostiosoite", "Email")}
          value={email}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length <= 100) setEmail(val);
          }}
          required
          maxLength={100}
          title={getText("Sähköpostiosoite, enintään 100 merkkiä", "Email, maximum 100 characters")}
        />

        <div className="password-input-wrapper">
          <input
            type={showCurrentPassword ? "text" : "password"}
            className="login-input"
            placeholder={getText("Salasana", "Password")}
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 100) setPassword(val);
            }}
            required
            maxLength={100}
            title={getText("Salasana, enintään 100 merkkiä", "Password, maximum 100 characters")}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="password-toggle-visibility"
          >
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="login-button-container">
          <button type="submit" className="login-button">
            {getText("Kirjaudu Sisään", "Login")}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login