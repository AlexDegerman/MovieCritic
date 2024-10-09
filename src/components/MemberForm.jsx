import { useState } from "react"
import MCService from "../services/MCService"
import { useNavigate } from 'react-router-dom';

const MemberForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()

  const addMember = async (event) => {
    event.preventDefault()
    const today = new Date()
    const date = [today.getDate(), today.getMonth() + 1, today.getFullYear()]
    const paddedDate = date.map(num => num.toString().padStart(2, "0"))
    const joinDate = `${paddedDate[0]}.${paddedDate[1]}.${paddedDate[2]}`
    const member = {
      sahkopostiosoite: email,
      salasana: password,
      nimimerkki: nickname,
      liittymispaiva: joinDate
    }
    try {
      const res = await MCService.postMember(member)
      alert("Succesfully added member!")
      navigate('/')
    } catch (error) {
      console.error("Error adding new member: " + error)
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