/**
 * Configuration module for the application
 * Loads environment variables from .env file
 */
require('dotenv').config();

const config = {
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || '',
    port: parseInt(process.env.DB_PORT || '3306', 10)
  },
  
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:5000'
  },
  
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  },
  
  // File upload configuration
  upload: {
    path: process.env.UPLOAD_PATH || './src/uploads'
  }
};

module.exports = config;