/**
 * LP (Laporan Polisi) routes module
 * Defines API routes for LP operations
 */
const express = require('express');
const lpController = require('../controllers/lpController');
const { isAuthenticated, hasRole, ROLES } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/lp
 * @desc    Get all LPs
 * @access  Private
 */
router.get('/', isAuthenticated, lpController.getAllLPs);

/**
 * @route   GET /api/lp/:id
 * @desc    Get LP by ID
 * @access  Private
 */
router.get('/:id', isAuthenticated, lpController.getLPById);

/**
 * @route   POST /api/lp
 * @desc    Create a new LP
 * @access  Superadmin only
 */
router.post('/', isAuthenticated, hasRole(ROLES.SUPERADMIN), lpController.createLP);

/**
 * @route   PUT /api/lp/:id
 * @desc    Update an LP
 * @access  Superadmin only
 */
router.put('/:id', isAuthenticated, hasRole(ROLES.SUPERADMIN), lpController.updateLP);

/**
 * @route   DELETE /api/lp/:id
 * @desc    Delete an LP
 * @access  Superadmin only
 */
router.delete('/:id', isAuthenticated, hasRole(ROLES.SUPERADMIN), lpController.deleteLP);

module.exports = router;