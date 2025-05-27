import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useLanguageUtils } from './hooks/useLanguageUtils.js'
import { useAuthInit } from './hooks/useAuthInit.js'
import MovieForm from './components/MovieForm.jsx'
import MemberForm from './components/MemberForm.jsx'
import Profile from './components/Profile.jsx'
import Movies from './components/Movies.jsx'
import MoviePage from './components/MoviePage.jsx'
import Login from './components/Login.jsx'
import About from './components/About.jsx'
import PasswordChange from './components/PasswordChange.jsx'
import useAuthStore from './stores/authStore.js'

const App = () => {
  const navigate = useNavigate()
  const { getText } = useLanguageUtils()
  
  const { isInitialized } = useAuthInit()
  
  const { isDemoUser } = useAuthStore()

  // Show loading screen while authentication state is being initialized
  if (!isInitialized) {
    return (
      <div className="container">
        <div className="loading">Initializing...</div>
      </div>
    )
  }

  return ( 
    <div className="container">
      <Header 
      />

      <main className="main-content">
        {isDemoUser && (
          <div className="demo-mode-banner" onClick={() => navigate('/login')}>
            {getText("DEMO TILA","DEMO MODE")}
          </div>
        )}
        
        <Routes>
          <Route path="/addmovie" element={<MovieForm/>} />
          <Route path="/addmember" element={<MemberForm/>} />
          <Route path="/profile/:id" element={
            <Profile 
            />
          } />
          <Route path="/" element={<Movies/>} />
          <Route path="/movie/:index" element={<MoviePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/about" element={<About/>}/>
          <Route path="/change-password" element={<PasswordChange/>}/>
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App