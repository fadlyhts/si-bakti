/**
 * User routes module
 * Defines API routes for user operations
 */
const express = require('express');
const userController = require('../controllers/userController');
const { isAuthenticated, hasRole, ROLES } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Superadmin only
 */
router.post('/register', isAuthenticated, hasRole(ROLES.SUPERADMIN), userController.register);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', userController.login);

/**
 * @route   POST /api/users/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', isAuthenticated, userController.logout);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Superadmin only
 */
router.get('/', isAuthenticated, hasRole(ROLES.SUPERADMIN), userController.getAllUsers);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', isAuthenticated, userController.getProfile);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Superadmin only
 */
router.get('/:id', isAuthenticated, hasRole(ROLES.SUPERADMIN), userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Superadmin only
 */
router.put('/:id', isAuthenticated, hasRole(ROLES.SUPERADMIN), userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Superadmin only
 */
router.delete('/:id', isAuthenticated, hasRole(ROLES.SUPERADMIN), userController.deleteUser);

module.exports = router;