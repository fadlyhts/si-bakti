/**
 * LP (Laporan Polisi) service module
 * Handles database operations for LP
 */
const db = require('../db/connection');

/**
 * Get all LPs
 * @returns {Promise<Array>} Array of LPs
 */
const getAllLPs = async () => {
  const sql = 'SELECT * FROM lp';
  return await db.query(sql);
};

/**
 * Get LP by ID
 * @param {number} id - LP ID
 * @returns {Promise<Object|null>} LP object or null if not found
 */
const getLPById = async (id) => {
  const sql = 'SELECT * FROM lp WHERE id = ?';
  return await db.getOne(sql, [id]);
};

/**
 * Create a new LP
 * @param {Object} lpData - LP data
 * @param {string} lpData.nama - LP name
 * @returns {Promise<number>} ID of the created LP
 */
const createLP = async (lpData) => {
  const data = {
    nama: lpData.nama
  };
  
  return await db.insert('lp', data);
};

/**
 * Update an LP
 * @param {number} id - LP ID
 * @param {Object} lpData - LP data to update
 * @returns {Promise<Object>} Update result
 */
const updateLP = async (id, lpData) => {
  const data = {};
  
  // Only include fields that are provided
  if (lpData.nama) {
    data.nama = lpData.nama;
  }
  
  return await db.update('lp', data, 'id = ?', [id]);
};

/**
 * Delete an LP
 * @param {number} id - LP ID
 * @returns {Promise<Object>} Delete result
 */
const deleteLP = async (id) => {
  return await db.remove('lp', 'id = ?', [id]);
};

module.exports = {
  getAllLPs,
  getLPById,
  createLP,
  updateLP,
  deleteLP
};