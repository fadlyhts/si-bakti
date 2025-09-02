/**
 * Main server file for SI BAKTI application
 */
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const config = require('./config/config');
const db = require('./db/connection');

// Import routes
const userRoutes = require('./routes/userRoutes');
const lpRoutes = require('./routes/lpRoutes');
const sprindikRoutes = require('./routes/sprindikRoutes');
const baRoutes = require('./routes/baRoutes');
const assetRoutes = require('./routes/assetRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true // Allow credentials (cookies, authorization headers)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session(config.session));

// Protected file serving route (replaces direct static file access)
app.use('/files', fileRoutes);

// Test database connection
db.testConnection()
  .then(success => {
    if (!success) {
      console.error('Database connection failed. Please check your configuration.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });

// API routes
app.use('/api/users', userRoutes);
app.use('/api/lp', lpRoutes);
app.use('/api/sprindik', sprindikRoutes);
app.use('/api/ba', baRoutes);
app.use('/api/asset', assetRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SI-BAKTI API',
    version: '1.0.0'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: config.server.env === 'development' ? err.stack : {}
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.server.env}`);
});

module.exports = app;