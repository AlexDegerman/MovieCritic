const express = require('express')
const router = express.Router()
const memberController = require('../controllers/memberController')
const authenticateToken = require('../middlewares/authenticateToken')
const checkOwnership = require('../middlewares/checkOwnership')
const isProfileOwner = checkOwnership('jasen')

// Route to add a member
router.post('/', authenticateToken, memberController.addMember)

// Route to get a specific member
router.get('/:id', memberController.getMember)

// Route to update a specific member's profile
router.put('/:id', authenticateToken, memberController.updateMemberProfile)

// Route to get all members
router.get('/', memberController.getAllMembers)

// Route to delete a member account
router.delete('/:id', authenticateToken, isProfileOwner, memberController.deleteMemberAccount)

// Route to change a member's password
router.put('/:id/change-password', authenticateToken, isProfileOwner, memberController.changePassword)

module.exports = router
