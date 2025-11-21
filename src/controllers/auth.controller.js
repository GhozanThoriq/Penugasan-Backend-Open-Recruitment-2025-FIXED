// src/controllers/auth.controller.js
const User = require('../models/user.model');
const {
  signAccessToken,
  signRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  setResetTokenForUser,
  resetPasswordWithToken,
} = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(409).json({ message: 'Email already used' });

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { sub: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await saveRefreshToken(user._id, refreshToken);

    res.json({ token: accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });

    // verify signature
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.sub;

    // verify token still stored in user.refreshTokens
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    const found = user.refreshTokens.some(rt => rt.token === refreshToken);
    if (!found) return res.status(401).json({ message: 'Refresh token revoked' });

    // generate new tokens
    const payload = { sub: user._id.toString(), role: user.role };
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);

    // rotate: remove old token, save new
    await revokeRefreshToken(user._id, refreshToken);
    await saveRefreshToken(user._id, newRefresh);

    res.json({ token: newAccess, refreshToken: newRefresh });
  } catch (err) {
    // jwt.verify throws if invalid
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });
    // if token invalid, we still try to remove it based on payload
    try {
      const decoded = verifyRefreshToken(refreshToken);
      await revokeRefreshToken(decoded.sub, refreshToken);
    } catch (e) {
      // if invalid signature, just ignore but respond ok
    }
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

// password reset request
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await setResetTokenForUser(email);
    if (!token) return res.status(404).json({ message: 'User not found' });

    // In production -> send by email using nodemailer
    // For testing: return token in response (or log)
    res.json({ message: 'Password reset token generated (in real app, sent by email)', token });
  } catch (err) {
    next(err);
  }
};

// password reset execution
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Missing token or password' });

    const user = await resetPasswordWithToken(token, password);
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

// me route unchanged
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password -refreshTokens -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};