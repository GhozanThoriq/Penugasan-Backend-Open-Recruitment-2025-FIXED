DOKUMENTASI API (POSTMAN)


Base URL
http://localhost:3000


GET/Health Check   --->    Public Endpoints
Response
{ "message": "API Works!" }


POST /api/auth/register   --->   Registrasi user baru.
Body
{
  "email": "email@example.com",
  "password": "password123"
}


POST /api/auth/login   --->    Login dan mendapatkan JWT.
Body
{
  "email": "email@example.com",
  "password": "password123"
}
Response
{
  "token": "<jwt>",
  "refreshToken": "<refresh_token>"
}


GET /api/auth/me  ---> Protected Endpoints (Mengambil data user login.)
Header
Authorization: Bearer <token>


POST /api/auth/refresh   --->    Mengambil token baru menggunakan refresh token.
Body
{
  "refreshToken": "<refresh_token>"
}


POST /api/auth/logout   --->    Logout dan menonaktifkan refresh token.
Body
{
  "refreshToken": "<refresh_token>"
}


POST /api/auth/request-reset    --->    Reset Password
Body
{
  "email": "email@example.com"
}


POST /api/auth/reset-password     --->     Reset password menggunakan token reset
Body
{
  "token": "<reset_token>",
  "password": "newPassword123"
}
