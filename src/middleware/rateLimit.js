const {  requestClientIp } = require('../middleware/logger')
const rateLimit = {};

const rateLimitMiddleware = (req, res, next) => {
  const maxRequestsPerMinute = 60; // maximum requests per minute
  const ip = req.ip; // get the IP address of the client

  // Check if the client has exceeded the rate limit
  if (!rateLimit[ip]) {
    rateLimit[ip] = {
      count: 1,
      timestamp: Date.now()
    };
  } else {
    const timeElapsed = Date.now() - rateLimit[ip].timestamp;
    if (timeElapsed < 60000) {
      if (rateLimit[ip].count >= maxRequestsPerMinute) {
          requestClientIp.info(`Rate limit exceeded for IP address ${ip}`)
        return res.status(429).send('Too many requests, please try again later');
      }
      rateLimit[ip].count++;
    } else {
      rateLimit[ip] = {
        count: 1,
        timestamp: Date.now()
      };
    }
  }

  requestClientIp.info(`Received ${req.method} request for ${req.originalUrl} from IP address ${ip}`)

  // Call the next middleware in the chain
  next();
};

module.exports = rateLimitMiddleware;
