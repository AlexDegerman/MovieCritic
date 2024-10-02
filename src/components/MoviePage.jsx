import { useParams } from "react-router-dom"
import { Buffer } from 'buffer'

const MoviePage = ({movies}) => {
  const {index} = useParams()
  const movie = movies[index]
  //Temporary return while movie list loads
  if (!movie) {
    return <div>Loading movie details...</div>
  }
  //Convert image's buffer to base64 to display the image on website
  const movieImage = `data:image/jpeg;base64,${Buffer.from(movie.kuva).toString('base64')}`

  return (
    <div>
      <h1>{movie.alkuperainennimi}</h1>
      <img src={movieImage} alt={`${movie.alkuperainennimi} image`} />
    </div>
  )
}

export default MoviePage