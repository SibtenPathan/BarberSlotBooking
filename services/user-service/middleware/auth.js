// ═══════════════════════════════════════════════════════════
// AUTHENTICATION MIDDLEWARE
// Purpose: Verify JWT token and protect routes
// ═══════════════════════════════════════════════════════════

import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export const protect = async (req, res, next) => {
  // What: Middleware to protect routes (require authentication)
  // When: Used on routes that need authentication
  // How: Checks if valid JWT token is present
  
  try {
    let token;
    
    // Step 1: Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // What: Get token from header
      // Format: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      
      token = req.headers.authorization.split(' ')[1];
      // What: Split "Bearer token" and get the token part
      // Example: "Bearer abc123" → ["Bearer", "abc123"] → "abc123"
    }
    
    // Step 2: Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized. Please login.'
      });
      // 401 = Unauthorized (not logged in)
    }
    
    // Step 3: Verify token
    const decoded = verifyToken(token);
    // What: Verify token is valid and not expired
    // Returns: { id: "userId", iat: timestamp, exp: timestamp }
    // Throws error if invalid/expired
    
    // Step 4: Get user from database
    const user = await User.findById(decoded.id);
    // What: Fetch user details using ID from token
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found. Please login again.'
      });
      // User might have been deleted after token was issued
    }
    
    // Step 5: Attach user to request object
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    // What: Make user info available to next middleware/route handler
    // Why: Routes can access req.user to know who is making the request
    
    // Step 6: Continue to next middleware/route handler
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please login again.'
    });
  }
};

// ═══════════════════════════════════════════════════════════
// ROLE-BASED ACCESS CONTROL
// ═══════════════════════════════════════════════════════════

export const authorize = (...roles) => {
  // What: Middleware to restrict access by user role
  // When: Used on routes that only certain roles can access
  // Example: authorize('admin', 'barber')
  
  return (req, res, next) => {
    // What: Return middleware function
    // Why: Allows us to pass parameters to middleware
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Please login first'
      });
    }
    
    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. This action requires ${roles.join(' or ')} role.`
      });
      // 403 = Forbidden (logged in but not allowed)
    }
    
    next();
  };
};

// ═══════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════

// Example 1: Protect route (any logged-in user)
// router.get('/profile', protect, getProfile);

// Example 2: Protect + authorize (only admin)
// router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Example 3: Protect + authorize (admin or barber)
// router.get('/bookings', protect, authorize('admin', 'barber'), getBookings);
