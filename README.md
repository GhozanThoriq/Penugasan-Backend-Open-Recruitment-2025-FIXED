# DOKUMENTASI ENDPOINT API (JWT + REFRESH TOKEN) Oleh Ghozan Thoriq
Project Backend ini mengimplementasikan arsitektur RESTful API dengan fokus pada:
- Security by Design: Helmet, CORS Whitelist, Rate Limiter
- Advanced Authentication: JWT Access Token + Refresh Token
- Token Lifecycle Management: Refresh, Revoke, Reset Password
### Base URL layanan: http://localhost:3000

### Dependencies
- express
- cors
- helmet
- express-rate-limit
- dotenv
- mongoose
- bcrypt
- jsonwebtoken
- express-validator
- winston
- express-winston
- morgan

### Dev Dependencies
- nodemon
- jest
- supertest


## Cara Menjalankan
### 1. Install Dependencies
### 2. Buat File .env
* Contoh format .env:
* PORT=3000
* MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
* JWT_SECRET=your_secret
* JWT_EXPIRES=15m
* REFRESH_TOKEN_SECRET=super_rahasia
* REFRESH_TOKEN_EXPIRES=7d
* RESET_PASSWORD_EXPIRES=3600000
* CORS_ORIGIN=http://localhost:5173
### 3. Jalankan Server
* npm run dev
 
# Postman
## 1. ENDPOINT PUBLIK (Tidak Memerlukan Token)
Akses ke rute ini tidak memerlukan header Authorization.
* GET /
Deskripsi: Health Check (Memastikan server hidup dan koneksi database OK).
Response: 200 OK dengan Body {"message": "API Works!"}

* POST /api/auth/register
Deskripsi: Registrasi pengguna baru.
Body: {"email": "email@example.com", "password": "password123"}

* POST /api/auth/login
Deskripsi: Login pengguna dan mengeluarkan pasangan token: Access Token (JWT) dan Refresh Token.
Body: {"email": "email@example.com", "password": "password123"}
Response: { "token": "<JWT_Access_Token>", "refreshToken": "<Refresh_Token>" }


## 2. ENDPOINT KHUSUS TOKEN (MANAGEMENT TOKEN)
Rute ini menangani manajemen siklus hidup token dan password reset.
### POST /api/auth/refresh
* Deskripsi: Mengambil Access Token baru karena Access Token lama sudah kadaluarsa.
* Body: {"refreshToken": "<refresh_token>"}

### POST /api/auth/logout
* Deskripsi: Logout, menonaktifkan (revoke) dan menghapus Refresh Token dari database.
* Body: {"refreshToken": "<refresh_token>"}
### POST /api/auth/request-reset
* Deskripsi: Meminta Reset Token untuk mengganti password (dikirim ke email di implementasi production).
* Body: {"email": "email@example.com"}
### POST /api/auth/reset-password
* Deskripsi: Reset password menggunakan Reset Token dan password baru.
* Body: {"token": "<reset_token>", "password": "newPassword123"}


## 3. ENDPOINT TERLINDUNGI (PROTECTED)
Rute ini W A J I B menyertakan header Authorization: Bearer <ACCESS_TOKEN>.
### GET /api/auth/me
* Deskripsi: Mengambil data profil pengguna yang sedang login.
* Keamanan: Bearer Token Wajib
### CATATAN PENTING (SETUP & TESTING)
* Autentikasi: Endpoint /api/auth/me tidak akan berfungsi tanpa Access Token yang valid.
* Token Management: Refresh Token digunakan di Body POST untuk tindakan management (Refresh & Logout).

Testing: Gunakan Postman Collection (postman_collection.json) atau file requests.http untuk menguji flow ini secara berurutan, termasuk Negative Testing (uji error 400/401).
