// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // your middleware for access token
const rateLimit = require('express-rate-limit');

// login limiter already in your code; reuse if needed

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// refresh token
router.post('/refresh', authCtrl.refresh);

// logout / revoke
router.post('/logout', authCtrl.logout);

// password reset flows
router.post('/request-reset', authCtrl.requestPasswordReset);
router.post('/reset-password', authCtrl.resetPassword);

// me
router.get('/me', authMiddleware, authCtrl.me);

module.exports = router;