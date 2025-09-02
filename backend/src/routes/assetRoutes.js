/**
 * Asset routes module
 * Defines API routes for Asset operations
 */
const express = require('express');
const assetController = require('../controllers/assetController');
const { isAuthenticated, hasRole, ROLES } = require('../middleware/auth');
const { upload } = require('../utils/fileHandler');

const router = express.Router();

/**
 * @route   GET /api/asset
 * @desc    Get all Assets
 * @access  Private
 */
router.get('/', isAuthenticated, assetController.getAllAssets);

/**
 * @route   GET /api/asset/:id
 * @desc    Get Asset by ID
 * @access  Private
 */
router.get('/:id', isAuthenticated, assetController.getAssetById);

/**
 * @route   GET /api/asset/ba/:baId
 * @desc    Get Assets by BA ID
 * @access  Private
 */
router.get('/ba/:baId', isAuthenticated, assetController.getAssetsByBaId);

/**
 * @route   GET /api/asset/category/:kategori
 * @desc    Get Assets by category
 * @access  Private
 */
router.get('/category/:kategori', isAuthenticated, assetController.getAssetsByCategory);

/**
 * @route   POST /api/asset
 * @desc    Create a new Asset
 * @access  Superadmin only
 */
router.post(
  '/',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  upload.single('file_pdf_aset'),
  assetController.createAsset
);

/**
 * @route   PUT /api/asset/:id
 * @desc    Update an Asset
 * @access  Superadmin only
 */
router.put(
  '/:id',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  upload.single('file_pdf_aset'),
  assetController.updateAsset
);

/**
 * @route   DELETE /api/asset/:id
 * @desc    Delete an Asset
 * @access  Superadmin only
 */
router.delete(
  '/:id',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  assetController.deleteAsset
);

module.exports = router;