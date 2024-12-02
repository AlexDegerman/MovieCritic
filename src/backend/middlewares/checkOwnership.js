const pool = require('../config/db')

const checkOwnership = (tableName) => {
  return async (req, res, next) => {
    try {
      const resourceId = parseInt(req.params.id)
      const authenticatedUserId = req.user.id

      if (tableName === 'jasen') {
        if (resourceId !== authenticatedUserId) {
          return res.status(403).json({ 
            error: 'Unauthorized: You can only modify your own profile' 
          })
        }
        
        const [rows] = await pool.execute(
          'SELECT id FROM jasen WHERE id = ?',
          [resourceId]
        )

        if (rows.length === 0) {
          return res.status(404).json({ error: 'Profile not found' })
        }
      } else {
        const [rows] = await pool.execute(
          `SELECT jasenid FROM ${tableName} WHERE id = ?`,
          [resourceId]
        )
        if (rows.length === 0) {
          return res.status(404).json({ 
            error: `${tableName} not found` 
          })
        }

        if (rows[0].jasenid !== authenticatedUserId) {
          return res.status(403).json({ 
            error: `Unauthorized: You can only modify your own ${tableName}` 
          })
        }
      }

      next()
    } catch {
      res.status(500).json({ error: 'Server error' })
    }
  }
}

module.exports = checkOwnership
