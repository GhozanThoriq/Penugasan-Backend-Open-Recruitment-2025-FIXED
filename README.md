# 🛡️ Penugasan Backend Open Recruitment 2025:

Proyek RESTful API ini dikembangkan menggunakan **Node.js, Express.js, dan Mongoose (MongoDB)** dengan fokus utama pada **Keamanan Aplikasi (AppSec)** dan **Code Readability (Arsitektur MVC)**.

## 1. Instalasi dan Setup Proyek

### A. Prasyarat

* **Node.js dan NPM** terinstal.
* **MongoDB** berjalan (lokal atau menggunakan layanan *cloud* seperti MongoDB Atlas).

### B. Instalasi Dependencies

Jalankan perintah berikut di *root directory* proyek:
```bash
npm install

Konfigurasi Environment (File .env)
PORT=3000
MONGODB_URI=[LINK_MONGO_DB_KAMU]
JWT_SECRET=supersecretkeyyangpanjangdankompleks

### D. Menjalankan Server (Development Mode)
npm run dev
Server akan berjalan di http://localhost:3000

### Struktur Folder
src/
├── config/              # ⚙️ Konfigurasi dasar (MongoDB connection, JWT setup)
│   └── db.js            # Inisialisasi koneksi Mongoose ke MongoDB
├── controllers/         # 🧠 Logika Bisnis: Fungsi yang menangani permintaan dan mengirim respons
│   ├── authController.js  # Register, Login, Logout
│   └── userController.js  # Mendapatkan/Mengubah data pengguna
├── middleware/          # 🛡️ Fungsi Keamanan & Validasi (JWT Auth, Anti-SQL Injection)
│   └── authMiddleware.js  # Middleware untuk verifikasi JWT
├── models/              # 🏛️ Skema Data Mongoose
│   ├── User.js          # Skema Model Pengguna (dengan bcrypt hashing)
│   └── [Model Lain].js  # Model data lainnya
└── routes/              # 🧭 Routing Endpoint
    ├── authRoutes.js    # Rute untuk /api/auth/...
    └── userRoutes.js    # Rute untuk /api/users/...

index.js                   # 🚀 Entry point utama (inisialisasi Express dan DB)
package.json               # Daftar dependencies dan scripts
.env                       # Variabel lingkungan