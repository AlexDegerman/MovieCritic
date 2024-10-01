const Movies = ({ movies, image }) => {
  return (
    <ul>
      {movies.map((movie, index) => (
        <div key={index}>
          <li>
            {movie.alkuperainennimi}
            <img src={image[index]} alt={`${movie.alkuperainennimi} image`} />
          </li>
        </div>
      ))}
    </ul>
  )
}

export default Movies