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

// This component displays a header with links to pages
const Header = ( {movies, image, currentMember, setCurrentMember, setUpdateMovieList, updateMovieList, setMovies} ) => {
  const navigate = useNavigate()
  const { showSuccess } = useAlertMessages()

  const Logout = () => {
    localStorage.removeItem('token')
    showSuccess("Succesfully logged out!", () => {
      setCurrentMember([])
      navigate('/')
    })
  }
  return (
    <div>
      <div className="header"> 
        <div className="header-content">
          <img src="/MovieCriticLogo.png" className="logo" alt=""/>
          <h1 className="header-title">Movie Critic</h1>
        </div>
          <Link to="/" className="link">Movies</Link>
            {!currentMember.id && (
          <Link to="/login" className="login">Login</Link>
          )}
          {currentMember.id && (
          <>
            <Link to="/addmovie" className="link">Add Movie</Link>
            <Link to="/addmember" className="link">Add Member</Link>
            <Link to={`/profile/${currentMember.id}`} className="link">Profile</Link>
            <button onClick={Logout} className="logout">Log Out</button>
          </>
          )}
        </div>
      <Routes>
        <Route path="/addmovie" element={<MovieForm updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList}/>}/>
        <Route path="/addmember" element={<MemberForm/>}/>
        <Route path="/profile/:id" element={<Profile currentMember={currentMember} setCurrentMember={setCurrentMember} movies={movies}/>}/>
        <Route path="/" element={<Movies movies={movies} image={image}/>}/>
        <Route path="/movie/:index" element={<MoviePage movies={movies} image={image} currentMember={currentMember} setMovies={setMovies}/>}/>
        <Route path="/login" element={<Login updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList}/>}/>
      </Routes>
    </div>
  )
}

export default Header