const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, me } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator } = require('../middlewares/validators');

// Limiter khusus untuk login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // cuma 5 percobaan login per 15 menit
  message: { message: 'Too many login attempts. Try again later.' }
});

// Register
router.post('/register', registerValidator, register);

// Login
router.post('/login', loginLimiter, loginValidator, login);

// Get my info
router.get('/me', authMiddleware, me);

module.exports = router;