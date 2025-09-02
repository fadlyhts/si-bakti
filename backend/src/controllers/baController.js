/**
 * BA (Berita Acara) controller module
 * Handles HTTP requests for BA operations
 */
const baService = require('../services/baService');
const sprindikService = require('../services/sprindikService');
const fileHandler = require('../utils/fileHandler');

/**
 * Get all BAs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAllBAs = async (req, res, next) => {
  try {
    const bas = await baService.getAllBAs();
    
    res.json({
      success: true,
      data: bas
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get BA by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getBAById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const ba = await baService.getBAById(id);
    
    if (!ba) {
      return res.status(404).json({
        success: false,
        message: 'BA tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: ba
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get BAs by Sprindik ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getBAsBySprindikId = async (req, res, next) => {
  try {
    const { sprindikId } = req.params;
    
    // Check if Sprindik exists
    const sprindik = await sprindikService.getSprindikById(sprindikId);
    
    if (!sprindik) {
      return res.status(404).json({
        success: false,
        message: 'Sprindik tidak ditemukan'
      });
    }
    
    const bas = await baService.getBAsBySprindikId(sprindikId);
    
    res.json({
      success: true,
      data: bas
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new BA
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createBA = async (req, res, next) => {
  try {
    const { judul_ba, deskripsi, sprindik_id } = req.body;
    const file = req.file;
    
    // Validate input
    if (!judul_ba) {
      return res.status(400).json({
        success: false,
        message: 'Judul BA wajib diisi'
      });
    }
    
    if (sprindik_id) {
      // Check if Sprindik exists
      const sprindik = await sprindikService.getSprindikById(sprindik_id);
      
      if (!sprindik) {
        return res.status(404).json({
          success: false,
          message: 'Sprindik tidak ditemukan'
        });
      }
    }
    
    // Create BA
    const baId = await baService.createBA(
      { judul_ba, deskripsi, sprindik_id },
      file
    );
    
    res.status(201).json({
      success: true,
      message: 'BA berhasil dibuat',
      data: { 
        id: baId, 
        judul_ba, 
        deskripsi, 
        sprindik_id,
        file_pdf_ba: file ? fileHandler.getRelativePath(file.path) : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a BA
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateBA = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { judul_ba, deskripsi, sprindik_id } = req.body;
    const file = req.file;
    
    // Check if BA exists
    const ba = await baService.getBAById(id);
    
    if (!ba) {
      return res.status(404).json({
        success: false,
        message: 'BA tidak ditemukan'
      });
    }
    
    if (sprindik_id) {
      // Check if Sprindik exists
      const sprindik = await sprindikService.getSprindikById(sprindik_id);
      
      if (!sprindik) {
        return res.status(404).json({
          success: false,
          message: 'Sprindik tidak ditemukan'
        });
      }
    }
    
    // Update BA
    await baService.updateBA(
      id,
      { judul_ba, deskripsi, sprindik_id },
      file
    );
    
    res.json({
      success: true,
      message: 'BA berhasil diperbarui'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a BA
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteBA = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if BA exists
    const ba = await baService.getBAById(id);
    
    if (!ba) {
      return res.status(404).json({
        success: false,
        message: 'BA tidak ditemukan'
      });
    }
    
    // Delete BA
    await baService.deleteBA(id);
    
    res.json({
      success: true,
      message: 'BA berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBAs,
  getBAById,
  getBAsBySprindikId,
  createBA,
  updateBA,
  deleteBA
};