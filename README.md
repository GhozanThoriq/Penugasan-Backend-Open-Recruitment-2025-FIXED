DOKUMENTASI ENDPOINT API (JWT + REFRESH TOKEN) Oleh Ghozan Thoriq

Layanan backend ini mengimplementasikan arsitektur RESTful API dengan fokus utama pada Security by Design (Helmet, CORS Whitelist, Rate Limiter) dan Advanced Authentication (JWT Access Token & Refresh Token).

Base URL layanan: http://localhost:3000


1. ENDPOINT PUBLIK (Tidak Memerlukan Token)
Akses ke rute ini tidak memerlukan header Authorization.
GET /
Deskripsi: Health Check (Memastikan server hidup dan koneksi database OK).
Response: 200 OK dengan Body {"message": "API Works!"}

POST /api/auth/register
Deskripsi: Registrasi pengguna baru.
Body: {"email": "email@example.com", "password": "password123"}

POST /api/auth/login
Deskripsi: Login pengguna dan mengeluarkan pasangan token: Access Token (JWT) dan Refresh Token.
Body: {"email": "email@example.com", "password": "password123"}
Response: { "token": "<JWT_Access_Token>", "refreshToken": "<Refresh_Token>" }


2. ENDPOINT KHUSUS TOKEN (MANAGEMENT TOKEN)
Rute ini menangani manajemen siklus hidup token dan password reset.
POST /api/auth/refresh
Deskripsi: Mengambil Access Token baru karena Access Token lama sudah kadaluarsa.
Body: {"refreshToken": "<refresh_token>"}

POST /api/auth/logout
Deskripsi: Logout, menonaktifkan (revoke) dan menghapus Refresh Token dari database.
Body: {"refreshToken": "<refresh_token>"}
POST /api/auth/request-reset
Deskripsi: Meminta Reset Token untuk mengganti password (dikirim ke email di implementasi production).
Body: {"email": "email@example.com"}

POST /api/auth/reset-password
Deskripsi: Reset password menggunakan Reset Token dan password baru.
Body: {"token": "<reset_token>", "password": "newPassword123"}


3. ENDPOINT TERLINDUNGI (PROTECTED)
Rute ini W A J I B menyertakan header Authorization: Bearer <ACCESS_TOKEN>.
GET /api/auth/me
Deskripsi: Mengambil data profil pengguna yang sedang login.
Keamanan: Bearer Token Wajib
CATATAN PENTING (SETUP & TESTING)
Autentikasi: Endpoint /api/auth/me tidak akan berfungsi tanpa Access Token yang valid.

Token Management: Refresh Token digunakan di Body POST untuk tindakan management (Refresh & Logout).

Testing: Gunakan Postman Collection (postman_collection.json) atau file requests.http untuk menguji flow ini secara berurutan, termasuk Negative Testing (uji error 400/401).
