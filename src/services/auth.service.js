// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '15m';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';
const RESET_EXPIRES_MS = parseInt(process.env.RESET_PASSWORD_EXPIRES || '3600000', 10);

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

// verify refresh token
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

async function saveRefreshToken(userId, token) {
  const user = await User.findById(userId);
  user.refreshTokens.push({ token, createdAt: new Date() });
  await user.save();
}

async function revokeRefreshToken(userId, token) {
  await User.updateOne(
    { _id: userId },
    { $pull: { refreshTokens: { token } } }
  );
}

async function revokeAllRefreshTokens(userId) {
  await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
}

// password reset: generate token (plain), but store hashed token
function generateResetToken() {
  const buffer = crypto.randomBytes(32);
  const token = buffer.toString('hex'); // send this to user
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashed };
}

async function setResetTokenForUser(email) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const { token, hashed } = generateResetToken();
  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = Date.now() + RESET_EXPIRES_MS;
  await user.save();

  return token; // plain token to send via email (or return for test)
}

async function resetPasswordWithToken(token, newPassword) {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return null;

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  // pre-save hook will hash password
  await user.save();

  // revoke all refresh tokens on password change (security)
  await revokeAllRefreshTokens(user._id);

  return user;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  saveRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  setResetTokenForUser,
  resetPasswordWithToken,
};