import { useState } from 'react'
import MCService from '../services/MCService'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/Login.css'
import { useLanguageUtils } from '../hooks/useLanguageUtils'

// This component displays a login page
const Login = ({ setUpdateMovieList }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {showSuccess, showError } = useAlertMessages()
  const {getText} = useLanguageUtils(false)

  const Login = async (event) => {
    event.preventDefault()
    try {
      const res = await MCService.Login(email, password)
      localStorage.setItem('token', res.data.token)
      showSuccess(getText("Kirjautuminen onnistui!","Succesfully logged in!"), () => {
        navigate('/')
        setUpdateMovieList(prev => !prev)
      })
    } catch {
      showError(getText("Väärä sähköpostiosoite tai salasana!","Wrong email or password!"))
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={Login} className="login-container">
        <h1 className="login-title">{(getText("Kirjaudu Sisään","Login"))}</h1>
        <input type="email" className="login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="login-button-container">
          <button type="submit"  className="login-button">{(getText("Kirjaudu Sisään","Login"))}</button>
        </div>
      </form>
    </div>
  )
}

export default Login