const db = require('../models')

// Middleware to verify resource ownership based on user ID before allowing modifications
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

        const member = await db.jasen.findByPk(resourceId)
        if (!member) {
          return res.status(404).json({ error: 'Profile not found' })
        }
      } else {
        const modelMap = {
          'arvostelut': db.arvostelut,
          'elokuva': db.elokuva,
          'movie': db.movie
        }

        const model = modelMap[tableName]
        if (!model) {
          return res.status(400).json({ error: 'Invalid table name' })
        }

        const resource = await model.findByPk(resourceId)
        if (!resource) {
          return res.status(404).json({
            error: `${tableName} not found`
          })
        }

        if (resource.jasenid !== authenticatedUserId) {
          return res.status(403).json({
            error: `Unauthorized: You can only modify your own ${tableName}`
          })
        }
      }

      next()
    } catch (error) {
      console.error('Error in checkOwnership middleware:', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
}

module.exports = checkOwnership