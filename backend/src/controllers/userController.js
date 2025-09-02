/**
 * User controller module
 * Handles HTTP requests for user operations
 */
const userService = require('../services/userService');
const { ROLES } = require('../middleware/auth');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi'
      });
    }
    
    // Check if username already exists
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username sudah digunakan'
      });
    }
    
    // Create user
    const userId = await userService.createUser({
      username,
      password,
      role: role || ROLES.VIEWER // Default to viewer if role not provided
    });
    
    res.status(201).json({
      success: true,
      message: 'Pengguna berhasil didaftarkan',
      data: { id: userId, username, role: role || ROLES.VIEWER }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi'
      });
    }
    
    // Authenticate user
    const user = await userService.authenticate(username, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password tidak valid'
      });
    }
    
    // Set user in session
    req.session.user = user;
    
    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat logout'
      });
    }
    
    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  });
};

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;
    
    // Check if user exists
    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }
    
    // Update user
    await userService.updateUser(id, { username, password, role });
    
    res.json({
      success: true,
      message: 'Pengguna berhasil diperbarui'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }
    
    // Delete user
    await userService.deleteUser(id);
    
    res.json({
      success: true,
      message: 'Pengguna berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = (req, res) => {
  // User is already authenticated via middleware
  const user = req.session.user;
  
  res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile
};