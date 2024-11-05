import { useState } from 'react'
import MCService from '../services/MCService'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'

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
    <div>
      <h1>Login</h1>
      <form onSubmit={Login}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login