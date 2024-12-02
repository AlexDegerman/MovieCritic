import { useEffect, useState } from 'react'
import MCService from '../services/MCService'
import { Link, useParams } from 'react-router-dom'
import ProfileDetail from './ProfileDetail'
import { useAlertMessages } from '../hooks/useAlertMessages'
import { handleApiError } from '../utils/apiErrorHandler'
import '../styles/Profile.css'
import { useNavigate } from 'react-router-dom'
import { Calendar, Film, Info, Lock, MapPin, Palette, Tag, ThumbsUp, Trash2, User, UserCircle } from 'lucide-react'
import { useLanguageUtils } from '../hooks/useLanguageUtils'
import { useAuth } from '../context/AuthContext'

// This component displays a profile page
const Profile = ({currentMember, setCurrentMember}) => {
  const navigate = useNavigate()
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
  const {showSuccess, showError, showDoubleWarning, showInfo} = useAlertMessages()
  const [profileUpdated, setProfileUpdated] = useState(false)
  const {getText} = useLanguageUtils()
  const { isDemoUser } = useAuth() 

  // Get specific member's details
  useEffect(() => {
    if (id) {
    MCService
      .getProfile(id)
      .then(response => {setMember(response.data)}, setProfileUpdated(false))
      .catch((error) => {
        const is404 = error.response && error.response.status === 404
        showError(handleApiError(error, getText("Profiilitietojen hakeminen epäonnistui. Yritä uudelleen.", "Failed to get profile details. Please try again.") ),
        is404 ? () => navigate('/') : undefined)
      })
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profileUpdated])

  // Get specific member's reviews
  useEffect(() => {
    if (id) {
      MCService
        .getReviewsfromMember(id)
        .then(response => {
          const sortedReviews = response.data.sort((a,b) =>
            new Date(b.luotuaika) - new Date(a.luotuaika)
          )
          setReviews(sortedReviews)})
        .catch((error) => {
          showError(handleApiError(error, getText("Jäsenen arvostelujen lataaminen epäonnistui. Yritä uudelleen.", "Failed to load member's reviews. Please try again.") ))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id])

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

    if (isDemoUser) {
      showInfo(getText("Tietoja muokkaavat toiminnot ovat poissa käytöstä demotilassa", "Features that modify data are disabled in demo mode."))
      return
    }

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
      showSuccess(getText("Profiilitiedot päivitettiin onnistuneesti!", "Profile details updated successfully!"), () => {
        setCurrentMember({
          ...currentMember,
          ...update
        })
        setShowEdit(false)
        setProfileUpdated(true)
      })
    } catch {
        showError(getText("Virhe profiilitietojen päivittämisessä. Yritä uudelleen.", "Error updating profile details. Please try again."))
      }
    } else {
        showError(getText("Puuttuva kirjautuminen, yritä kirjautua uudelleen.", "Missing login, try logging in again."))
    }
  }

  const deleteProfile = () => {
    if (isDemoUser) {
      showInfo(getText("Herkkätoiminnot ovat poissa käytöstä demotilassa.", "Sensitive features are disabled in demo mode"))
      return
    }
    const token = localStorage.getItem('token')
    if (token) {
      showDoubleWarning(getText(
        "Oletko varma, että haluat poistaa tilisi? Et voi kirjautua uudelleen, eikä tätä voi peruuttaa.",
        "Are you sure you want to delete your account? You will not be able to login again and this cannot be undone."), 
        getText(
        "Tämä on viimeinen mahdollisuutesi peruuttaa. Tilin poistaminen on pysyvää. Menetät pääsyn tiliisi etkä voi palauttaa sitä myöhemmin.", 
        "This is your last chance to cancel. Deleting your account is permanent. You will lose access to this account and will not be able to recover it later."),
        {
          onFinalConfirm: async () => {
            try {
              await MCService.deleteMember(member.id, token)
              setMember([])
              setCurrentMember([])
              localStorage.removeItem('token')
              showSuccess(getText("Tilisi on poistettu onnistuneesti.", "Successfully deleted your account."))
              navigate('/')
            } catch {
              showError(getText("Virhe jäsenen poistamisessa.", "Error deleting member."))
            }
          },
          onCancel: () => {
            setTimeout(() => {
              showInfo(getText("Poisto peruttu.", "Cancelled deletion."))
            }, 100)
          }
        }
      )
    } else {
      showError(getText("Puuttuva kirjautuminen, yritä kirjautua uudelleen.", "Missing login, try logging in again."))
    }
  }

    // Temporary return while profile data loads
    if (loading) {
      return <div>Loading profile details...</div>
    }

  return (
    <section className="profile-container">
      <h1 className="profile-title">{member.nimimerkki}{getText("in Profiili", `'s Profile`)}</h1>
      {/* The profile detail editing form is hidden until the 'Edit Details' button is pressed and the button is only shown if the current user is the profile owner */}
      {isOwner && (
        <button onClick={() => setShowEdit(!showEdit)} className="profile-button">{getText(showEdit ? 'Piilota lisätiedot' : 'Muokkaa tietoja', showEdit ? 'Hide Details' : 'Edit Details')}</button>)}
      {showEdit && (
        <form onSubmit={editProfile} className="member-details-form">
          {/* Proile Detail Form */}
          <label>
          {getText('Nimimerkki', 'Nickname')}
          <input type="text" name="nimimerkki" value={profileDetails.nimimerkki} onChange={handleChange} className="member-details-form-input"/>
          </label>
          <label>
          {getText('Sukupuoli', 'Gender')}
            <input type="text" name="sukupuoli" value={profileDetails.sukupuoli} onChange={handleChange} className="member-details-form-input"/>
          </label>
          <label>
          {getText('Paikkakunta', 'Resident City')}
            <input type="text" name="paikkakunta" value={profileDetails.paikkakunta} onChange={handleChange} className="member-details-form-input"/>
          </label>
          <label>
          {getText('Harrastukset', 'Hobbies')}
            <input type="text" name="harrastukset" value={profileDetails.harrastukset} onChange={handleChange} className="member-details-form-input"/>
          </label>
          <label>
          {getText('Suosikki lajityypit', 'Favorite Genres')}
            <input type="text" name="suosikkilajityypit" value={profileDetails.suosikkilajityypit} onChange={handleChange} className="member-details-form-input"/>
          </label>
          <label>
          {getText('Suosikki elokuvat', 'Favorite Movies')}
            <input type="text" name="suosikkifilmit" value={profileDetails.suosikkifilmit} onChange={handleChange} className="member-details-form-input"/>
          </label>
          <label>
          {getText('Oma kuvaus', 'Self Description')}
            <textarea type="text" name="omakuvaus" value={profileDetails.omakuvaus} onChange={handleChange} className="member-details-form-input-description"/>
          </label>
          <button type="submit" className="profile-button"> {getText('Tallenna muutokset', 'Submit')} </button>
        </form>
      )}
      {/* Profile Details */}
      <div className="profile-detail">
        <UserCircle className='profile-detail-icon'/>
        <ProfileDetail label={getText('Nimimerkki', 'Nickname')} value={member.nimimerkki} isOwner={isOwner}/>
      </div>
      <div className="profile-detail">
        <Calendar className='profile-detail-icon'/>
        <ProfileDetail label={getText('Liittymispäivä', 'Join Date')} value={member.liittymispaiva} isOwner={isOwner}/>
      </div>
      <div className="profile-detail">
        <User className='profile-detail-icon'/>
        <ProfileDetail label={getText('Sukupuoli', 'Gender')} value={member.sukupuoli} isOwner={isOwner}/>
      </div>
      <div className="profile-detail">
        <MapPin className='profile-detail-icon'/> 
        <ProfileDetail label={getText('Paikkakunta', 'Resident City')}value={member.paikkakunta} isOwner={isOwner}/>
      </div>
      <div className="profile-detail">
        <Palette className='profile-detail-icon'/>
        <ProfileDetail label={getText('Harrastukset', 'Hobbies')} value={member.harrastukset} isOwner={isOwner}/>
      </div>
      <div className="profile-detail">
        <Tag className='profile-detail-icon'/>
        <ProfileDetail label={getText('Suosikki lajityypit', 'Favorite Genres')} value={member.suosikkilajityypit} isOwner={isOwner}/>
      </div>
      <div className="profile-detail">
        <Film className='profile-detail-icon'/>
        <ProfileDetail label={getText('Suosikki elokuvat', 'Favorite Movies')}value={member.suosikkifilmit} isOwner={isOwner}/>
      </div>
      <div className="profile-detail">
        <Info className='profile-detail-icon'/>
        <ProfileDetail label={getText('Oma kuvaus', 'Self Description')} value={member.omakuvaus} isOwner={isOwner}/>
      </div>

      <button onClick={() => setDropdown(!dropdown)} className="profile-button">{getText( dropdown ? 'Piilota jäsenen arvostelut' : 'Näytä jäsenen arvostelut', dropdown ? "Hide Member's Reviews" : "Show Member's Reviews")}</button>
      {/* Dropdown Button for member's reviews */}
      {dropdown && (
        <div>
          {reviews.length > 0 ? (
            <ul className="profile-review-container">
              {reviews.map((review) => (
                <li key={review.id} className="profile-review">
                  <Link to={`/movie/${review.elokuvaid}`} className="profile-review-link">{getText(`${review.elokuvanOtsikko}`,`${review.elokuvanTitle}`)}</Link>
                  <p className={`review-rating ${review.tahdet === 5 && 'perfect-rating'}`}>
                    {'★'.repeat(Number(review.tahdet))}
                    {'☆'.repeat(5 - Number(review.tahdet))}
                  </p>
                  <p className="profile-review-title">{review.otsikko}</p>
                  <p className="profile-review-content">{review.sisalto}</p>
                  <ThumbsUp size={20} /> {review.tykkaykset}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-reviews">No reviews found.</p>
          )}
        </div>
      )}
      {/* Buttons for Profile Owner */}
      {isOwner && (
        <div className="profile-owner-buttons">
          <div className="owner-actions">
            <Link to={"/change-password"} className="password-change-link">
            <Lock size={20} color="#7e7c7c"/>
              {getText("Vaihda salasana", "Change Password")}
            </Link>
            <button onClick={deleteProfile} className="account-delete-btn">
            <Trash2 size={20} color="#7e7c7c"/>
              {getText('Poista tili', 'Delete Account')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Profile