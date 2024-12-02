const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config/db')
const DEMO_SECRET = process.env.DEMO_SECRET
const activeDemoTokens = new Set()
const crypto = require('crypto')

const generateDemoToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Demo Token Request
const demoTokenRquest = (req, res) => {
  if (!DEMO_SECRET) {
    return res.status(403).json({ error: 'Demo mode not available' })
  }

  const { secret } = req.body
  if (secret !== DEMO_SECRET) {
    return res.status(403).json({ error: 'Invalid demo credentials' })
  }

  const demoToken = generateDemoToken()
  activeDemoTokens.add(demoToken)

  res.status(200).json({ demoToken })
}

// Demo Login
const demoLogin = async (req, res) => {
  const { demoToken } = req.body
  if (!activeDemoTokens.has(demoToken.data.demoToken)) {

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
  } catch (error) {
    res.status(500).json({ error: 'Error in demo login: ' + error.message })
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
  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error.message })
  }
}

module.exports = {
  demoTokenRquest,
  demoLogin,
  LoginMember,
}
