const bcrypt = require('bcrypt')
const db = require('../models')

// Controller for managing member accounts, including adding, updating, deleting, and changing passwords

// Add member
const addMember = async (req, res) => {
  const { sahkopostiosoite, salasana, nimimerkki, liittymispaiva } = req.body
  
  try {
    const hashedPassword = await bcrypt.hash(salasana, 10)
    
    await db.jasen.create({
      sahkopostiosoite,
      salasana: hashedPassword,
      nimimerkki,
      liittymispaiva
    })
    
    res.status(201).json({ message: 'Member added successfully!' })
  } catch (error) {
    console.error('Error adding member:', error)
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'Nickname already exists. Please choose a different one.' 
      })
    }
    
    res.status(500).json({ error: 'Error adding member' })
  }
}

// Get specific member
const getMember = async (req, res) => {
  const memberId = req.params.id
  
  try {
    const member = await db.jasen.findByPk(memberId)
    
    if (!member) {
      return res.status(404).json({ 
        message: "The member's page is unavailable. It might have been deleted or the link is incorrect." 
      })
    }
    
    res.status(200).json(member)
  } catch (error) {
    console.error('Error in member search:', error)
    res.status(500).json({ error: 'Error in member search' })
  }
}

// Update specific member's profile details
const updateMemberProfile = async (req, res) => {
  const memberId = req.params.id
  const { 
    nimimerkki, 
    sukupuoli, 
    paikkakunta, 
    harrastukset, 
    suosikkilajityypit, 
    suosikkifilmit, 
    omakuvaus 
  } = req.body
  
  try {
    const [updatedRowsCount] = await db.jasen.update({
      nimimerkki,
      sukupuoli,
      paikkakunta,
      harrastukset,
      suosikkilajityypit,
      suosikkifilmit,
      omakuvaus
    }, {
      where: { id: memberId }
    })
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Member not found' })
    }
    
    res.status(200).json({ message: 'Profile details updated successfully!' })
  } catch (error) {
    console.error('Error updating profile details:', error)
    res.status(500).json({ error: 'Error updating profile details' })
  }
}

// Get all members
const getAllMembers = async (req, res) => {
  try {
    const members = await db.jasen.findAll()
    res.status(200).json(members)
  } catch (error) {
    console.error('Error in query:', error)
    res.status(500).json({ error: 'Error in query' })
  }
}

// Delete member account
const deleteMemberAccount = async (req, res) => {
  const memberId = req.params.id
  
  try {
    const deletedRowsCount = await db.jasen.destroy({
      where: { id: memberId }
    })
    
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Member not found' })
    }
    
    res.status(200).json({ message: 'Account deleted successfully!' })
  } catch (error) {
    console.error('Error deleting profile:', error)
    res.status(500).json({ error: 'Error deleting profile' })
  }
}

// Change member password
const changePassword = async (req, res) => {
  const memberId = req.params.id
  const { currentPassword, newPassword } = req.body
  
  try {
    const member = await db.jasen.findByPk(memberId, {
      attributes: ['id', 'salasana']
    })
    
    if (!member) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, member.salasana)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await db.jasen.update(
      { salasana: hashedNewPassword },
      { where: { id: memberId } }
    )

    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({ error: 'Error changing password' })
  }
}

module.exports = {
  addMember,
  getMember,
  updateMemberProfile,
  getAllMembers,
  deleteMemberAccount,
  changePassword
}