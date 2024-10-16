import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom';
import MovieForm from './MovieForm';
import MemberForm from './MemberForm';
import Profile from './Profile';
import Movies from './Movies';
import MoviePage from './MoviePage';
import Login from './Login';

const Header = ( {movies, image, currentMember} ) => {
  
  const padding = {
    padding: 5,
  }
  const Logout = () => {
    localStorage.removeItem('token')
    alert('Succesfully logged out!')
  }
  return (
    <div>
    <h1>Movie Critic</h1>
    <Router>
    <div>
    <Link style={padding} to="/">Movies</Link>
    <Link style={padding} to="/login">Login</Link>
    <Link style={padding} to="/addmovie">Add Movie</Link>
    <Link style={padding} to="/addmember">Add Member</Link>
    <Link style={padding} to={`/profile/${currentMember.id}`}>Profile</Link>
    <button onClick={Logout}>Logout</button>
    </div>
    <Routes>
    <Route path="/addmovie" element={<MovieForm/>}/>
    <Route path="/addmember" element={<MemberForm/>}/>
    <Route path="/profile/:id" element={<Profile currentMember={currentMember}/>}/>
    <Route path="/" element={<Movies movies={movies} image={image}/>}/>
    <Route path="/movie/:index" element={<MoviePage movies={movies}/>}/>
    <Route path="/login" element={<Login/>}/>
    </Routes>
    </Router>
    </div>
    
  )
}

export default Header