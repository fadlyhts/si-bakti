/**
 * LP (Laporan Polisi) controller module
 * Handles HTTP requests for LP operations
 */
const lpService = require('../services/lpService');

/**
 * Get all LPs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAllLPs = async (req, res, next) => {
  try {
    const lps = await lpService.getAllLPs();
    
    res.json({
      success: true,
      data: lps
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get LP by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getLPById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const lp = await lpService.getLPById(id);
    
    if (!lp) {
      return res.status(404).json({
        success: false,
        message: 'LP tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: lp
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new LP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createLP = async (req, res, next) => {
  try {
    const { nama } = req.body;
    
    // Validate input
    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama LP wajib diisi'
      });
    }
    
    // Create LP
    const lpId = await lpService.createLP({ nama });
    
    res.status(201).json({
      success: true,
      message: 'LP Berhasil dibuat!',
      data: { id: lpId, nama }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an LP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateLP = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    
    // Check if LP exists
    const lp = await lpService.getLPById(id);
    
    if (!lp) {
      return res.status(404).json({
        success: false,
        message: 'LP tidak ditemukan'
      });
    }
    
    // Validate input
    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama LP wajib diisi'
      });
    }
    
    // Update LP
    await lpService.updateLP(id, { nama });
    
    res.json({
      success: true,
      message: 'LP berhasil diperbarui'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an LP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteLP = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if LP exists
    const lp = await lpService.getLPById(id);
    
    if (!lp) {
      return res.status(404).json({
        success: false,
        message: 'LP tidak ditemukan'
      });
    }
    
    // Delete LP
    await lpService.deleteLP(id);
    
    res.json({
      success: true,
      message: 'LP berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLPs,
  getLPById,
  createLP,
  updateLP,
  deleteLP
};