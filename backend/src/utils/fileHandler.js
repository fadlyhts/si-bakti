/**
 * File handling utility for PDF uploads
 */

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('../config/config');

// Ensure upload directory exists
const uploadDir = path.resolve(config.upload.path);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different file types
const createSubDirectories = () => {
  const directories = ['sprindik', 'ba', 'asset'];
  
  directories.forEach(dir => {
    const dirPath = path.join(uploadDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// Call this function to create subdirectories
createSubDirectories();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the destination folder based on the route
    let folder = 'other';
    
    if (req.originalUrl.includes('/sprindik')) {
      folder = 'sprindik';
    } else if (req.originalUrl.includes('/ba')) {
      folder = 'ba';
    } else if (req.originalUrl.includes('/asset')) {
      folder = 'asset';
    }
    
    const destination = path.join(uploadDir, folder);
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const filename = `${path.basename(originalName, extension)}_${timestamp}${extension}`;
    
    cb(null, filename);
  }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * Delete a file from the uploads directory
 * @param {string} filePath - Path to the file relative to the uploads directory
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
const deleteFile = async (filePath) => {
  try {
    if (!filePath) return true; // No file to delete
    
    const fullPath = path.join(uploadDir, filePath);
    
    // Check if file exists
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error.message);
    return false;
  }
};

/**
 * Get the relative path of a file from the absolute path
 * @param {string} absolutePath - Absolute path of the file
 * @returns {string} - Relative path from the uploads directory
 */
const getRelativePath = (absolutePath) => {
  return path.relative(uploadDir, absolutePath);
};

module.exports = {
  upload,
  deleteFile,
  getRelativePath,
  uploadDir
};