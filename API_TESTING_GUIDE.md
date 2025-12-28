# 🧪 API Testing Guide - Barber Booking Microservices

## 📋 Table of Contents
1. [Setup](#setup)
2. [Public Routes](#public-routes)
3. [Protected Routes](#protected-routes)
4. [Complete User Flow](#complete-user-flow)

---

## 🚀 Setup

### Start Services

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - User Service:**
```bash
cd services/user-service
npm run dev
```

**Terminal 3 - API Gateway:**
```bash
cd services/api-gateway
npm run dev
```

### Base URLs
- **API Gateway:** `http://localhost:3000`
- **User Service (Direct):** `http://localhost:3001`

**Note:** Always use API Gateway URL in production. Direct service URLs are for testing only.

---

## 📝 PUBLIC ROUTES (No Authentication Required)

### 1. Health Check

**Request:**
```http
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "message": "Barber Booking API Gateway",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "users": "/api/users/*",
    "barbers": "/api/barbers/*",
    "bookings": "/api/bookings/*",
    "payments": "/api/payments/*"
  }
}
```

---

### 2. Register User

**Request:**
```http
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "customer"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for verification code.",
  "user": {
    "id": "676a1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "customer",
    "isVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**What Happens:**
1. ✅ User created in database
2. ✅ Password hashed with bcrypt
3. ✅ 6-digit OTP generated
4. ✅ Welcome email sent with OTP
5. ✅ JWT token returned

**Check Your Email:**
You should receive an email with a 6-digit OTP code.

---

### 3. Verify Email (OTP)

**Request:**
```http
POST http://localhost:3000/api/users/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "user": {
    "id": "676a1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

**Error Cases:**
```json
// Invalid OTP
{
  "success": false,
  "error": "Invalid or expired OTP"
}

// Expired OTP (after 10 minutes)
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

---

### 4. Resend OTP

**Request:**
```http
POST http://localhost:3000/api/users/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP has been sent to your email"
}
```

**Error Cases:**
```json
// User not found
{
  "success": false,
  "error": "User not found"
}

// Already verified
{
  "success": false,
  "error": "Email is already verified"
}
```

---

### 5. Login User

**Request:**
```http
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "676a1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "customer",
    "isVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ IMPORTANT:** Save the `token` - you'll need it for protected routes!

**Error Cases:**
```json
// Invalid credentials (wrong email or password)
{
  "success": false,
  "error": "Invalid credentials"
}

// Missing fields
{
  "success": false,
  "error": "Please provide email and password"
}
```

---

### 6. Forgot Password

**Request:**
```http
POST http://localhost:3000/api/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email"
}
```

**What Happens:**
1. ✅ Reset token generated
2. ✅ Email sent with reset link
3. ✅ Link format: `http://localhost:8081/reset-password?token=abc123...`

**Check Your Email:**
Click the link to reset password (or copy the token).

---

### 7. Reset Password

**Request:**
```http
POST http://localhost:3000/api/users/reset-password/YOUR_RESET_TOKEN_HERE
Content-Type: application/json

{
  "password": "newpassword123"
}
```

**Example:**
```http
POST http://localhost:3000/api/users/reset-password/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Content-Type: application/json

{
  "password": "newpassword123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**What Happens:**
1. ✅ Token verified
2. ✅ Password updated and hashed
3. ✅ Confirmation email sent

**Error Cases:**
```json
// Invalid or expired token
{
  "success": false,
  "error": "Invalid or expired reset token"
}
```

---

## 🔐 PROTECTED ROUTES (Authentication Required)

### How to Use Protected Routes

Add this header to all protected route requests:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```http
GET http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 8. Get User Profile

**Request:**
```http
GET http://localhost:3000/api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "676a1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "customer",
    "isVerified": true,
    "createdAt": "2025-12-18T10:30:00.000Z"
  }
}
```

**Error Cases:**
```json
// No token provided
{
  "success": false,
  "error": "Not authorized. Please login."
}

// Invalid token
{
  "success": false,
  "error": "Invalid or expired token. Please login again."
}

// User deleted after token was issued
{
  "success": false,
  "error": "User not found. Please login again."
}
```

---

### 9. Update User Profile

**Request:**
```http
PUT http://localhost:3000/api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "676a1234567890abcdef1234",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer",
    "isVerified": true
  }
}
```

**Notes:**
- Can update `name` and/or `phone`
- Cannot update `email` or `password` (use separate routes)

---

### 10. Change Password (Logged In)

**Request:**
```http
PUT http://localhost:3000/api/users/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**What Happens:**
1. ✅ Current password verified
2. ✅ New password hashed and saved
3. ✅ Confirmation email sent

**Error Cases:**
```json
// Wrong current password
{
  "success": false,
  "error": "Current password is incorrect"
}
```

---

## 🔄 Complete User Flow (Step by Step)

### Scenario: New User Registration to Booking

**Step 1: Register**
```http
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "jane123",
  "phone": "5551234567"
}
```

**Response:** Save the `token`

---

**Step 2: Check Email & Get OTP**
Check email inbox for 6-digit code (e.g., `456789`)

---

**Step 3: Verify Email**
```http
POST http://localhost:3000/api/users/verify-email
Content-Type: application/json

{
  "email": "jane@example.com",
  "otp": "456789"
}
```

**Response:** Account now verified! ✅

---

**Step 4: Login (If needed later)**
```http
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "jane123"
}
```

**Response:** Get fresh `token`

---

**Step 5: Get Profile**
```http
GET http://localhost:3000/api/users/profile
Authorization: Bearer YOUR_TOKEN
```

**Response:** View user details

---

**Step 6: Update Profile**
```http
PUT http://localhost:3000/api/users/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "5559876543"
}
```

**Response:** Profile updated! ✅

---

## 🛠️ Testing Tools

### Option 1: VS Code Extension - Thunder Client

1. Install Thunder Client extension
2. Create new request
3. Set method (GET, POST, PUT, etc.)
4. Set URL
5. Add headers (Authorization, Content-Type)
6. Add body (for POST/PUT)
7. Click "Send"

---

### Option 2: Postman

1. Download Postman
2. Import collection or create requests manually
3. Set up environment variables for token
4. Test all endpoints

---

### Option 3: cURL (Command Line)

**Register:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Troubleshooting

### Issue: "Service unavailable"
**Solution:** Check if User Service is running on port 3001

### Issue: "Cannot connect to database"
**Solution:** Make sure MongoDB is running (`mongod`)

### Issue: "Invalid token"
**Solution:** Token expired (7 days). Login again to get new token

### Issue: "Email not sent"
**Solution:** Check `.env` email configuration (EMAIL_USER, EMAIL_PASSWORD)

### Issue: "Route not found"
**Solution:** Make sure you're using `/api/users/...` not just `/users/...`

---

## 📊 Expected Status Codes

| Status | Meaning | When |
|--------|---------|------|
| 200 | OK | Success (GET, PUT) |
| 201 | Created | Success (POST - new resource) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Valid token but no permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Something went wrong on server |

---

## ✅ Quick Test Checklist

- [ ] API Gateway running on port 3000
- [ ] User Service running on port 3001
- [ ] MongoDB running
- [ ] Email configured in `.env`
- [ ] Register new user
- [ ] Receive welcome email with OTP
- [ ] Verify email with OTP
- [ ] Login and get token
- [ ] Get profile with token
- [ ] Update profile
- [ ] Test forgot password
- [ ] Reset password via email link
- [ ] Change password while logged in

---

## 🎯 Next Steps

After testing User Service:
1. ✅ Build Barber Service (Port 3002)
2. ✅ Build Booking Service (Port 3003)
3. ✅ Build Notification Service (Port 3004)
4. ✅ Build Payment Service (Port 3005)
5. ✅ Connect frontend to API Gateway

---

**Happy Testing! 🚀**
