import { useEffect, useState } from 'react'
import MCService from '../services/MCService'
import { Link, useParams } from 'react-router-dom'
import ProfileDetail from './ProfileDetail'
import { useAlertMessages } from '../hooks/useAlertMessages'
import { handleApiError } from '../utils/apiErrorHandler'
import '../styles/Profile.css'

// This component displays a profile page
const Profile = ({currentMember, setCurrentMember, movies}) => {
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
  const [reviews, setReviews] = useState([])
  const [dropdown, setDropdown] = useState(false)
  const {showSuccess, showError } = useAlertMessages()

  // Get specific member's details
  useEffect(() => {
    MCService
      .getProfile(id)
      .then(response => {setMember(response.data)})
      .catch((error) => {
        showError(handleApiError(error, "Failed to get profile details. Please try again."))
      })
  }, [id, currentMember, showError])

  // Get specific member's reviews
  useEffect(() => {
    MCService
      .getReviewsfromMember(id)
      .then(response => {setReviews(response.data)})
      .catch((error) => {
        showError(handleApiError(error, "Failed to load member's reviews. Please try again."))
      })
  },[id, currentMember, showError])

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
      showSuccess("Profile details updated successfully!", () => {
        setCurrentMember({
          ...currentMember,
          ...update
        })
        setShowEdit(false)
      })
    } catch {
        showError("Error updating profile details. Please try again.")
      }
    } else {
        showError("Missing login, try logging in again")
    }
  }

    // Temporary return while profile data loads
    if (loading) {
      return <div>Loading profile details...</div>
    }

  return (
    <div className="profile-container">
      <h1 className="profile-title">{member.nimimerkki}&apos;s Profile</h1>
      {/* The profile detail editing form is hidden until the 'Edit Details' button is pressed and the button is only shown if the current user is the profile owner */}
      {isOwner && (
        <button onClick={() => setShowEdit(!showEdit)} className="profile-button"> Edit Details </button>
      )}
      {showEdit && (
        <form onSubmit={editProfile} className="member-details-form">
          <label>
          Nimimerkki:
          <input type="text" name="nimimerkki" value={profileDetails.nimimerkki} onChange={handleChange} className="member-details-form-input"/>
        </label>
        <label>
          Sukupuoli:
          <input type="text" name="sukupuoli" value={profileDetails.sukupuoli} onChange={handleChange} className="member-details-form-input"/>
        </label>
        <label>
          Paikkakunta:
          <input type="text" name="paikkakunta" value={profileDetails.paikkakunta} onChange={handleChange} className="member-details-form-input"/>
        </label>
        <label>
          Harrastukset:
          <input type="text" name="harrastukset" value={profileDetails.harrastukset} onChange={handleChange} className="member-details-form-input"/>
        </label>
        <label>
          Suosikki lajityypit:
          <input type="text" name="suosikkilajityypit" value={profileDetails.suosikkilajityypit} onChange={handleChange} className="member-details-form-input"/>
        </label>
        <label>
          Suosikki elokuvat:
          <input type="text" name="suosikkifilmit" value={profileDetails.suosikkifilmit} onChange={handleChange} className="member-details-form-input"/>
        </label>
        <label>
          Omakuvaus:
          <textarea type="text" name="omakuvaus" value={profileDetails.omakuvaus} onChange={handleChange} className="member-details-form-input-description"/>
        </label>
        <button type="submit" className="profile-button"> Submit </button>
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
      <button onClick={() => setDropdown(!dropdown)} className="profile-button">
        {dropdown ? "Hide Member's Reviews" : "Show Member's Reviews"}
        </button>
      {dropdown && (
        <div>
          {reviews.length > 0 ? (
            <ul className="profile-review-container">
              {reviews.map((review) => (
                <li key={review.id} className="profile-review">
                  <Link to={`/movie/${movies.findIndex(movie => movie.id === review.elokuvaid)}`} className="profile-review-link"> {review.elokuvanalkuperainennimi} </Link>
                  <p className="profile-review-title">{review.otsikko}</p>
                  <span className={`review-rating ${review.tahdet === 5 && 'perfect-rating'}`}>
                    {'★'.repeat(Number(review.tahdet))}
                    {'☆'.repeat(5 - Number(review.tahdet))}
                  </span>
                  <p className="profile-review-content">{review.sisalto}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-reviews">No reviews found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile