// ═══════════════════════════════════════════════════════════
// USER ROUTES
// Purpose: Define API endpoints for user operations
// ═══════════════════════════════════════════════════════════

import express from 'express';
import {
    changePassword,
    forgotPassword,
    getProfile,
    login,
    register,
    resendOTP,
    resetPassword,
    updateProfile,
    verifyEmail
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// PUBLIC ROUTES (No authentication required)
// ═══════════════════════════════════════════════════════════

// Register new user
router.post('/register', register);
// What: Create new user account
// Method: POST
// URL: /users/register
// Body: { name, email, password, phone, role? }
// Response: { success, message, user, token }

// Verify email with OTP
router.post('/verify-email', verifyEmail);
// What: Verify user's email using OTP
// Method: POST
// URL: /users/verify-email
// Body: { email, otp }
// Response: { success, message, user }

// Resend OTP
router.post('/resend-otp', resendOTP);
// What: Resend verification OTP
// Method: POST
// URL: /users/resend-otp
// Body: { email }
// Response: { success, message }

// Login user
router.post('/login', login);
// What: Authenticate user and get token
// Method: POST
// URL: /users/login
// Body: { email, password }
// Response: { success, message, user, token }

// Forgot password
router.post('/forgot-password', forgotPassword);
// What: Send password reset email
// Method: POST
// URL: /users/forgot-password
// Body: { email }
// Response: { success, message }

// Reset password
router.post('/reset-password/:token', resetPassword);
// What: Reset password using token from email
// Method: POST
// URL: /users/reset-password/:token
// Params: token (from email link)
// Body: { password }
// Response: { success, message }

// ═══════════════════════════════════════════════════════════
// PROTECTED ROUTES (Authentication required)
// ═══════════════════════════════════════════════════════════

// Get user profile
router.get('/profile', protect, getProfile);
// What: Get current user's profile
// Method: GET
// URL: /users/profile
// Headers: Authorization: Bearer <token>
// Response: { success, user }

// Update user profile
router.put('/profile', protect, updateProfile);
// What: Update current user's profile
// Method: PUT
// URL: /users/profile
// Headers: Authorization: Bearer <token>
// Body: { name?, phone? }
// Response: { success, message, user }

// Change password
router.put('/change-password', protect, changePassword);
// What: Change password (for logged-in users)
// Method: PUT
// URL: /users/change-password
// Headers: Authorization: Bearer <token>
// Body: { currentPassword, newPassword }
// Response: { success, message }

// ═══════════════════════════════════════════════════════════
// ROUTE SUMMARY
// ═══════════════════════════════════════════════════════════

/*
PUBLIC ROUTES:
  POST   /users/register           - Register new user
  POST   /users/verify-email       - Verify email with OTP
  POST   /users/resend-otp         - Resend OTP
  POST   /users/login              - Login user
  POST   /users/forgot-password    - Request password reset
  POST   /users/reset-password/:token - Reset password

PROTECTED ROUTES:
  GET    /users/profile            - Get profile
  PUT    /users/profile            - Update profile
  PUT    /users/change-password    - Change password
*/

export default router;
