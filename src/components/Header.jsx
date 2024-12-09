import { NavLink, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/Header.css'
import LanguageSelector from './LanguageSelector'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { useState } from 'react'
import { Menu } from 'lucide-react'

// This component displays a header with links to pages
const Header = ({ currentMember, setCurrentMember, setTriggerDemoLogin }) => {
  const navigate = useNavigate()
  const { showSuccess } = useAlertMessages()
  const { getText } = useLanguageUtils()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Logs out user when clicking logout button
  const Logout = () => {
    localStorage.removeItem('token')
    showSuccess(getText("Uloskirjautuminen onnistui!", "Succesfully logged out!"), () => {
      setCurrentMember([])
      navigate('/')
      setTriggerDemoLogin(prev => !prev)
    })
  }

  return (
    <div>
      <header className="header">
        <div className="header-main">
          <div className="header-content">
            <img src="/MovieCriticLogo.png" className="logo" alt="Movie Critic Logo" />
            <Link to="/" className="header-title">Movie Critic</Link>
          </div>
          {/* Navigation */}
          <nav className="desktop-nav">
            <NavLink to="/" className="link">{getText('Elokuvat', 'Movies')}</NavLink>
            {!currentMember.id ? (
              <NavLink to="/login" className="link">{getText('Kirjaudu sisään', 'Login')}</NavLink>
            ) : (
              <>
                <NavLink to="/addmovie" className="link">{getText('Lisää Elokuva', 'Add Movie')}</NavLink>
                <NavLink to="/addmember" className="link">{getText('Lisää Jäsen', 'Add Member')}</NavLink>
                <NavLink to={`/profile/${currentMember.id}`} className="link">{getText('Profiili', 'Profile')}</NavLink>
                <button onClick={Logout} className="logout">{getText('Kirjaudu ulos', 'Log Out')}</button>
              </>
            )}
          </nav>
            {/* Language Selector */}
          <div className="language-selector">
            <LanguageSelector />
          </div>
            {/*Mobile Burger Button*/}
          <button className="burger-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu />
          </button>
        </div>
            {/* Mobile Menu's Navigation */}
        <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            {getText('Elokuvat', 'Movies')}
          </NavLink>
          {!currentMember.id ? (
            <NavLink to="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
              {getText('Kirjaudu sisään', 'Login')}
            </NavLink>
          ) : (
            <>
              <NavLink to="/addmovie" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                {getText('Lisää Elokuva', 'Add Movie')}
              </NavLink>
              <NavLink to="/addmember" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                {getText('Lisää Jäsen', 'Add Member')}
              </NavLink>
              <NavLink to={`/profile/${currentMember.id}`} className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                {getText('Profiili', 'Profile')}
              </NavLink>
              <button onClick={() => { Logout(); setIsMenuOpen(false)}} className="mobile-logout">
                {getText('Kirjaudu ulos', 'Log Out')}
              </button>
            </>
          )}
        </nav>
      </header>
    </div>
  )
}

export default Header