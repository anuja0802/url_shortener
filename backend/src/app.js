require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const { redirectUrl } = require('./controllers/urlController');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());   // Sets secure HTTP headers (XSS protection, no sniff, etc.)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE'],
}));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Global rate limiter ───────────────────────────────────────────────────────
app.use(apiLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/urls', urlRoutes);

// ── Redirect route (must come after /api routes) ──────────────────────────────
app.get('/:shortCode', redirectUrl);

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

// ── Start server (skip in test environment) ───────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  });
}

module.exports = app; // exported for testing
