//This component displays profile details in profile component
const ProfileDetail = ({ label, value, isOwner }) => {
  // Hide detail if detail is unfilled and the user is not the owner of the profile
  if (!value && !isOwner) { 
    return null
  }

  // For owner, show unfilled details with a placeholder
  if (!value && isOwner) {
    return (
      <p>{label}: Not specified</p>
    )
  }

  return (
    <p>{label}: {value}</p>
  )
}

export default ProfileDetail