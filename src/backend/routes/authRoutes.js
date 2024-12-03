const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// Route for generating demo token
router.post('/demo-token', authController.demoTokenRequest)

// Route for demo login
router.post('/demo-login', authController.demoLogin)

// Route for member login
router.post('/login', authController.LoginMember)

module.exports = router
