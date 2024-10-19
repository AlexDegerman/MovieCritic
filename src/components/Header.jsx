import { Routes, Route, Link } from 'react-router-dom';
import MovieForm from './MovieForm';
import MemberForm from './MemberForm';
import Profile from './Profile';
import Movies from './Movies';
import MoviePage from './MoviePage';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

const Header = ( {movies, image, currentMember, setCurrentMember, setUpdateMovieList, updateMovieList} ) => {
  const navigate = useNavigate()
  const padding = {
    padding: 5,
  }
  const Logout = () => {
    localStorage.removeItem('token')
    alert('Succesfully logged out!')
    setCurrentMember([])
    navigate('/')
  }
  return (
    <div>
    <h1>Movie Critic</h1>
    <div>
    <Link style={padding} to="/">Movies</Link>
    <Link style={padding} to="/login">Login</Link>
    {currentMember.id && (
    <>
    <Link style={padding} to="/addmovie">Add Movie</Link>
    <Link style={padding} to="/addmember">Add Member</Link>
    <Link style={padding} to={`/profile/${currentMember.id}`}>Profile</Link>
    <button onClick={Logout}>Logout</button>
    </>
    )}
    </div>
    <Routes>
    <Route path="/addmovie" element={<MovieForm updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList}/>}/>
    <Route path="/addmember" element={<MemberForm/>}/>
    <Route path="/profile/:id" element={<Profile currentMember={currentMember} setCurrentMember={setCurrentMember}/>}/>
    <Route path="/" element={<Movies movies={movies} image={image}/>}/>
    <Route path="/movie/:index" element={<MoviePage movies={movies} image={image}/>}/>
    <Route path="/login" element={<Login updateMovieList={updateMovieList} setUpdateMovieList={setUpdateMovieList}/>}/>
    </Routes>
    </div>
    
  )
}

export default Header