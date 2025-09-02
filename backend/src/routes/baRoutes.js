/**
 * BA (Berita Acara) routes module
 * Defines API routes for BA operations
 */
const express = require('express');
const baController = require('../controllers/baController');
const { isAuthenticated, hasRole, ROLES } = require('../middleware/auth');
const { upload } = require('../utils/fileHandler');

const router = express.Router();

/**
 * @route   GET /api/ba
 * @desc    Get all BAs
 * @access  Private
 */
router.get('/', isAuthenticated, baController.getAllBAs);

/**
 * @route   GET /api/ba/:id
 * @desc    Get BA by ID
 * @access  Private
 */
router.get('/:id', isAuthenticated, baController.getBAById);

/**
 * @route   GET /api/ba/sprindik/:sprindikId
 * @desc    Get BAs by Sprindik ID
 * @access  Private
 */
router.get('/sprindik/:sprindikId', isAuthenticated, baController.getBAsBySprindikId);

/**
 * @route   POST /api/ba
 * @desc    Create a new BA
 * @access  Superadmin only
 */
router.post(
  '/',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  upload.single('file_pdf_ba'),
  baController.createBA
);

/**
 * @route   PUT /api/ba/:id
 * @desc    Update a BA
 * @access  Superadmin only
 */
router.put(
  '/:id',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  upload.single('file_pdf_ba'),
  baController.updateBA
);

/**
 * @route   DELETE /api/ba/:id
 * @desc    Delete a BA
 * @access  Superadmin only
 */
router.delete(
  '/:id',
  isAuthenticated,
  hasRole(ROLES.SUPERADMIN),
  baController.deleteBA
);

module.exports = router;