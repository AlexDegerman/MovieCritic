const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const { limiter, authLimiter } = require('./middlewares/rateLimiter')
dotenv.config()

const authRoutes = require('./routes/authRoutes')
const memberRoutes = require('./routes/memberRoutes')
const movieRoutes = require('./routes/movieRoutes')
const reviewRoutes = require('./routes/reviewRoutes')


// Middleware
app.use(cors({
  origin: ['https://moviecriticfi.onrender.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(limiter)

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
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
