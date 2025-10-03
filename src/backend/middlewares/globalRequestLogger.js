let totalRequests = 0

function globalRequestLogger(req, res, next) {
  totalRequests++
  console.log(`[Global] Request #${totalRequests} - ${req.method} ${req.originalUrl} from ${req.ip}`)
  next()
}

module.exports = globalRequestLogger