/**
 * Sprindik (Surat Perintah Penyidikan) controller module
 * Handles HTTP requests for Sprindik operations
 */
const sprindikService = require('../services/sprindikService');
const lpService = require('../services/lpService');
const fileHandler = require('../utils/fileHandler');

/**
 * Get all Sprindiks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAllSprindiks = async (req, res, next) => {
  try {
    const sprindiks = await sprindikService.getAllSprindiks();
    
    res.json({
      success: true,
      data: sprindiks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Sprindik by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getSprindikById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const sprindik = await sprindikService.getSprindikById(id);
    
    if (!sprindik) {
      return res.status(404).json({
        success: false,
        message: 'Sprindik tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: sprindik
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Sprindiks by LP ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getSprindiksByLpId = async (req, res, next) => {
  try {
    const { lpId } = req.params;
    
    // Check if LP exists
    const lp = await lpService.getLPById(lpId);
    
    if (!lp) {
      return res.status(404).json({
        success: false,
        message: 'LP tidak ditemukan'
      });
    }
    
    const sprindiks = await sprindikService.getSprindiksByLpId(lpId);
    
    res.json({
      success: true,
      data: sprindiks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Sprindik
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createSprindik = async (req, res, next) => {
  try {
    const { judul_sprindik, deskripsi, lp_id } = req.body;
    const file = req.file;
    
    // Validate input
    if (!judul_sprindik) {
      return res.status(400).json({
        success: false,
        message: 'Judul Sprindik wajib diisi'
      });
    }
    
    if (lp_id) {
      // Check if LP exists
      const lp = await lpService.getLPById(lp_id);
      
      if (!lp) {
        return res.status(404).json({
          success: false,
          message: 'LP tidak ditemukan'
        });
      }
    }
    
    // Create Sprindik
    const sprindikId = await sprindikService.createSprindik(
      { judul_sprindik, deskripsi, lp_id },
      file
    );
    
    res.status(201).json({
      success: true,
      message: 'Sprindik berhasil dibuat',
      data: { 
        id: sprindikId, 
        judul_sprindik, 
        deskripsi, 
        lp_id,
        file_pdf_sprindik: file ? fileHandler.getRelativePath(file.path) : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a Sprindik
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateSprindik = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { judul_sprindik, deskripsi, lp_id } = req.body;
    const file = req.file;
    
    // Check if Sprindik exists
    const sprindik = await sprindikService.getSprindikById(id);
    
    if (!sprindik) {
      return res.status(404).json({
        success: false,
        message: 'Sprindik tidak ditemukan'
      });
    }
    
    if (lp_id) {
      // Check if LP exists
      const lp = await lpService.getLPById(lp_id);
      
      if (!lp) {
        return res.status(404).json({
          success: false,
          message: 'LP tidak ditemukan'
        });
      }
    }
    
    // Update Sprindik
    await sprindikService.updateSprindik(
      id,
      { judul_sprindik, deskripsi, lp_id },
      file
    );
    
    res.json({
      success: true,
      message: 'Sprindik berhasil diperbarui'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Sprindik
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteSprindik = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if Sprindik exists
    const sprindik = await sprindikService.getSprindikById(id);
    
    if (!sprindik) {
      return res.status(404).json({
        success: false,
        message: 'Sprindik tidak ditemukan'
      });
    }
    
    // Delete Sprindik
    await sprindikService.deleteSprindik(id);
    
    res.json({
      success: true,
      message: 'Sprindik berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSprindiks,
  getSprindikById,
  getSprindiksByLpId,
  createSprindik,
  updateSprindik,
  deleteSprindik
};