// ═══════════════════════════════════════════════════════════
// API GATEWAY ROUTES
// Purpose: Route requests to appropriate microservices
// ═══════════════════════════════════════════════════════════

import axios from 'axios';
import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Service URLs from environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

// ═══════════════════════════════════════════════════════════
// USER SERVICE ROUTES
// ═══════════════════════════════════════════════════════════

// PUBLIC ROUTES (No authentication)
const publicUserRoutes = [
  '/users/register',
  '/users/login',
  '/users/verify-email',
  '/users/resend-otp',
  '/users/forgot-password'
];

// Route handler for public user routes
publicUserRoutes.forEach(route => {
  router.all(route, async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${USER_SERVICE_URL}${route}`,
        data: req.body,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      res.status(response.status).json(response.data);
      
    } catch (error) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { 
        success: false,
        error: 'Service unavailable' 
      };
      
      res.status(status).json(data);
    }
  });
});

// Password reset with token parameter
router.post('/users/reset-password/:token', async (req, res) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${USER_SERVICE_URL}/users/reset-password/${req.params.token}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.status(response.status).json(response.data);
    
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { 
      success: false,
      error: 'Service unavailable' 
    };
    
    res.status(status).json(data);
  }
});

// PROTECTED ROUTES (Authentication required)
const protectedUserRoutes = [
  '/users/profile',
  '/users/change-password'
];

protectedUserRoutes.forEach(route => {
  router.all(route, verifyToken, async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${USER_SERVICE_URL}${route}`,
        data: req.body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization
        }
      });
      
      res.status(response.status).json(response.data);
      
    } catch (error) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { 
        success: false,
        error: 'Service unavailable' 
      };
      
      res.status(status).json(data);
    }
  });
});

// Catch-all for other user routes
router.use('/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${USER_SERVICE_URL}${req.originalUrl.replace('/api', '')}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      }
    });
    
    res.status(response.status).json(response.data);
    
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { 
      success: false,
      error: 'Service unavailable' 
    };
    
    res.status(status).json(data);
  }
});

export default router;
