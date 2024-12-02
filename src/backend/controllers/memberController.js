const bcrypt = require('bcrypt')
const pool = require('../config/db')

// Add Member
const addMember = async (req, res) => {
  const { sahkopostiosoite, salasana, nimimerkki, liittymispaiva } = req.body
  try {
    const hashedPassword = await bcrypt.hash(salasana, 10)
    await pool.execute(
      'INSERT INTO jasen (sahkopostiosoite, salasana, nimimerkki, liittymispaiva) VALUES (?, ?, ?, ?)',
      [sahkopostiosoite, hashedPassword, nimimerkki, liittymispaiva]
    )
    res.status(201).json({ message: 'Member added successfully!' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Nickname already exists. Please choose a different one.' })
    }
    res.status(500).json({ error: 'Error adding member: ' + error.message })
  }
}

// Get Specific Member
const getMember = async (req, res) => {
  const memberId = req.params.id
  try {
    const [rows] = await pool.execute('SELECT * FROM jasen WHERE id = ?', [memberId])
    if (rows.length === 0) return res.status(404).json({ message: 'The member’s page is unavailable. It might have been deleted or the link is incorrect.' })
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error in member search: ' + error.message })
  }
}

// Update Specific Member's Profile Details
const updateMemberProfile = async (req, res) => {
  const memberId = req.params.id
  const { nimimerkki, sukupuoli, paikkakunta, harrastukset, suosikkilajityypit, suosikkifilmit, omakuvaus } = req.body
  try {
    await pool.execute(
      'UPDATE jasen SET nimimerkki = ?, sukupuoli = ?, paikkakunta = ?, harrastukset = ?, suosikkilajityypit = ?, suosikkifilmit = ?, omakuvaus = ? WHERE id = ?',
      [nimimerkki, sukupuoli, paikkakunta, harrastukset, suosikkilajityypit, suosikkifilmit, omakuvaus, memberId]
    )
    res.status(200).json({ message: 'Profile details updated successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile details: ' + error.message })
  }
}

// Get All Members
const getAllMembers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM jasen')
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Error in query: ' + error.message })
  }
}

// Delete Member Account
const deleteMemberAccount = async (req, res) => {
  const memberId = req.params.id
  try {
    await pool.execute('DELETE FROM jasen WHERE id = ?', [memberId])
    res.status(200).json({ message: 'Account deleted successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting profile: ' + error.message })
  }
}

// Change Member Password
const changePassword = async (req, res) => {
  const memberId = req.params.id
  const { currentPassword, newPassword } = req.body
  try {
    const [rows] = await pool.execute('SELECT salasana FROM jasen WHERE id = ?', [memberId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, rows[0].salasana)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await pool.execute('UPDATE jasen SET salasana = ? WHERE id = ?', [hashedNewPassword, memberId])

    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error changing password: ' + error.message })
  }
}

module.exports = {
  addMember,
  getMember,
  updateMemberProfile,
  getAllMembers,
  deleteMemberAccount,
  changePassword,
}
