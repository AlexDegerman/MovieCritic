import { Routes, Route, NavLink, Link } from 'react-router-dom'
import MovieForm from './MovieForm'
import MemberForm from './MemberForm'
import Profile from './Profile'
import Movies from './Movies'
import MoviePage from './MoviePage'
import Login from './Login'
import About from './About'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/Header.css'
import LanguageSelector from './LanguageSelector'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { useState } from 'react'
import { Menu } from 'lucide-react'

// This component displays a header with links to pages
const Header = ({ movies, currentMember, setCurrentMember, setUpdateMovieList, updateMovieList, setMovies, movieRatings, updateMovieRating, isLoading, search, setSearch, genre, setGenre, isLoadingMore, isInitialLoading }) => {
  const navigate = useNavigate()
  const { showSuccess } = useAlertMessages()
  const { getText } = useLanguageUtils()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const Logout = () => {
    localStorage.removeItem('token')
    showSuccess(getText("Uloskirjautuminen onnistui!", "Succesfully logged out!"), () => {
      setCurrentMember([])
      navigate('/')
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

          <div className="language-selector">
            <LanguageSelector />
          </div>

          <button className="burger-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu />
          </button>
        </div>

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
              <button onClick={() => { Logout(); setIsMenuOpen(false); }} className="mobile-logout">
                {getText('Kirjaudu ulos', 'Log Out')}
              </button>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/addmovie" element={<MovieForm updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList} />} />
        <Route path="/addmember" element={<MemberForm />} />
        <Route path="/profile/:id" element={<Profile currentMember={currentMember} setCurrentMember={setCurrentMember} movies={movies} />} />
        <Route path="/" element={<Movies movies={movies} movieRatings={movieRatings} isLoading={isLoading} search={search} setSearch={setSearch} genre={genre} setGenre={setGenre} isInitialLoading={isInitialLoading} isLoadingMore={isLoadingMore} />} />
        <Route path="/movie/:index" element={<MoviePage movies={movies} currentMember={currentMember} setMovies={setMovies} updateMovieRating={updateMovieRating} />} />
        <Route path="/login" element={<Login updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList} />} />
        <Route path="/about" element={<About/>}/>
      </Routes>
    </div>
  )
}

export default Header