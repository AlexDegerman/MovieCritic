import { useState } from "react"
import MCService from "../services/MCService"
import { useNavigate } from 'react-router-dom';

// This component displays a form to add members to the database
const MemberForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()

  // Adds a new member to the database
  const addMember = async (event) => {
    event.preventDefault()
    const today = new Date();
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
      alert("Succesfully added member!")
      navigate('/')
    } catch (error) {
      console.error("Error adding new member: ", error)
    }
  } else {
    console.error('No token found')
    }
  }
  return (
    <div>
      <h1>Add Member</h1>
      <form onSubmit={addMember}>
        <input type="email" placeholder="Email" value={email} onChange={(e => setEmail(e.target.value))} required/>
        <input type="password" placeholder="Password" value={password} onChange={(e => setPassword(e.target.value))} required/>
        <input type="nickname" placeholder="Nickname" value={nickname} onChange={(e => setNickname(e.target.value))} required/>
        <button type="submit">Add Member</button>
      </form>
    </div>
  )
}
export default MemberForm