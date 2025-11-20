const { body, validationResult } = require('express-validator');

// Validasi untuk register
exports.registerValidator = [
  body('email')
    .isEmail().withMessage('Email tidak valid'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  
  // cek error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validasi untuk login
exports.loginValidator = [
  body('email')
    .isEmail().withMessage('Email tidak valid'),
  body('password')
    .notEmpty().withMessage('Password wajib diisi'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}
];