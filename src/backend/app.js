const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const globalRequestLogger = require('./middlewares/globalRequestLogger')
const { limiter, authLimiter } = require('./middlewares/rateLimiter')
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' })
} else {
  dotenv.config()
}

const authRoutes = require('./routes/authRoutes')
const memberRoutes = require('./routes/memberRoutes')
const movieRoutes = require('./routes/movieRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(limiter)
app.use(globalRequestLogger)


// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/jasen', memberRoutes) 
app.use('/api/elokuva', movieRoutes)
app.use('/api/arvostelut', reviewRoutes)

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'OK' })
})

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
