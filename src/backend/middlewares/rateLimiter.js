const rateLimit = require('express-rate-limit')

// Rate limiting middleware to control request frequency globally and for auth routes
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5000,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, 
  legacyHeaders: false
})

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5000, 
  message: 'Too many requests to this route, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = { limiter, authLimiter }
