const Profile = ({member}) => {
  //Temporary return while profile data loads
  if (!member[0]) {
    return <div>Loading profile details...</div>
  }
  
  return (
    <div>
      <h1>Your Profile</h1>
      <p>Name: {member[0].nimimerkki}</p>
      <p>Join Date:{member[0].littymispaiva}</p>
      <p>Gender: {member[0].sukupuoli}</p>
      <p>City: {member[0].paikkakunta}</p>
      <p>Hobbies: {member[0].harrastukset}</p>
      <p>Favorite Genres: {member[0].suosikkilajityypit}</p>
      <p>Favorite Movies: {member[0].suosikkifilmit}</p>
      <p>Self description: {member[0].omakuvaus}</p>
      <p>Member&apos;s reviews{member[0].omatarvostelut}</p>
    </div>
  )
}

export default Profile