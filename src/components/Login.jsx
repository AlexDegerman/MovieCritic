import { useState } from 'react'
import MCService from '../services/MCService'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/Login.css'

// This component displays a login page
const Login = ({ setUpdateMovieList }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {showSuccess, showError } = useAlertMessages()

  const Login = async (event) => {
    event.preventDefault()
    try {
      const res = await MCService.Login(email, password)
      localStorage.setItem('token', res.data.token)
      showSuccess("Succesfully logged in!", () => {
        navigate('/')
        setUpdateMovieList(prev => !prev)
      })
    } catch {
      showError("Wrong email or password!")
      setEmail("")
      setPassword("")
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={Login} className="login-container">
        <h1 className="login-title">Login</h1>
        <input type="email" className="login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="login-button-container">
          <button type="submit"  className="login-button">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login