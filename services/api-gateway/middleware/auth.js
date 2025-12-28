// ═══════════════════════════════════════════════════════════
// API GATEWAY MIDDLEWARE - AUTHENTICATION
// Purpose: Verify JWT tokens for protected routes
// ═══════════════════════════════════════════════════════════

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // What: Check if user has valid JWT token
  // Why: Protect routes that require authentication
  
  try {
    const token = req.headers.authorization?.split(' ')[1];
    // What: Extract token from "Bearer <token>" format
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided. Please login.' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // What: Verify token is valid and not expired
    
    // Attach user info to request
    req.user = decoded;
    next();
    
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token. Please login again.' 
    });
  }
};
