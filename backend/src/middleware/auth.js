/**
 * Authentication middleware
 * Verifies if the user is logged in via session
 */
const db = require('../db/connection');

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAuthenticated = (req, res, next) => {
  // Check if user is authenticated via session
  if (req.session && req.session.user) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Please log in.'
  });
};

/**
 * Middleware to check if user has specific role
 * @param {Array|String} roles - Role(s) allowed to access the route
 * @returns {Function} Middleware function
 */
const hasRole = (roles) => {
  // Convert single role to array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    // First check if user is authenticated
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please log in.'
      });
    }
    
    // Check if user has required role
    const userRole = req.session.user.role;
    
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Forbidden. You do not have permission to access this resource.'
    });
  };
};

// Role constants
const ROLES = {
  SUPERADMIN: 1,
  VIEWER: 2
};

module.exports = {
  isAuthenticated,
  hasRole,
  ROLES
};