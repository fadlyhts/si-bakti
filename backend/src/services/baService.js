/**
 * BA (Berita Acara) service module  if (result) {
    // Conve  const results = await db.query(sql, [sprindikId]);
  
  // Convert file paths to full URLs and rename field
  return results.map(ba => ({
    ...ba,
    file_path: ba.file_pdf_ba ? `${config.server.baseUrl}/uploads/${ba.file_pdf_ba}` : null
  })); path to full URL and rename field
    return {
      ...result,
      file_path: result.file_pdf_ba ? `${config.server.baseUrl}/uploads/${result.file_pdf_ba}` : null
    };
  }dles database operations for BA
 */
const db = require('../db/connection');
const fileHandler = require('../utils/fileHandler');
const config = require('../config/config');

/**
 * Get all BAs
 * @returns {Promise<Array>} Array of BAs
 */
const getAllBAs = async () => {
  const sql = `
    SELECT ba.*, s.judul_sprindik as sprindik_judul 
    FROM ba
    LEFT JOIN sprindik s ON ba.sprindik_id = s.id
  `;
  const results = await db.query(sql);
  
  // Convert file paths to full URLs and rename field
  return results.map(ba => ({
    ...ba,
    file_path: ba.file_pdf_ba ? `${config.server.baseUrl}/uploads/${ba.file_pdf_ba}` : null
  }));
};

/**
 * Get BA by ID
 * @param {number} id - BA ID
 * @returns {Promise<Object|null>} BA object or null if not found
 */
const getBAById = async (id) => {
  const sql = `
    SELECT ba.*, s.judul_sprindik as sprindik_judul 
    FROM ba
    LEFT JOIN sprindik s ON ba.sprindik_id = s.id
    WHERE ba.id = ?
  `;
  const result = await db.getOne(sql, [id]);
  
  if (result) {
    // Convert file path to full URL and rename field
    return {
      ...result,
      file_path: result.file_pdf_ba ? `${config.server.baseUrl}/uploads/${result.file_pdf_ba}` : null
    };
  }
  
  return null;
};

/**
 * Get BAs by Sprindik ID
 * @param {number} sprindikId - Sprindik ID
 * @returns {Promise<Array>} Array of BAs
 */
const getBAsBySprindikId = async (sprindikId) => {
  const sql = `
    SELECT ba.*, s.judul_sprindik as sprindik_judul 
    FROM ba
    LEFT JOIN sprindik s ON ba.sprindik_id = s.id
    WHERE ba.sprindik_id = ?
  `;
  const results = await db.query(sql, [sprindikId]);
  
  // Convert file paths to full URLs and rename field
  return results.map(ba => ({
    ...ba,
    file_path: ba.file_pdf_ba ? `${config.server.baseUrl}/uploads/${ba.file_pdf_ba}` : null
  }));
};

/**
 * Create a new BA
 * @param {Object} baData - BA data
 * @param {string} baData.judul_ba - BA title
 * @param {string} baData.deskripsi - BA description
 * @param {number} baData.sprindik_id - Sprindik ID
 * @param {Object} [file] - Uploaded file
 * @returns {Promise<number>} ID of the created BA
 */
const createBA = async (baData, file) => {
  let filePath = null;
  
  // Handle file upload if provided
  if (file) {
    // Get relative path from the uploads directory
    filePath = fileHandler.getRelativePath(file.path);
  }
  
  const data = {
    judul_ba: baData.judul_ba,
    deskripsi: baData.deskripsi,
    file_pdf_ba: filePath,
    sprindik_id: baData.sprindik_id
  };
  
  return await db.insert('ba', data);
};

/**
 * Update a BA
 * @param {number} id - BA ID
 * @param {Object} baData - BA data to update
 * @param {Object} [file] - Uploaded file
 * @returns {Promise<Object>} Update result
 */
const updateBA = async (id, baData, file) => {
  // Get current BA to check if there's an existing file
  const currentBA = await getBAById(id);
  
  if (!currentBA) {
    throw new Error('BA not found');
  }
  
  const data = {};
  
  // Only include fields that are provided
  if (baData.judul_ba) {
    data.judul_ba = baData.judul_ba;
  }
  
  if (baData.deskripsi) {
    data.deskripsi = baData.deskripsi;
  }
  
  if (baData.sprindik_id) {
    data.sprindik_id = baData.sprindik_id;
  }
  
  // Handle file upload if provided
  if (file) {
    // Delete old file if exists
    if (currentBA.file_pdf_ba) {
      await fileHandler.deleteFile(currentBA.file_pdf_ba);
    }
    
    // Get relative path from the uploads directory
    data.file_pdf_ba = fileHandler.getRelativePath(file.path);
  }
  
  return await db.update('ba', data, 'id = ?', [id]);
};

/**
 * Delete a BA
 * @param {number} id - BA ID
 * @returns {Promise<Object>} Delete result
 */
const deleteBA = async (id) => {
  // Get current BA to check if there's an existing file
  const currentBA = await getBAById(id);
  
  if (!currentBA) {
    throw new Error('BA not found');
  }
  
  // Delete file if exists
  if (currentBA.file_pdf_ba) {
    await fileHandler.deleteFile(currentBA.file_pdf_ba);
  }
  
  return await db.remove('ba', 'id = ?', [id]);
};

module.exports = {
  getAllBAs,
  getBAById,
  getBAsBySprindikId,
  createBA,
  updateBA,
  deleteBA
};