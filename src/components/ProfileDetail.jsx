import { useLanguageUtils } from "../hooks/useLanguageUtils"

//This component displays profile details in profile component
const ProfileDetail = ({ label, value, isOwner }) => {
  const {getText} = useLanguageUtils()

  // Hide detail if detail is unfilled and the user is not the owner of the profile
  if (!value && !isOwner) { 
    return null
  }

  // For owner, show unfilled details with a placeholder
  if (!value && isOwner) {
    return (
      <p>{label}: <span className="value">{getText('Ei määritelty', 'Not Specified')}</span></p>
    )
  }

  return (
    <p>{label}: <span className="value">{value}</span></p>
  )
}

export default ProfileDetail