const rateLimit = require('express-rate-limit')

// Rate limiting middleware to control request frequency globally and for auth routes
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, 
  legacyHeaders: false
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: 'Too many requests to this route, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = { limiter, authLimiter }
