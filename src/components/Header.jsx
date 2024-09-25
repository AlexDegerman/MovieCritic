import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom';
import MovieForm from './MovieForm';
import MemberForm from './MemberForm';
import Profile from './Profile';
import Movies from './Movies';

const Header = ( {movies, image} ) => {

  const padding = {
    padding: 5,
  }

  return (
    <div>
    <h1>Movie Critic</h1>
    <Router>
    <div>
    <Link style={padding} to="/">Movies</Link>
    <Link style={padding} to="/addmovie">Add Movie</Link>
    <Link style={padding} to="/addmember">Add Member</Link>
    <Link style={padding} to="/profile">Profile</Link>
    </div>
    
    <Routes>
    <Route path="/addmovie" element={<MovieForm/>}/>
    <Route path="/addmember" element={<MemberForm/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/" element={<Movies movies={movies} image={image}/>}/>
    </Routes>
    </Router>
    </div>
    
  )
    
  
}

export default Header