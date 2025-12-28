// ═══════════════════════════════════════════════════════════
// USER SERVICE - MAIN SERVER FILE
// Purpose: Entry point for User Service microservice
// Port: 3001
// ═══════════════════════════════════════════════════════════

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

dotenv.config();
// What: Load environment variables from .env file
// Makes process.env.PORT, process.env.MONGODB_URI, etc. available

// ═══════════════════════════════════════════════════════════
// CREATE EXPRESS APP
// ═══════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3001;

// ═══════════════════════════════════════════════════════════
// CONNECT TO DATABASE
// ═══════════════════════════════════════════════════════════

connectDB();
// What: Connect to MongoDB
// When: As soon as server starts
// Why: Need database connection before handling requests

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════

app.use(cors());
// What: Enable CORS (Cross-Origin Resource Sharing)
// Why: Allow API Gateway (port 3000) to call this service (port 3001)

app.use(express.json());
// What: Parse JSON request bodies
// Why: Convert JSON strings to JavaScript objects in req.body

app.use(express.urlencoded({ extended: true }));
// What: Parse URL-encoded bodies (form data)
// Why: Support form submissions
// extended: true allows rich objects and arrays

// Request logging middleware (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
// What: Log every request
// Example output: "POST /users/register - 2025-12-18T10:30:00.000Z"

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'User Service is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    port: PORT,
    database: 'Connected'
  });
});
// What: Simple endpoint to check if service is running
// Why: Used by API Gateway, monitoring tools, Docker health checks
// URL: http://localhost:3001/health

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'User Service',
    version: '1.0.0',
    description: 'Authentication and user management microservice',
    endpoints: {
      health: '/health',
      register: 'POST /users/register',
      login: 'POST /users/login',
      verifyEmail: 'POST /users/verify-email',
      resendOTP: 'POST /users/resend-otp',
      forgotPassword: 'POST /users/forgot-password',
      resetPassword: 'POST /users/reset-password/:token',
      profile: 'GET /users/profile (protected)',
      updateProfile: 'PUT /users/profile (protected)',
      changePassword: 'PUT /users/change-password (protected)'
    }
  });
});

// User routes
app.use('/users', userRoutes);
// What: Mount user routes at /users path
// Example:
//   POST /users/register
//   POST /users/login
//   GET /users/profile

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'POST /users/register',
      'POST /users/login',
      'POST /users/verify-email',
      'POST /users/resend-otp',
      'POST /users/forgot-password',
      'POST /users/reset-password/:token',
      'GET /users/profile',
      'PUT /users/profile',
      'PUT /users/change-password'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('═══════════════════════════════════════════');
  console.error('ERROR OCCURRED:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('═══════════════════════════════════════════');
  
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════');
  console.log('👥 USER SERVICE STARTED');
  console.log('═══════════════════════════════════════════');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📧 Email Service: ${process.env.EMAIL_SERVICE}`);
  console.log(`🔐 JWT Expiration: ${process.env.JWT_EXPIRE}`);
  console.log('═══════════════════════════════════════════');
  console.log('✅ Ready to accept requests');
  console.log('Press Ctrl+C to stop server');
  console.log('═══════════════════════════════════════════');
  console.log('\n📋 Available Endpoints:');
  console.log('  POST   /users/register          - Register new user');
  console.log('  POST   /users/login             - Login user');
  console.log('  POST   /users/verify-email      - Verify email with OTP');
  console.log('  POST   /users/resend-otp        - Resend OTP');
  console.log('  POST   /users/forgot-password   - Request password reset');
  console.log('  POST   /users/reset-password/:token - Reset password');
  console.log('  GET    /users/profile           - Get profile (protected)');
  console.log('  PUT    /users/profile           - Update profile (protected)');
  console.log('  PUT    /users/change-password   - Change password (protected)');
  console.log('═══════════════════════════════════════════\n');
});

// ═══════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
