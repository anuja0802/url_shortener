const rateLimit = require('express-rate-limit');

// General API rate limit: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
});

// Stricter limit for URL creation: 20 per 15 minutes per IP
const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many URLs created from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, createUrlLimiter };
