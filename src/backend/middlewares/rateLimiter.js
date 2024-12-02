const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5000,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, 
  legacyHeaders: false
})

module.exports = limiter