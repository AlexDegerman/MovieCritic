import { useParams } from "react-router-dom"

// This component displays a movie's page
const MoviePage = ({ movies, image }) => {
  const {index} = useParams()

  //Temporary return while movie list loads
  if (!movies[index]) {
    return <div>Loading movie details...</div>
  }

  const movie = movies[index]
  const movieImage = image[movie.id]

  return (
    <div>
      <h1>{movie.alkuperainennimi}</h1>
      <img src={movieImage} alt={`${movie.alkuperainennimi} image`} />
    </div>
  )
}

export default MoviePage