const axios = require('axios')

const verifyRecaptcha = async (req, res, next) => {
  const token = req.body.recaptchaToken || req.body.data?.recaptchaToken

  if (!token) {
    return res.status(400).json({ error: 'reCAPTCHA token is required' })
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    )

    const { success, score, action } = response.data
    console.log('reCAPTCHA Score:', score)

    if (!success) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed' })
    }

    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE) || 0.5
    if (score < minScore) {
      console.warn(`Low reCAPTCHA score: ${score} for action: ${action}`)
      return res.status(403).json({ 
        error: 'Security verification failed',
        score 
      })
    }

    req.recaptchaScore = score
    next()
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    res.status(500).json({ error: 'Error verifying reCAPTCHA' })
  }
}

module.exports = verifyRecaptcha