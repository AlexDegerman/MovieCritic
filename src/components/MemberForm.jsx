import { useState } from 'react'
import MCService from '../services/MCService'
import { useNavigate } from 'react-router-dom'
import { useAlertMessages } from '../hooks/useAlertMessages'
import '../styles/MemberForm.css'

// This component displays a form to add members to the database
const MemberForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const {showSuccess, showError } = useAlertMessages()
  const navigate = useNavigate()

  // Adds a new member to the database
  const addMember = async (event) => {
    event.preventDefault()
    const today = new Date()
    const joinDate = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`
    const member = {
      sahkopostiosoite: email,
      salasana: password,
      nimimerkki: nickname,
      liittymispaiva: joinDate
    }
    const token = localStorage.getItem('token')
    if (token) {
    try {
      await MCService.postMember(member, token)
      showSuccess(`Member ${member.nimimerkki} was successfully added!`, () => {
        navigate('/')
      })
    } catch {
      showError("Failed to add member. Please try again.")
    }
  } else {
    showError("Missing login. Please login.")
    }
  }
  return (
    <div className="member-form">
      <form onSubmit={addMember} className="member-form-container">
        <h1 className="member-form-title">Add Member</h1>
        <label className="member-input-label">Email</label>
        <input type="email" placeholder="Email" value={email} onChange={(e => setEmail(e.target.value))} required className="member-form-input"/>
        <label className="member-input-label">Password</label>
        <input type="password" placeholder="Password" value={password} onChange={(e => setPassword(e.target.value))} required className="member-form-input"/>
        <label className="member-input-label">Nickname</label>
        <input type="nickname" placeholder="Nickname" value={nickname} onChange={(e => setNickname(e.target.value))} required className="member-form-input"/>
        <div className="member-form-button-container">
        <button type="submit" className="member-form-button">Add Member</button>
        </div>
      </form>
    </div>
  )
}
export default MemberForm