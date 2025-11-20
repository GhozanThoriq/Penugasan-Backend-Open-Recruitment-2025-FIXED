📚 Dokumentasi API — Persiapan Backend

Untuk kemudahan pengujian API, tersedia Postman Collection yang sudah disiapkan. Collection ini dilengkapi script otomatis untuk menyimpan token JWT setelah login, sehingga request selanjutnya bisa langsung menggunakan token tersebut.



📥 Download Postman Collection
(Import ke Postman → pilih tab “File” → upload.)



🧩 Daftar Endpoint Utama
🔓 Public Endpoints
GET; Endpoint: / ;Deskripsi = Health Check ;Auth ❌

POST; Endpoint: /api/auth/register; Deskripsi: Registrasi user baru; Body JSON: { "email": "...", "password": "..." } ;Auth ❌

POST; Endpoint: /api/auth/login; Deskripsi: Login & dapatkan token JWT; Body JSON: { "email": "...", "password": "..." } ;Auth ❌
🔐 Protected Endpoints
GET; Endpoint: /api/auth/me ;Deskripsi = Mendapatkan data user berdasarkan token; Header: Authorization: Bearer <token> ;Auth ✅
Catatan:
Akses endpoint yang dilindungi membutuhkan header:
Authorization: Bearer <TOKEN_KAMU>




🧪 Testing Dengan Postman
Import file postman_collection.json
Atur environment Postman:
baseUrl = http://localhost:3000
token = (kosong, akan terisi otomatis)
Jalankan request Login
Token dari response akan otomatis tersimpan ke environment
Jalankan GET /api/auth/me
Semua sudah otomatis, tinggal klik "Send".

🛠 Tech Stack
Node.js + Express
MongoDB Atlas + Mongoose
JWT Authentication
Bcrypt, Helmet, CORS, Rate Limit
Express-validator
VSCode REST Client / Postman