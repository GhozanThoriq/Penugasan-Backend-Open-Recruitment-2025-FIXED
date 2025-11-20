const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    // req.userId set oleh middleware
    res.json({ userId: req.userId });
  } catch (err) { next(err); }
};