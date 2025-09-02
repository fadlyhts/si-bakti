/**
 * Sprindik (Surat Perintah Penyidikan) service module
 * Handles database operations for Sprindik
 */
const db = require('../db/connection');
const fileHandler = require('../utils/fileHandler');
const config = require('../config/config');

/**
 * Get all Sprindiks
 * @returns {Promise<Array>} Array of Sprindiks
 */
const getAllSprindiks = async () => {
  const sql = `
    SELECT s.*, l.nama as lp_nama 
    FROM sprindik s
    LEFT JOIN lp l ON s.lp_id = l.id
  `;
  const results = await db.query(sql);
  
  // Convert file paths to full URLs and rename field
  return results.map(sprindik => ({
    ...sprindik,
    file_path: sprindik.file_pdf_sprindik ? `${config.server.baseUrl}/uploads/${sprindik.file_pdf_sprindik}` : null
  }));
};

/**
 * Get Sprindik by ID
 * @param {number} id - Sprindik ID
 * @returns {Promise<Object|null>} Sprindik object or null if not found
 */
const getSprindikById = async (id) => {
  const sql = `
    SELECT s.*, l.nama as lp_nama 
    FROM sprindik s
    LEFT JOIN lp l ON s.lp_id = l.id
    WHERE s.id = ?
  `;
  const result = await db.getOne(sql, [id]);
  
  if (result) {
    // Convert file path to full URL and rename field
    return {
      ...result,
      file_path: result.file_pdf_sprindik ? `${config.server.baseUrl}/uploads/${result.file_pdf_sprindik}` : null
    };
  }
  
  return null;
};

/**
 * Get Sprindiks by LP ID
 * @param {number} lpId - LP ID
 * @returns {Promise<Array>} Array of Sprindiks
 */
const getSprindiksByLpId = async (lpId) => {
  const sql = `
    SELECT s.*, l.nama as lp_nama 
    FROM sprindik s
    LEFT JOIN lp l ON s.lp_id = l.id
    WHERE s.lp_id = ?
  `;
  const results = await db.query(sql, [lpId]);
  
  // Convert file paths to full URLs and rename field
  return results.map(sprindik => ({
    ...sprindik,
    file_path: sprindik.file_pdf_sprindik ? `${config.server.baseUrl}/uploads/${sprindik.file_pdf_sprindik}` : null
  }));
};

/**
 * Create a new Sprindik
 * @param {Object} sprindikData - Sprindik data
 * @param {string} sprindikData.judul_sprindik - Sprindik title
 * @param {string} sprindikData.deskripsi - Sprindik description
 * @param {number} sprindikData.lp_id - LP ID
 * @param {Object} [file] - Uploaded file
 * @returns {Promise<number>} ID of the created Sprindik
 */
const createSprindik = async (sprindikData, file) => {
  let filePath = null;
  
  // Handle file upload if provided
  if (file) {
    // Get relative path from the uploads directory
    filePath = fileHandler.getRelativePath(file.path);
  }
  
  const data = {
    judul_sprindik: sprindikData.judul_sprindik,
    deskripsi: sprindikData.deskripsi,
    file_pdf_sprindik: filePath,
    lp_id: sprindikData.lp_id
  };
  
  return await db.insert('sprindik', data);
};

/**
 * Update a Sprindik
 * @param {number} id - Sprindik ID
 * @param {Object} sprindikData - Sprindik data to update
 * @param {Object} [file] - Uploaded file
 * @returns {Promise<Object>} Update result
 */
const updateSprindik = async (id, sprindikData, file) => {
  // Get current Sprindik to check if there's an existing file
  const currentSprindik = await getSprindikById(id);
  
  if (!currentSprindik) {
    throw new Error('Sprindik not found');
  }
  
  const data = {};
  
  // Only include fields that are provided
  if (sprindikData.judul_sprindik) {
    data.judul_sprindik = sprindikData.judul_sprindik;
  }
  
  if (sprindikData.deskripsi) {
    data.deskripsi = sprindikData.deskripsi;
  }
  
  if (sprindikData.lp_id) {
    data.lp_id = sprindikData.lp_id;
  }
  
  // Handle file upload if provided
  if (file) {
    // Delete old file if exists
    if (currentSprindik.file_pdf_sprindik) {
      await fileHandler.deleteFile(currentSprindik.file_pdf_sprindik);
    }
    
    // Get relative path from the uploads directory
    data.file_pdf_sprindik = fileHandler.getRelativePath(file.path);
  }
  
  return await db.update('sprindik', data, 'id = ?', [id]);
};

/**
 * Delete a Sprindik
 * @param {number} id - Sprindik ID
 * @returns {Promise<Object>} Delete result
 */
const deleteSprindik = async (id) => {
  // Get current Sprindik to check if there's an existing file
  const currentSprindik = await getSprindikById(id);
  
  if (!currentSprindik) {
    throw new Error('Sprindik not found');
  }
  
  // Delete file if exists
  if (currentSprindik.file_pdf_sprindik) {
    await fileHandler.deleteFile(currentSprindik.file_pdf_sprindik);
  }
  
  return await db.remove('sprindik', 'id = ?', [id]);
};

module.exports = {
  getAllSprindiks,
  getSprindikById,
  getSprindiksByLpId,
  createSprindik,
  updateSprindik,
  deleteSprindik
};