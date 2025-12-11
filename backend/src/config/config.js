/**
 * Configuration module for the application
 * Loads environment variables from .env file
 */
require('dotenv').config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

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
  
  // Session store configuration
  getSessionStore: () => {
    const sessionStoreOptions = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
      clearExpired: true,
      checkExpirationInterval: 900000, // 15 minutes
      expiration: 86400000, // 1 day
      createDatabaseTable: true, // Automatically create sessions table
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }
    };
    return new MySQLStore(sessionStoreOptions);
  },
  
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    name: 'sibakti.sid', // Custom session name
    cookie: {
      secure: true, // Required for sameSite: 'none'
      sameSite: 'none', // Required for cross-origin cookies
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/' // Ensure cookie is sent for all paths
    }
  },
  
  // File upload configuration
  upload: {
    path: process.env.UPLOAD_PATH || './src/uploads'
  }
};

module.exports = config;