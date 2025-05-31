const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../models')
const crypto = require('crypto')
const activeDemoTokens = new Map()
const DEMO_TOKEN_EXPIRATION = 10 * 60 * 1000

// Controller handling demo token generation, demo login, and member login functionality

// Generate random demo token
const generateDemoToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Clean up expired tokens every 60 seconds
const cleanUpExpiredDemoTokens = () => {
  const now = Date.now()
  for (const [token, timestamp] of activeDemoTokens.entries()) {
    if (now - timestamp > DEMO_TOKEN_EXPIRATION) {
      activeDemoTokens.delete(token)
    }
  }
}

setInterval(cleanUpExpiredDemoTokens, 60 * 1000)

// Demo Token Request
const demoTokenRequest = (req, res) => {
  const demoToken = generateDemoToken()
  activeDemoTokens.set(demoToken, Date.now())
  res.status(200).json({ demoToken })
}

// Demo Login
const demoLogin = async (req, res) => {
  const { demoToken } = req.body.data

  const tokenTimestamp = activeDemoTokens.get(demoToken)
  if (!tokenTimestamp || Date.now() - tokenTimestamp > DEMO_TOKEN_EXPIRATION) {
    activeDemoTokens.delete(demoToken)
    return res.status(403).json({ error: 'Invalid or expired demo token' })
  }

  try {
    activeDemoTokens.delete(demoToken)
    const member = await db.jasen.findOne({
      where: { nimimerkki: 'demoUser' }
    })

    if (!member) {
      return res.status(400).json({ error: 'Demo user not found' })
    }

    const memberToken = {
      id: member.id,
      sahkopostiosoite: member.sahkopostiosoite,
      isDemoUser: true
    }

    const token = jwt.sign(memberToken, process.env.SECRET, { expiresIn: '24h' })
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error in demo login:', error)
    res.status(500).json({ error: 'Error in demo login' })
  }
}

// Member Login
const loginMember = async (req, res) => {
  const { sahkopostiosoite, salasana } = req.body
  try {
    const member = await db.jasen.findOne({
      where: { sahkopostiosoite: sahkopostiosoite }
    })

    if (!member) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(salasana, member.salasana)
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const memberToken = {
      id: member.id,
      sahkopostiosoite: member.sahkopostiosoite
    }

    const token = jwt.sign(memberToken, process.env.SECRET, { expiresIn: '24h' })
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: 'Error logging in' })
  }
}

module.exports = {
  demoTokenRequest,
  demoLogin,
  loginMember
}
