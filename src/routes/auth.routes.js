const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator } = require('../middlewares/validators');

// Register
router.post('/register', registerValidator, register);

// Login
router.post('/login', loginValidator, login);

// Get my info
router.get('/me', authMiddleware, me);

module.exports = router;