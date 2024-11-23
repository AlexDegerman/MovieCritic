import { Routes, Route, Link } from 'react-router-dom'
import MovieForm from './MovieForm'
import MemberForm from './MemberForm'
import Profile from './Profile'
import Movies from './Movies'
import MoviePage from './MoviePage'
import Login from './Login'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/Header.css'
import LanguageSelector from './LanguageSelector'
import { useLanguageUtils } from '../hooks/useLanguageUtils'

// This component displays a header with links to pages
const Header = ( {movies, currentMember, setCurrentMember, setUpdateMovieList, updateMovieList, setMovies, movieRatings, updateMovieRating, isLoading, search, setSearch, genre, setGenre, isLoadingMore, isInitialLoading} ) => {
  const navigate = useNavigate()
  const { showSuccess } = useAlertMessages()
  const {getText} = useLanguageUtils()

  const Logout = () => {
    localStorage.removeItem('token')
    showSuccess(getText("Uloskirjautuminen onnistui!","Succesfully logged out!"), () => {
      setCurrentMember([])
      navigate('/')
    })
  }

  return (
    <div>
      <header className="header"> 
        <div className="header-content">
          <img src="/MovieCriticLogo.png" className="logo" alt=""/>
          <Link  to="/" className="header-title"> Movie Critic </Link>
        </div>
          <Link to="/" className="link">{getText('Elokuvat', 'Movies')}</Link>
            {!currentMember.id && (
          <Link to="/login" className="login">{getText('Kirjaudu sisään', 'Login')}</Link>
          )}
          {currentMember.id && (
          <>
            <Link to="/addmovie" className="link">{getText('Lisää Elokuva', 'Add Movie')}</Link>
            <Link to="/addmember" className="link">{getText('Lisää Jäsen', 'Add Member')}</Link>
            <Link to={`/profile/${currentMember.id}`} className="link">{getText('Profiili', 'Profile')}</Link>
            <button onClick={Logout} className="logout">{getText('Kirjaudu ulos', 'Log Out')}</button>
          </>
          )}
          <div>
            <LanguageSelector/>
          </div>
        </header>
      <Routes>
        <Route path="/addmovie" element={<MovieForm updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList}/>}/>
        <Route path="/addmember" element={<MemberForm/>}/>
        <Route path="/profile/:id" element={<Profile currentMember={currentMember} setCurrentMember={setCurrentMember} movies={movies}/>}/>
        <Route path="/" element={<Movies movies={movies} movieRatings={movieRatings} isLoading={isLoading} search={search} setSearch={setSearch }genre={genre} setGenre={setGenre} isInitialLoading={isInitialLoading} isLoadingMore={isLoadingMore}/>}/>
        <Route path="/movie/:index" element={<MoviePage movies={movies} currentMember={currentMember} setMovies={setMovies} updateMovieRating={updateMovieRating}/>}/>
        <Route path="/login" element={<Login updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList}/>}/>
      </Routes>
    </div>
  )
}

export default Header