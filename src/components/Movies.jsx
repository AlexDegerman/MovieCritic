import { Link } from "react-router-dom"
import Filter from "./Filter"
import { useEffect, useState } from "react"

// This component displays a list of movies
const Movies = ({ movies, image }) => {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [filtered, setFilter] = useState(movies)

  useEffect(() => {
    const filteredMovies = movies.filter(movie => {
      const matchesSearch = movie.alkuperainennimi.toLowerCase().includes(search.toLowerCase())
      const matchesGenre = genre === "" || movie.lajityyppi.toLowerCase() === genre.toLowerCase()
      return matchesSearch && matchesGenre
    })

    setFilter(filteredMovies)
  }, [search, genre, movies])

  return (
    <>
      <Filter search={search} setSearch={setSearch} genre={genre} setGenre={setGenre}/>
      <ul>
        {filtered.map((movie, index) => (
          <div key={movie.id}>
            <li>
              <Link to={`/movie/${index}`}>{movie.alkuperainennimi}</Link>
              <img src={image[movie.id]} alt={`${movie.alkuperainennimi} image`} />
            </li>
          </div>
        ))}
      </ul>
    </>
  )
}

export default Movies