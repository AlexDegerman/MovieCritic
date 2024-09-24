const Movies = ({ movies }) => {
  return (
    <ul>
    {movies.map((movie, index) =>
    <div key={index}>
      <li>{movie.alkuperainennimi}</li>
      </div>
    )}
  </ul>
  )
}

export default Movies