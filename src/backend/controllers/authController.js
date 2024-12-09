const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config/db')
const activeDemoTokens = new Map()
const crypto = require('crypto')

const generateDemoToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Demo Token Request
const demoTokenRequest = (req, res) => {
  const demoToken = generateDemoToken()
  activeDemoTokens.set(demoToken)
  res.status(200).json({ demoToken })
}


// Demo Login
const demoLogin = async (req, res) => {
  const { demoToken } = req.body.data

  if (!activeDemoTokens.has(demoToken)) {
    return res.status(403).json({ error: 'Invalid or expired demo token' })
  }

  try {
    activeDemoTokens.delete(demoToken)

    const [rows] = await pool.execute('SELECT * FROM jasen WHERE nimimerkki = ?', ['demoUser'])
    if (rows.length === 0) return res.status(400).json({ error: 'Demo user not found' })

    const member = rows[0]
    const memberToken = { id: member.id, sahkopostiosoite: member.sahkopostiosoite, isDemoUser: true }
    const token = jwt.sign(memberToken, process.env.SECRET, { expiresIn: '24h' })
    res.status(200).json({ token })
  } catch {
    res.status(500).json({ error: 'Error in demo login' })
  }
}

// Member Login
const LoginMember = async (req, res) => {
  const { sahkopostiosoite, salasana } = req.body

  try {
    const [rows] = await pool.execute('SELECT * FROM jasen WHERE sahkopostiosoite = ?', [sahkopostiosoite])
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid email or password' })

    const member = rows[0]
    const validPassword = await bcrypt.compare(salasana, member.salasana)
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' })

    const memberToken = { id: member.id, sahkopostiosoite: member.sahkopostiosoite }
    const token = jwt.sign(memberToken, process.env.SECRET, { expiresIn: '24h' })
    res.status(200).json({ token })
  } catch {
    res.status(500).json({ error: 'Error logging in' })
  }
}

module.exports = {
  demoTokenRequest,
  demoLogin,
  LoginMember
}
