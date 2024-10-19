import { useState } from "react"
import MCService from "../services/MCService"
import { useNavigate } from 'react-router-dom';

// This component displays a login page
const Login = ({ setUpdateMovieList, updateMovieList }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const Login = async (event) => {
    event.preventDefault()
    try {
      const res = await MCService.Login(email, password)
      localStorage.setItem('token', res.data.token)
      navigate('/')
      setUpdateMovieList(!updateMovieList)
    } catch (error) {
      console.error('Error logging in:', error)
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