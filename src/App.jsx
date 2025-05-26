/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MCService from './services/MCService.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useAlertMessages } from './hooks/useAlertMessages.js'
import { handleApiError } from './utils/apiErrorHandler.js'
import { useLocation } from 'react-router-dom'
import { useLanguageUtils } from './hooks/useLanguageUtils.js'
import MovieForm from './components/MovieForm.jsx'
import MemberForm from './components/MemberForm.jsx'
import Profile from './components/Profile.jsx'
import Movies from './components/Movies.jsx'
import MoviePage from './components/MoviePage.jsx'
import Login from './components/Login.jsx'
import About from './components/About.jsx'
import PasswordChange from './components/PasswordChange.jsx'
import { useAuth } from './context/AuthContext.js'

const App = () => {
  const [currentMember, setCurrentMember] = useState({})
  const [triggerDemoLogin, setTriggerDemoLogin] = useState(false)
  const location = useLocation()
  const { showInfo, showError } = useAlertMessages()
  const navigate = useNavigate()
  const {getText} = useLanguageUtils()
  const { isDemoUser, setIsDemoUser } = useAuth() 

  // Autologin as demo user to view full features of website without having to login
  useEffect(() => {
    const autoDemoLogin = async () => {
        showInfo(getText("Kirjaudutaan sisään demo-käyttäjänä", "Logging in as Demo User"))
        try {
          const demoToken = await MCService.getDemoToken()
          
          const response = await MCService.demoLogin(demoToken)

          if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            const decodedToken = jwtDecode(response.data.token)
            const memberId = decodedToken.id
            const profileResponse = await MCService.getProfile(memberId, response.token)
            setCurrentMember(profileResponse.data)
            setIsDemoUser(decodedToken.isDemoUser === true)

            if (location.pathname !== '/') {
              navigate('/')
            }
          }
        } catch (error) {
          showError(
            handleApiError(error, getText("Automaattinen kirjautuminen epäonnistui.", "Automatic login failed."))
          )
        }
      }
    const token = localStorage.getItem('token')
    if (!token && location.pathname !== '/login') {
      autoDemoLogin()
    }
  }, [location.pathname, triggerDemoLogin, setIsDemoUser])

  // Fetch logged in member's data
  useEffect(() => { 
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      const memberId = decodedToken.id
      
      MCService
        .getProfile(memberId, token)
        .then(response => {
          setCurrentMember(response.data)
        })
        .catch((error) => {
          showError(
            handleApiError(error, getText("Nykyisen jäsenen tietojen hakeminen epäonnistui. Yritä uudelleen.", "Failed to get current member's data. Please try again."))
          )
        })
    }
  }, [showError])
  

  // Logout user when token expires
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token')
      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000
      
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token')
          showInfo(getText("Istunto on päättynyt, kirjaudutaan ulos...", "Session expired, logging out..."), () => {
            setCurrentMember([])
            navigate('/')
          })
        }
      }
    }
    checkToken()

    const interval = setInterval(checkToken, 60 * 1000)
    return () => clearInterval(interval)
  },[navigate, showInfo])

  return ( 
    <div className="container">
      <Header currentMember={currentMember} setCurrentMember={setCurrentMember} setTriggerDemoLogin={setTriggerDemoLogin}/>

    <main className="main-content">
    {isDemoUser && (
        <div className="demo-mode-banner" onClick={() => navigate('/login')}>{getText("DEMO TILA","DEMO MODE")}</div>
      )}
    <Routes>
        <Route path="/addmovie" element={<MovieForm/>} />
        <Route path="/addmember" element={<MemberForm />} />
        <Route path="/profile/:id" element={<Profile currentMember={currentMember} setCurrentMember={setCurrentMember}/>} />
        <Route path="/" element={<Movies/>} />
        <Route path="/movie/:index" element={<MoviePage currentMember={currentMember} />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/about" element={<About/>}/>
        <Route path="/change-password" element={<PasswordChange currentMember={currentMember}/>}/>
      </Routes>
    </main>

    <Footer />
  </div>
  )
}

export default App