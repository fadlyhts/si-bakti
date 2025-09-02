/**
 * Asset controller module
 * Handles HTTP requests for Asset operations
 */
const assetService = require('../services/assetService');
const baService = require('../services/baService');
const fileHandler = require('../utils/fileHandler');

/**
 * Get all Assets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAllAssets = async (req, res, next) => {
  try {
    const assets = await assetService.getAllAssets();
    
    res.json({
      success: true,
      data: assets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Asset by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAssetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const asset = await assetService.getAssetById(id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Aset Tidak Ditemukan!'
      });
    }
    
    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Assets by BA ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAssetsByBaId = async (req, res, next) => {
  try {
    const { baId } = req.params;
    
    // Check if BA exists
    const ba = await baService.getBAById(baId);
    
    if (!ba) {
      return res.status(404).json({
        success: false,
        message: 'BA Tidak Ditemukan!'
      });
    }
    
    const assets = await assetService.getAssetsByBaId(baId);
    
    res.json({
      success: true,
      data: assets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Assets by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAssetsByCategory = async (req, res, next) => {
  try {
    const { kategori } = req.params;
    
    // Validate kategori
    if (kategori !== '1' && kategori !== '2') {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak valid. Harus 1 (bergerak) atau 2 (tidak bergerak)'
      });
    }
    
    const assets = await assetService.getAssetsByCategory(kategori);
    
    res.json({
      success: true,
      data: assets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Asset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createAsset = async (req, res, next) => {
  try {
    const { judul_aset, kategori_asset, deskripsi, ba_id } = req.body;
    const file = req.file;
    
    // Validate input
    if (!judul_aset) {
      return res.status(400).json({
        success: false,
        message: 'Judul Aset wajib diisi'
      });
    }
    
    if (!kategori_asset || (kategori_asset !== '1' && kategori_asset !== '2')) {
      return res.status(400).json({
        success: false,
        message: 'Kategori Aset wajib diisi dan harus 1 (bergerak) atau 2 (tidak bergerak)'
      });
    }
    
    if (ba_id) {
      // Check if BA exists
      const ba = await baService.getBAById(ba_id);
      
      if (!ba) {
        return res.status(404).json({
          success: false,
          message: 'BA tidak ditemukan'
        });
      }
    }
    
    // Create Asset
    const assetId = await assetService.createAsset(
      { judul_aset, kategori_asset, deskripsi, ba_id },
      file
    );
    
    res.status(201).json({
      success: true,
      message: 'Aset berhasil dibuat',
      data: { 
        id: assetId, 
        judul_aset, 
        kategori_asset, 
        deskripsi, 
        ba_id,
        file_pdf_aset: file ? fileHandler.getRelativePath(file.path) : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an Asset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { judul_aset, kategori_asset, deskripsi, ba_id } = req.body;
    const file = req.file;
    
    // Check if Asset exists
    const asset = await assetService.getAssetById(id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Aset tidak ditemukan'
      });
    }
    
    // Validate kategori if provided
    if (kategori_asset && kategori_asset !== '1' && kategori_asset !== '2') {
      return res.status(400).json({
        success: false,
        message: 'Kategori Aset harus 1 (bergerak) atau 2 (tidak bergerak)'
      });
    }
    
    if (ba_id) {
      // Check if BA exists
      const ba = await baService.getBAById(ba_id);
      
      if (!ba) {
        return res.status(404).json({
          success: false,
          message: 'BA tidak ditemukan'
        });
      }
    }
    
    // Update Asset
    await assetService.updateAsset(
      id,
      { judul_aset, kategori_asset, deskripsi, ba_id },
      file
    );
    
    res.json({
      success: true,
      message: 'Aset berhasil diperbarui'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an Asset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if Asset exists
    const asset = await assetService.getAssetById(id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Aset tidak ditemukan'
      });
    }
    
    // Delete Asset
    await assetService.deleteAsset(id);
    
    res.json({
      success: true,
      message: 'Aset berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
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