import { useParams } from "react-router-dom"
import { Buffer } from 'buffer'

// This component displays a movie's page
const MoviePage = ({movies}) => {
  const {index} = useParams()
  //Temporary return while movie list loads
  if (!movies[index]) {
    return <div>Loading movie details...</div>
  }
  //Convert image's buffer to base64 to display the image on website
  const movieImage = `data:image/jpeg;base64,${Buffer.from(movies[index].kuva).toString('base64')}`

  return (
    <div>
      <h1>{movies[index].alkuperainennimi}</h1>
      <img src={movieImage} alt={`${movies[index].alkuperainennimi} image`} />
    </div>
  )
}

export default MoviePage