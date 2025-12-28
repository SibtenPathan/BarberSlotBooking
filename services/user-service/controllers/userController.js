// ═══════════════════════════════════════════════════════════
// USER CONTROLLER
// Purpose: Handle all user-related business logic
// ═══════════════════════════════════════════════════════════

import crypto from 'crypto';
import User from '../models/User.js';
import {
    sendOTPEmail,
    sendPasswordResetConfirmation,
    sendPasswordResetEmail,
    sendWelcomeEmail
} from '../utils/emailService.js';
import { generateToken } from '../utils/jwt.js';

// ═══════════════════════════════════════════════════════════
// REGISTER USER
// ═══════════════════════════════════════════════════════════

export const register = async (req, res) => {
  // What: Register new user
  // When: POST /users/register
  // Body: { name, email, password, phone }
  
  try {
    const { name, email, password, phone, role } = req.body;
    
    // Step 1: Check if user already exists
    const existingUser = await User.findOne({ email });
    // What: Search for user with this email
    // Why: Emails must be unique
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User with this email already exists' 
      });
    }
    
    // Step 2: Create new user (password will be auto-hashed by mongoose middleware)
    const user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'customer'
      // What: Create user object
      // Note: Password is hashed automatically by pre('save') middleware
    });
    
    // Step 3: Generate OTP for email verification
    const otp = user.generateEmailVerificationOTP();
    // What: Generate 6-digit OTP
    // Returns: Plain OTP (e.g., "123456")
    // Also saves hashed OTP and expiry to user object
    
    // Step 4: Save user to database
    await user.save();
    // What: Save user to MongoDB
    // When this runs, password gets hashed by pre('save') middleware
    
    // Step 5: Send welcome email with OTP
    try {
      await sendWelcomeEmail(user, otp);
      console.log(`📧 Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Note: We don't fail registration if email fails
      // User can request OTP resend later
    }
    
    // Step 6: Generate JWT token
    const token = generateToken(user._id);
    // What: Create JWT token for this user
    // Why: User can start using app immediately (but some features locked until verified)
    
    // Step 7: Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// VERIFY EMAIL WITH OTP
// ═══════════════════════════════════════════════════════════

export const verifyEmail = async (req, res) => {
  // What: Verify user's email using OTP
  // When: POST /users/verify-email
  // Body: { email, otp }
  
  try {
    const { email, otp } = req.body;
    
    // Step 1: Hash the provided OTP
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    // What: Hash OTP to compare with stored hash
    // Why: We stored hashed OTP, so we need to hash input to compare
    
    // Step 2: Find user with matching email, OTP, and unexpired OTP
    const user = await User.findOne({
      email,
      emailVerificationOTP: hashedOTP,
      emailVerificationOTPExpire: { $gt: Date.now() }
      // $gt: Greater than (OTP not expired yet)
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }
    
    // Step 3: Mark user as verified
    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpire = undefined;
    // What: Clear OTP fields (no longer needed)
    // Why: User is verified, OTP should not be reusable
    
    await user.save();
    
    // Step 4: Return success
    res.json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// RESEND OTP
// ═══════════════════════════════════════════════════════════

export const resendOTP = async (req, res) => {
  // What: Resend OTP to user's email
  // When: POST /users/resend-otp
  // Body: { email }
  
  try {
    const { email } = req.body;
    
    // Step 1: Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Step 2: Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }
    
    // Step 3: Generate new OTP
    const otp = user.generateEmailVerificationOTP();
    await user.save();
    
    // Step 4: Send OTP email
    try {
      await sendOTPEmail(user, otp);
      console.log(`📧 OTP resent to ${email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again.'
      });
    }
    
    // Step 5: Return success
    res.json({
      success: true,
      message: 'OTP has been sent to your email'
    });
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// LOGIN USER
// ═══════════════════════════════════════════════════════════

export const login = async (req, res) => {
  // What: Authenticate user and return token
  // When: POST /users/login
  // Body: { email, password }
  
  try {
    const { email, password } = req.body;
    
    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Step 2: Find user and include password (normally excluded)
    const user = await User.findOne({ email }).select('+password');
    // What: Find user by email
    // .select('+password'): Include password field (normally hidden)
    // Why: We need password to verify login
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      // Note: Don't say "user not found" - security best practice
      // Hacker shouldn't know if email exists
    }
    
    // Step 3: Verify password
    const isPasswordMatch = await user.comparePassword(password);
    // What: Compare entered password with hashed password
    // Returns: true if match, false if not
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Step 4: Generate token
    const token = generateToken(user._id);
    
    // Step 5: Return success with token
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// GET USER PROFILE
// ═══════════════════════════════════════════════════════════

export const getProfile = async (req, res) => {
  // What: Get current user's profile
  // When: GET /users/profile
  // Headers: Authorization: Bearer <token>
  
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// UPDATE USER PROFILE
// ═══════════════════════════════════════════════════════════

export const updateProfile = async (req, res) => {
  // What: Update user profile
  // When: PUT /users/profile
  // Body: { name, phone }
  
  try {
    const { name, phone } = req.body;
    
    // Create update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { 
        new: true,           // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════════════════════

export const forgotPassword = async (req, res) => {
  // What: Send password reset email
  // When: POST /users/forgot-password
  // Body: { email }
  
  try {
    const { email } = req.body;
    
    // Step 1: Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      // Security: Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }
    
    // Step 2: Generate reset token
    const resetToken = user.generateResetPasswordToken();
    // What: Generate random token
    // Also saves hashed token and expiry to user
    
    await user.save();
    
    // Step 3: Send reset email
    try {
      await sendPasswordResetEmail(user, resetToken);
      console.log(`📧 Password reset email sent to ${email}`);
    } catch (emailError) {
      // If email fails, remove reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      return res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again.'
      });
    }
    
    // Step 4: Return success
    res.json({
      success: true,
      message: 'Password reset link has been sent to your email'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// RESET PASSWORD
// ═══════════════════════════════════════════════════════════

export const resetPassword = async (req, res) => {
  // What: Reset password using token
  // When: POST /users/reset-password/:token
  // Body: { password }
  
  try {
    const { password } = req.body;
    const { token } = req.params;
    
    // Step 1: Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Step 2: Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
      // Token must not be expired
    }).select('+password');
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }
    
    // Step 3: Set new password
    user.password = password;
    // Will be auto-hashed by pre('save') middleware
    
    // Step 4: Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    // Step 5: Send confirmation email
    try {
      await sendPasswordResetConfirmation(user);
      console.log(`📧 Password reset confirmation sent to ${user.email}`);
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError.message);
      // Don't fail the request if email fails
    }
    
    // Step 6: Return success
    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════
// CHANGE PASSWORD (For logged-in users)
// ═══════════════════════════════════════════════════════════

export const changePassword = async (req, res) => {
  // What: Change password (when user is logged in)
  // When: PUT /users/change-password
  // Body: { currentPassword, newPassword }
  
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Step 1: Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Step 2: Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Step 3: Set new password
    user.password = newPassword;
    await user.save();
    
    // Step 4: Send confirmation email
    try {
      await sendPasswordResetConfirmation(user);
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError.message);
    }
    
    // Step 5: Return success
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
