/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ProfileDetail from './ProfileDetail'
import { useAlertMessages } from '../hooks/alert/useAlertMessages'
import '../styles/Profile.css'
import { Calendar, Film, Info, Lock, MapPin, Palette, Tag, ThumbsUp, Trash2, User, UserCircle } from 'lucide-react'
import useAuth from '../hooks/auth/useAuth'
import useProfile from '../hooks/profile/useProfile'
import useLanguage from '../hooks/language/useLanguage'

const Profile = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showSuccess, showError, showDoubleWarning, showInfo } = useAlertMessages()
  const { getText } = useLanguage()
  const {
    isDemoUser,
    isOwner,
    logout
  } = useAuth()
  const {
    currentProfile,
    profileReviews,
    profileLoading,
    reviewsLoading,
    isEditing,
    editFormData,
    loadProfile,
    loadMemberReviews,
    startEditing,
    cancelEditing,
    updateFormData,
    saveProfile,
    deleteProfile,
    clearProfile,
    hasProfileField,
    getProfileField
  } = useProfile()

  const isProfileOwner = isOwner(currentProfile.id)

  // Load profile when component mounts or ID changes
  useEffect(() => {
    if (id) {
      loadProfile(id, showError, getText, navigate)
      loadMemberReviews(id, showError, getText)
    }
    
    return () => {
      clearProfile()
    }
  }, [id])

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target
    updateFormData(name, value)
  }

  const handleSaveProfile = async (event) => {
  event.preventDefault()
  if (isDemoUser) {
    showInfo(getText("Tietojen muokkaus on poissa käytöstä demotilassa.", "Editing profile is disabled in demo mode."))
    return
  }
  await saveProfile(showSuccess, showError, getText)
}

const handleDeleteProfile = () => {
  if (isDemoUser) {
    showInfo(getText("Tilin poistaminen on poissa käytöstä demotilassa.", "Account deletion is disabled in demo mode."))
    return
  }

    showDoubleWarning(
      getText(
        "Oletko varma, että haluat poistaa tilisi? Et voi kirjautua uudelleen, eikä tätä voi peruuttaa.",
        "Are you sure you want to delete your account? You will not be able to login again and this cannot be undone."
      ), 
      getText(
        "Tämä on viimeinen mahdollisuutesi peruuttaa. Tilin poistaminen on pysyvää. Menetät pääsyn tiliisi etkä voi palauttaa sitä myöhemmin.", 
        "This is your last chance to cancel. Deleting your account is permanent. You will lose access to this account and will not be able to recover it later."
      ),
      {
        onFinalConfirm: async () => {
          const success = await deleteProfile(showSuccess, showError, getText, navigate)
          if (success) {
            // Also logout from auth store
            await logout(showSuccess, showInfo, getText, navigate)
          }
        },
        onCancel: () => {
          setTimeout(() => {
            showInfo(getText("Poisto peruttu.", "Cancelled deletion."))
          }, 100)
        }
      }
    )
  }

  // Show loading state
  if (profileLoading) {
    return <div>Loading profile details...</div>
  }

  // Show message if no profile data
  if (!currentProfile.nimimerkki && !profileLoading) {
    return <div>{getText("Profiilia ei löytynyt.", "Profile not found.")}</div>
  }

  return (
    <section className="profile-container">
      <h1 className="profile-title">
        {currentProfile.nimimerkki}{getText("in Profiili", `'s Profile`)}
      </h1>
      
      {/* Edit button - only show for profile owner */}
      {isProfileOwner && (
        <button 
          onClick={() => isEditing ? cancelEditing() : startEditing()} 
          className="profile-button"
        >
          {getText(
            isEditing ? 'Peruuta muokkaus' : 'Muokkaa tietoja', 
            isEditing ? 'Cancel Edit' : 'Edit Details'
          )}
        </button>
      )}

      {/* Edit form - only show when editing */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="member-details-form">
          <label>
            {getText('Nimimerkki', 'Nickname')}
            <input 
              type="text" 
              name="nimimerkki" 
              value={editFormData.nimimerkki || ''} 
              onChange={handleChange} 
              className="member-details-form-input"
            />
          </label>
          <label>
            {getText('Sukupuoli', 'Gender')}
            <input 
              type="text" 
              name="sukupuoli" 
              value={editFormData.sukupuoli || ''} 
              onChange={handleChange} 
              className="member-details-form-input"
            />
          </label>
          <label>
            {getText('Paikkakunta', 'Resident City')}
            <input 
              type="text" 
              name="paikkakunta" 
              value={editFormData.paikkakunta || ''} 
              onChange={handleChange} 
              className="member-details-form-input"
            />
          </label>
          <label>
            {getText('Harrastukset', 'Hobbies')}
            <input 
              type="text" 
              name="harrastukset" 
              value={editFormData.harrastukset || ''} 
              onChange={handleChange} 
              className="member-details-form-input"
            />
          </label>
          <label>
            {getText('Suosikki lajityypit', 'Favorite Genres')}
            <input 
              type="text" 
              name="suosikkilajityypit" 
              value={editFormData.suosikkilajityypit || ''} 
              onChange={handleChange} 
              className="member-details-form-input"
            />
          </label>
          <label>
            {getText('Suosikki elokuvat', 'Favorite Movies')}
            <input 
              type="text" 
              name="suosikkifilmit" 
              value={editFormData.suosikkifilmit || ''} 
              onChange={handleChange} 
              className="member-details-form-input"
            />
          </label>
          <label>
            {getText('Oma kuvaus', 'Self Description')}
            <textarea 
              name="omakuvaus" 
              value={editFormData.omakuvaus || ''} 
              onChange={handleChange} 
              className="member-details-form-input-description"
            />
          </label>
          <button type="submit" className="profile-button">
            {getText('Tallenna muutokset', 'Save Changes')}
          </button>
        </form>
      )}

      {/* Profile Details */}
      {(hasProfileField('nimimerkki') || isProfileOwner) && (
        <div className="profile-detail">
          <UserCircle className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Nimimerkki', 'Nickname')} 
            value={getProfileField('nimimerkki')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}
      
      {(hasProfileField('liittymispaiva') || isProfileOwner) && (
        <div className="profile-detail">
          <Calendar className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Liittymispäivä', 'Join Date')} 
            value={getProfileField('liittymispaiva')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}
      
      {(hasProfileField('sukupuoli') || isProfileOwner) && (
        <div className="profile-detail">
          <User className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Sukupuoli', 'Gender')} 
            value={getProfileField('sukupuoli')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}
      
      {(hasProfileField('paikkakunta') || isProfileOwner) && (
        <div className="profile-detail">
          <MapPin className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Paikkakunta', 'Resident City')} 
            value={getProfileField('paikkakunta')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}
      
      {(hasProfileField('harrastukset') || isProfileOwner) && (
        <div className="profile-detail">
          <Palette className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Harrastukset', 'Hobbies')} 
            value={getProfileField('harrastukset')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}
      
      {(hasProfileField('suosikkilajityypit') || isProfileOwner) && (
        <div className="profile-detail">
          <Tag className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Suosikki lajityypit', 'Favorite Genres')} 
            value={getProfileField('suosikkilajityypit')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}
      
      {(hasProfileField('suosikkifilmit') || isProfileOwner) && (
        <div className="profile-detail">
          <Film className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Suosikki elokuvat', 'Favorite Movies')} 
            value={getProfileField('suosikkifilmit')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}
      
      {(hasProfileField('omakuvaus') || isProfileOwner) && (
        <div className="profile-detail">
          <Info className="profile-detail-icon" />
          <ProfileDetail 
            label={getText('Oma kuvaus', 'Self Description')} 
            value={getProfileField('omakuvaus')} 
            isOwner={isProfileOwner} 
          />
        </div>
      )}

      {/* Reviews section */}
      <div>
        <h3>{getText('Jäsenen arvostelut', "Member's Reviews")}</h3>
        {reviewsLoading ? (
          <div>Loading reviews...</div>
        ) : profileReviews.length > 0 ? (
          <ul className="profile-review-container">
            {profileReviews.map((review) => (
              <li key={review.id} className="profile-review">
                <Link 
                  to={`/movie/${review.elokuvaid}`} 
                  className="profile-review-link"
                >
                  {getText(`${review.elokuvanOtsikko}`, `${review.elokuvanTitle}`)}
                </Link>
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
          <p className="no-reviews">
            {getText("Arvosteluita ei löytynyt", "No reviews found.")}
          </p>
        )}
      </div>

      {/* Owner-only actions */}
      {isProfileOwner && (
        <div className="profile-owner-buttons">
          <div className="owner-actions">
            <Link to={"/change-password"} className="password-change-link">
              <Lock size={20} color="#7e7c7c"/>
              {getText("Vaihda salasana", "Change Password")}
            </Link>
            <button onClick={handleDeleteProfile} className="account-delete-btn">
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