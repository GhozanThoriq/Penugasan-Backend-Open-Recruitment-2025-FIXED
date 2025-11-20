require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config');
const app = express();

// Trust proxy (Heroku/Render/nginx)
if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

// =============================
// Security Middlewares
// =============================
app.use(helmet());

// CORS setup
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);         // Postman/cURL/mobile apps
    if (allowedOrigin === '*') return callback(null, true);

    const whitelist = allowedOrigin.split(',').map(s => s.trim());
    if (whitelist.includes(origin)) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// General rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, try again later.' }
}));

// Body parser
app.use(express.json());

// =============================
// Routes
// =============================
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => res.json({ ok: true }));

app.post('/api/auth/login',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts, try again later.' }
  }),
  (req, res) => {
    res.json({ message: 'login endpoint (stub)' });
  }
);

// =============================
// Error handler
// =============================
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ message: 'CORS blocked: ' + err.message });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// =============================
// Server Start
// =============================
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected, starting server...");
    app.listen(PORT, '0.0.0.0', () => console.log(`Server on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

start();
