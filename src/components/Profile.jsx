import { useEffect, useState } from "react"
import MCService from "../services/MCService"

// This component displays a profile page
const Profile = ({member}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [profileDetails, setProfileDetails] = useState({
    nimimerkki: "",
    sukupuoli: "",
    paikkakunta: "",
    harrastukset: "",
    suosikkilajityypit: "",
    suosikkifilmit: "",
    omakuvaus: "",
  })
  const [loading, setLoading] = useState(true)
  
  // Populate profile details for editing existing details
  useEffect(() => {
    if (member.nimimerkki) {
    setProfileDetails({
    nimimerkki: member.nimimerkki || "",
    sukupuoli: member.sukupuoli || "",
    paikkakunta: member.paikkakunta || "",
    harrastukset: member.harrastukset || "",
    suosikkilajityypit: member.suosikkilajityypit || "",
    suosikkifilmit: member.suosikkifilmit || "",
    omakuvaus: member.omakuvaus || "",
    })
    setLoading(false)
  }
  }, [member])

  // Handle all input field changes
  const handleChange = (event) => {
    const {name, value} = event.target
    setProfileDetails((prevDetails) => ({
    ...prevDetails,
    [name]: value}))
  }

  // Gets the edited profile details and updates them in the database
  const editProfile = async (event) => {  
    event.preventDefault()

    const newProfileDetails = {
    nimimerkki: profileDetails.nimimerkki,
    sukupuoli: profileDetails.sukupuoli,
    paikkakunta: profileDetails.paikkakunta,
    harrastukset: profileDetails.harrastukset,
    suosikkilajityypit: profileDetails.suosikkilajityypit,
    suosikkifilmit: profileDetails.suosikkifilmit,
    omakuvaus: profileDetails.omakuvaus
    }

    const token = localStorage.getItem('token')
    if (token) {
    try {
      await MCService.updateProfileDetails(member.id, newProfileDetails, token)
      alert('Profile details updated successfully!')
      window.location.reload()
    } catch (error) {
        console.error('Error updating profile details ' + error)
      }
    } else {
        console.error('No token found')
    }
  }

    // Temporary return while profile data loads
    if (loading) {
      return <div>Loading profile details...</div>
    }

  return (
    <div>
      <h1>Your Profile</h1>
      {/* The profile detail editing form is hidden until the 'Edit Details' button is pressed */}
      <button onClick={() => setShowEdit(!showEdit)}> Edit Details </button>
      {showEdit && (
        <form onSubmit={editProfile}>
          <label>
          Nimimerkki:
          <input type="text" name="nimimerkki" value={profileDetails.nimimerkki} onChange={handleChange}/>
        </label>
        <label>
          Sukupuoli:
          <input type="text" name="sukupuoli" value={profileDetails.sukupuoli} onChange={handleChange}/>
        </label>
        <label>
          Harrastukset:
          <input type="text" name="harrastukset" value={profileDetails.harrastukset} onChange={handleChange}/>
        </label>
        <label>
          Suosikki lajityypit:
          <input type="text" name="suosikkilajityypit" value={profileDetails.suosikkilajityypit} onChange={handleChange}/>
        </label>
        <label>
          Suosikki elokuvat:
          <input type="text" name="suosikkifilmit" value={profileDetails.suosikkifilmit} onChange={handleChange}/>
        </label>
        <label>
          Omakuvaus:
          <input type="text" name="omakuvaus" value={profileDetails.omakuvaus} onChange={handleChange}/>
        </label>
        <button type="submit"> Submit </button>
        </form>
      )}
      <p>Nickname: {member.nimimerkki}</p>
      <p>Join Date:{member.liittymispaiva}</p>
      <p>Gender: {member.sukupuoli}</p>
      <p>City: {member.paikkakunta}</p>
      <p>Hobbies: {member.harrastukset}</p>
      <p>Favorite Genres: {member.suosikkilajityypit}</p>
      <p>Favorite Movies: {member.suosikkifilmit}</p>
      <p>Self description: {member.omakuvaus}</p>
      <p>Member&apos;s reviews{member.omatarvostelut}</p>
    </div>
  )
}

export default Profile