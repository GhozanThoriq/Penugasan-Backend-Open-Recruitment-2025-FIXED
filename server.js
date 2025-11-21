require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Konfigurasi dan Modul Lokal
const connectDB = require('./src/config'); // Koneksi Mongoose (src/config/index.js)
const authRoutes = require('./src/routes/auth.routes');
const { requestLogger, errorLogger } = require('./src/middlewares/log.middleware'); // Middleware Logging
const logger = require('./src/config/logger'); // Instance Winston Logger

const app = express();

// =============================================
// Konfigurasi Dasar dan Proxy
// =============================================

// Jika di-deploy di platform yang menggunakan proxy (Render/Heroku),
// set TRUST_PROXY=1 di environment
if (process.env.TRUST_PROXY === '1') {
    app.set('trust proxy', 1);
}

// =============================================
// Security Middlewares
// =============================================

// 1. Security Headers
app.use(helmet());

// 2. CORS Setup (Multi-Origin Whitelist)
const allowedOriginEnv = process.env.CORS_ORIGIN || '';
const allowedOrigins = allowedOriginEnv.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Izinkan request tanpa origin (cURL, Postman, mobile apps)
        if (!origin) return callback(null, true);
        // Izinkan semua jika di dev atau menggunakan wildcard *
        if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) return callback(null, true);
        // Izinkan jika origin termasuk dalam whitelist
        if (allowedOrigins.includes(origin)) return callback(null, true);
        
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};
app.use(cors(corsOptions));

// 3. Global Rate Limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maksimal 100 request
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});
app.use(generalLimiter);


// =============================================
// Logging & Body Parser
// =============================================

// 4. Request Logging
app.use(requestLogger);

// 5. Body Parser
app.use(express.json());


// =============================================
// Routes (Mounting)
// =============================================

// Rute Autentikasi dan Pengguna
app.use('/api/auth', authRoutes);

// Rute Health Check
app.get('/', (req, res) => res.json({ message: 'API Works! (Health Check OK)' }));


// =============================================
// Error Handling
// =============================================

// 6. Error Logging
app.use(errorLogger);

// 7. Final Error Handler
app.use((err, req, res, next) => {
    // Log server-side dengan konteks tambahan
    logger.error(err.message || 'Server error', { url: req.originalUrl, stack: err.stack });

    // Handle error spesifik CORS
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({ message: 'CORS blocked: ' + err.message });
    }
    
    // Kirim respons error ke klien
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


// =============================================
// Server Start (Koneksi DB dan Listen)
// =============================================

const start = async () => {
    try {
        await connectDB(); // Coba koneksi ke MongoDB, akan melempar error jika gagal
        
        const PORT = process.env.PORT || 3000;
        
        // Server mendengarkan di port yang ditentukan
        app.listen(PORT, '0.0.0.0', () => logger.info(`Server listening on ${PORT}`));
        
    } catch (err) {
        // Jika koneksi DB gagal, log error dan matikan proses
        logger.error('Failed to start server:', { err: err.message });
        process.exit(1);
    }
};

start();
