import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance for file operations
const fileApi = axios.create({
  baseURL: `${BASE_URL}/files`,
  withCredentials: true, // Important for session-based auth
});

/**
 * Get authenticated file URL (direct URL to protected endpoint)
 * @param {string} filePath - Original file path from database
 * @returns {string} - Protected file URL
 */
export const getAuthenticatedFileUrl = (filePath) => {
  if (!filePath) return null;
  
  let relativePath = filePath;
  
  // Check if filePath is already a full URL
  if (filePath.startsWith('http')) {
    const url = new URL(filePath);
    relativePath = url.pathname.substring(1); // Remove leading slash
  }
  
  // Normalize path separators (replace backslashes with forward slashes)
  relativePath = relativePath.replace(/\\/g, '/');
  
  const pathParts = relativePath.split('/');
  if (pathParts.length < 3) return null;
  
  const folder = pathParts[1]; // asset, ba, sprindik
  const filename = pathParts[pathParts.length - 1]; // Get last part as filename
  
  // Return direct URL to protected endpoint
  return `${BASE_URL}/files/${folder}/${filename}`;
};

/**
 * Check if file exists (HEAD request)
 * @param {string} filePath - File path
 * @returns {Promise<boolean>} - Whether file exists
 */
export const checkFileExists = async (filePath) => {
  try {
    if (!filePath) return false;
    
    let relativePath = filePath;
    
    // Check if filePath is already a full URL
    if (filePath.startsWith('http')) {
      const url = new URL(filePath);
      relativePath = url.pathname.substring(1); // Remove leading slash
    }
    
    // Normalize path separators
    relativePath = relativePath.replace(/\\/g, '/');
    
    const pathParts = relativePath.split('/');
    if (pathParts.length < 3) return false;
    
    const folder = pathParts[1];
    const filename = pathParts[pathParts.length - 1];
    
    await fileApi.head(`/${folder}/${filename}`);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Download file (GET request)
 * @param {string} filePath - File path
 * @returns {Promise<Blob>} - File blob
 */
export const downloadFile = async (filePath) => {
  try {
    if (!filePath) throw new Error('File path is required');
    
    let relativePath = filePath;
    
    // Check if filePath is already a full URL
    if (filePath.startsWith('http')) {
      const url = new URL(filePath);
      relativePath = url.pathname.substring(1); // Remove leading slash
    }
    
    // Normalize path separators
    relativePath = relativePath.replace(/\\/g, '/');
    
    const pathParts = relativePath.split('/');
    if (pathParts.length < 3) throw new Error('Invalid file path format');
    
    const folder = pathParts[1];
    const filename = pathParts[pathParts.length - 1];
    
    const response = await fileApi.get(`/${folder}/${filename}`, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export default fileApi;
