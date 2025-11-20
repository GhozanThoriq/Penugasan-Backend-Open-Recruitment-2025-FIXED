const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '1h';

exports.register = async ({ email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email, password: hashed });
  return { id: user._id, email: user.email };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { token, user: { id: user._id, email: user.email } };
};