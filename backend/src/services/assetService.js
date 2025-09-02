/**
 * Asset serv  const results = await db.qu  if (result) {
    // Conve  const results = await db.  const results = await db.query(sql, [kategori]);
  
  // Convert file paths to full URLs and rename field
  return results.map(asset => ({
    ...asset,
    file_path: asset.file_pdf_aset ? `${config.server.baseUrl}/uploads/${asset.file_pdf_aset}` : null
  }));ql, [baId]);
  
  // Convert file paths to full URLs and rename field
  return results.map(asset => ({
    ...asset,
    file_path: asset.file_pdf_aset ? `${config.server.baseUrl}/uploads/${asset.file_pdf_aset}` : null
  })); path to full URL and rename field
    return {
      ...result,
      file_path: result.file_pdf_aset ? `${config.server.baseUrl}/uploads/${result.file_pdf_aset}` : null
    };
  });
  
  // Convert file paths to full URLs and rename field
  return results.map(asset => ({
    ...asset,
    file_path: asset.file_pdf_aset ? `${config.server.baseUrl}/uploads/${asset.file_pdf_aset}` : null
  }));ule
 * Handles database operations for Assets
 */
const db = require('../db/connection');
const fileHandler = require('../utils/fileHandler');
const config = require('../config/config');

/**
 * Get all Assets
 * @returns {Promise<Array>} Array of Assets
 */
const getAllAssets = async () => {
  const sql = `
    SELECT a.*, b.judul_ba as ba_judul 
    FROM asset a
    LEFT JOIN ba b ON a.ba_id = b.id
  `;
  const results = await db.query(sql);
  
  // Convert file paths to full URLs and rename field
  return results.map(asset => ({
    ...asset,
    file_path: asset.file_pdf_aset ? `${config.server.baseUrl}/uploads/${asset.file_pdf_aset}` : null
  }));
};

/**
 * Get Asset by ID
 * @param {number} id - Asset ID
 * @returns {Promise<Object|null>} Asset object or null if not found
 */
const getAssetById = async (id) => {
  const sql = `
    SELECT a.*, b.judul_ba as ba_judul 
    FROM asset a
    LEFT JOIN ba b ON a.ba_id = b.id
    WHERE a.id = ?
  `;
  const result = await db.getOne(sql, [id]);
  
  if (result) {
    // Convert file path to full URL and rename field
    return {
      ...result,
      file_path: result.file_pdf_aset ? `${config.server.baseUrl}/uploads/${result.file_pdf_aset}` : null
    };
  }
  
  return null;
};

/**
 * Get Assets by BA ID
 * @param {number} baId - BA ID
 * @returns {Promise<Array>} Array of Assets
 */
const getAssetsByBaId = async (baId) => {
  const sql = `
    SELECT a.*, b.judul_ba as ba_judul 
    FROM asset a
    LEFT JOIN ba b ON a.ba_id = b.id
    WHERE a.ba_id = ?
  `;
  const results = await db.query(sql, [baId]);
  
  // Convert file paths to full URLs and rename field
  return results.map(asset => ({
    ...asset,
    file_path: asset.file_pdf_aset ? `${config.server.baseUrl}/uploads/${asset.file_pdf_aset}` : null
  }));
};

/**
 * Get Assets by category
 * @param {number} kategori - Asset category (1=bergerak, 2=tidak bergerak)
 * @returns {Promise<Array>} Array of Assets
 */
const getAssetsByCategory = async (kategori) => {
  const sql = `
    SELECT a.*, b.judul_ba as ba_judul 
    FROM asset a
    LEFT JOIN ba b ON a.ba_id = b.id
    WHERE a.kategori_asset = ?
  `;
  const results = await db.query(sql, [kategori]);
  
  // Convert file paths to full URLs and rename field
  return results.map(asset => ({
    ...asset,
    file_path: asset.file_pdf_aset ? `${config.server.baseUrl}/uploads/${asset.file_pdf_aset}` : null
  }));
};

/**
 * Create a new Asset
 * @param {Object} assetData - Asset data
 * @param {string} assetData.judul_aset - Asset title
 * @param {number} assetData.kategori_asset - Asset category (1=bergerak, 2=tidak bergerak)
 * @param {string} assetData.deskripsi - Asset description
 * @param {number} assetData.ba_id - BA ID
 * @param {Object} [file] - Uploaded file
 * @returns {Promise<number>} ID of the created Asset
 */
const createAsset = async (assetData, file) => {
  let filePath = null;
  
  // Handle file upload if provided
  if (file) {
    // Get relative path from the uploads directory
    filePath = fileHandler.getRelativePath(file.path);
  }
  
  const data = {
    judul_aset: assetData.judul_aset,
    kategori_asset: assetData.kategori_asset,
    deskripsi: assetData.deskripsi,
    file_pdf_aset: filePath,
    ba_id: assetData.ba_id
  };
  
  return await db.insert('asset', data);
};

/**
 * Update an Asset
 * @param {number} id - Asset ID
 * @param {Object} assetData - Asset data to update
 * @param {Object} [file] - Uploaded file
 * @returns {Promise<Object>} Update result
 */
const updateAsset = async (id, assetData, file) => {
  // Get current Asset to check if there's an existing file
  const currentAsset = await getAssetById(id);
  
  if (!currentAsset) {
    throw new Error('Asset not found');
  }
  
  const data = {};
  
  // Only include fields that are provided
  if (assetData.judul_aset) {
    data.judul_aset = assetData.judul_aset;
  }
  
  if (assetData.kategori_asset) {
    data.kategori_asset = assetData.kategori_asset;
  }
  
  if (assetData.deskripsi) {
    data.deskripsi = assetData.deskripsi;
  }
  
  if (assetData.ba_id) {
    data.ba_id = assetData.ba_id;
  }
  
  // Handle file upload if provided
  if (file) {
    // Delete old file if exists
    if (currentAsset.file_pdf_aset) {
      await fileHandler.deleteFile(currentAsset.file_pdf_aset);
    }
    
    // Get relative path from the uploads directory
    data.file_pdf_aset = fileHandler.getRelativePath(file.path);
  }
  
  return await db.update('asset', data, 'id = ?', [id]);
};

/**
 * Delete an Asset
 * @param {number} id - Asset ID
 * @returns {Promise<Object>} Delete result
 */
const deleteAsset = async (id) => {
  // Get current Asset to check if there's an existing file
  const currentAsset = await getAssetById(id);
  
  if (!currentAsset) {
    throw new Error('Asset not found');
  }
  
  // Delete file if exists
  if (currentAsset.file_pdf_aset) {
    await fileHandler.deleteFile(currentAsset.file_pdf_aset);
  }
  
  return await db.remove('asset', 'id = ?', [id]);
};

module.exports = {
  getAllAssets,
  getAssetById,
  getAssetsByBaId,
  getAssetsByCategory,
  createAsset,
  updateAsset,
  deleteAsset
};