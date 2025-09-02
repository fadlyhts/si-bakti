/**
 * File routes for serving uploads with authentication
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const { isAuthenticated, hasRole, ROLES } = require('../middleware/auth');

const router = express.Router();

/**
 * Serve files from uploads directory with authentication
 * Only authenticated users (admin and viewer) can access files
 */
router.get('/:folder/:filename', isAuthenticated, hasRole([ROLES.SUPERADMIN, ROLES.VIEWER]), (req, res) => {
  try {
    const { folder, filename } = req.params;
    
    // Validate folder parameter to prevent directory traversal
    const allowedFolders = ['asset', 'ba', 'sprindik'];
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder specified'
      });
    }
    
    // Construct file path
    const filePath = path.join(__dirname, '..', 'uploads', folder, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Security check: ensure file is within uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Get file stats for content length
    const stats = fs.statSync(filePath);
    
    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    }
    
    res.set({
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff'
    });
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error reading file'
        });
      }
    });
    
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get file info (for checking if file exists without downloading)
 */
router.head('/:folder/:filename', isAuthenticated, hasRole([ROLES.SUPERADMIN, ROLES.VIEWER]), (req, res) => {
  try {
    const { folder, filename } = req.params;
    
    // Validate folder parameter
    const allowedFolders = ['asset', 'ba', 'sprindik'];
    if (!allowedFolders.includes(folder)) {
      return res.status(400).end();
    }
    
    // Construct file path
    const filePath = path.join(__dirname, '..', 'uploads', folder, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).end();
    }
    
    // Security check
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return res.status(403).end();
    }
    
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    }
    
    res.set({
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Last-Modified': stats.mtime.toUTCString()
    });
    
    res.status(200).end();
    
  } catch (error) {
    console.error('Error checking file:', error);
    res.status(500).end();
  }
});

module.exports = router;
