const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const verifyRecaptcha = require('../middlewares/recaptchaVerify')

// Route for generating demo token
router.post('/demo-token', authController.demoTokenRequest)

// Route for demo login
router.post('/demo-login',verifyRecaptcha, authController.demoLogin)

// Route for member login
router.post('/login',verifyRecaptcha, authController.loginMember)

module.exports = router
