import { useEffect, useState } from "react"
import MCService from "../services/MCService"
import { useParams } from "react-router-dom"
import ProfileDetail from "./ProfileDetail"

// This component displays a profile page
const Profile = ({currentMember, setCurrentMember}) => {
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
  const [member, setMember] = useState([])
  const {id} = useParams()
  const isOwner = currentMember.id === member.id

  // Get specific member's details
  useEffect(() => {
    MCService
        .getProfile(id)
        .then(response => {setMember(response.data)})
        .catch((error) => {
        console.error(error.message)
      })
  }, [id, currentMember])

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
      const update = await MCService.updateProfileDetails(member.id, newProfileDetails, token)
      alert('Profile details updated successfully!')
      setCurrentMember({
        ...currentMember,
        ...update
      })
      setShowEdit(false)
    } catch (error) {
        console.error('Error updating profile details ', error)
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
      <h1>{member.nimimerkki}&apos;s Profile</h1>
      {/* The profile detail editing form is hidden until the 'Edit Details' button is pressed and the button is only shown if the current user is the profile owner */}
      {isOwner && (
        <button onClick={() => setShowEdit(!showEdit)}> Edit Details </button>
      )}
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
          Paikkakunta:
          <input type="text" name="paikkakunta" value={profileDetails.paikkakunta} onChange={handleChange}/>
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
      
      <ProfileDetail label="Nickname" value={member.nimimerkki} isOwner={isOwner}/>
      <ProfileDetail label="Join Date" value={member.liittymispaiva} isOwner={isOwner}/>
      <ProfileDetail label="Gender" value={member.sukupuoli} isOwner={isOwner}/>
      <ProfileDetail label="City" value={member.paikkakunta} isOwner={isOwner}/>
      <ProfileDetail label="Hobbies" value={member.harrastukset} isOwner={isOwner}/>
      <ProfileDetail label="Favorite Genres" value={member.suosikkilajityypit} isOwner={isOwner}/>
      <ProfileDetail label="Favorite Movies" value={member.suosikkifilmit} isOwner={isOwner}/>
      <ProfileDetail label="Self Description" value={member.omakuvaus} isOwner={isOwner}/>
      <ProfileDetail label="Member&apos;s Reviews" value={member.omatarvostelut} isOwner={isOwner}/>
    </div>
  )
}

export default Profile