/**
 * Sprindik (Surat Perintah Penyidikan) routes module
 * Defines API routes for Sprindik operations
 */
const express = require('express');
const sprindikController = require('../controllers/sprindikController');
const { isAuthenticated, hasRole, ROLES } = require('../middleware/auth');
const { upload } = require('../utils/fileHandler');

const router = express.Router();

/**
 * @route   GET /api/sprindik
 * @desc    Get all Sprindiks
 * @access  Private
 */
router.get('/', isAuthenticated, sprindikController.getAllSprindiks);

/**
 * @route   GET /api/sprindik/:id
 * @desc    Get Sprindik by ID
 * @access  Private
 */
router.get('/:id', isAuthenticated, sprindikController.getSprindikById);

/**
 * @route   GET /api/sprindik/lp/:lpId
 * @desc    Get Sprindiks by LP ID
 * @access  Private
 */
router.get('/lp/:lpId', isAuthenticated, sprindikController.getSprindiksByLpId);

/**
 * @route   POST /api/sprindik
 * @desc    Create a new Sprindik
 * @access  Superadmin only
 */
router.post(
  '/',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  upload.single('file_pdf_sprindik'),
  sprindikController.createSprindik
);

/**
 * @route   PUT /api/sprindik/:id
 * @desc    Update a Sprindik
 * @access  Superadmin only
 */
router.put(
  '/:id',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  upload.single('file_pdf_sprindik'),
  sprindikController.updateSprindik
);

/**
 * @route   DELETE /api/sprindik/:id
 * @desc    Delete a Sprindik
 * @access  Superadmin only
 */
router.delete(
  '/:id',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  sprindikController.deleteSprindik
);

module.exports = router;