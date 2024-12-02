
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Token missing' })

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded
    if (req.user.isDemoUser) {
      return res.status(403).json({ error: 'Sensitive feature disabled in Demo Mode' })
    }
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid token' })
  }
}

module.exports = authenticateToken