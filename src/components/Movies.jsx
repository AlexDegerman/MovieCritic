import { Link } from "react-router-dom"

// This component displays a list of movies
const Movies = ({ movies, image }) => {
  return (
    <ul>
      {movies.map((movie, index) => (
        <div key={index}>
          <li>
            <Link to={`/movie/${index}`}>{movie.alkuperainennimi}</Link>
            <img src={image[index]} alt={`${movie.alkuperainennimi} image`} />
          </li>
        </div>
      ))}
    </ul>
  )
}

export default Movies