/**
 * User service module
 * Handles database operations for users
 */
const bcrypt = require('bcryptjs');
const db = require('../db/connection');
const { ROLES } = require('../middleware/auth');

/**
 * Get all users
 * @returns {Promise<Array>} Array of users
 */
const getAllUsers = async () => {
  const sql = 'SELECT id, username, role FROM user';
  return await db.query(sql);
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const getUserById = async (id) => {
  const sql = 'SELECT id, username, role FROM user WHERE id = ?';
  return await db.getOne(sql, [id]);
};

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {Promise<Object|null>} User object or null if not found
 */
const getUserByUsername = async (username) => {
  const sql = 'SELECT * FROM user WHERE username = ?';
  return await db.getOne(sql, [username]);
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @param {number} userData.role - User role (1=superadmin, 2=viewer)
 * @returns {Promise<number>} ID of the created user
 */
const createUser = async (userData) => {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  // Validate role
  const role = userData.role || ROLES.VIEWER; // Default to viewer
  
  const data = {
    username: userData.username,
    password: hashedPassword,
    role: role
  };
  
  return await db.insert('user', data);
};

/**
 * Update a user
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Update result
 */
const updateUser = async (id, userData) => {
  const data = {};
  
  // Only include fields that are provided
  if (userData.username) {
    data.username = userData.username;
  }
  
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(userData.password, salt);
  }
  
  if (userData.role) {
    data.role = userData.role;
  }
  
  return await db.update('user', data, 'id = ?', [id]);
};

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise<Object>} Delete result
 */
const deleteUser = async (id) => {
  return await db.remove('user', 'id = ?', [id]);
};

/**
 * Authenticate a user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object|null>} User object without password or null if authentication fails
 */
const authenticate = async (username, password) => {
  // Get user by username
  const user = await getUserByUsername(username);
  
  if (!user) {
    return null;
  }
  
  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  authenticate
};