/**
 * Database connection module
 * Establishes and manages connections to the MySQL database
 */
const mysql = require('mysql2/promise');
const config = require('../config/config');

// Create a connection pool
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Execute a SQL query with parameters
 * @param {string} sql - SQL query to execute
 * @param {Array} params - Parameters for the SQL query
 * @returns {Promise<Array>} - Query results
 */
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

/**
 * Get a single record from a query
 * @param {string} sql - SQL query to execute
 * @param {Array} params - Parameters for the SQL query
 * @returns {Promise<Object|null>} - First result or null if not found
 */
const getOne = async (sql, params) => {
  const results = await query(sql, params);
  return results.length ? results[0] : null;
};

/**
 * Insert a record and return the inserted ID
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<number>} - Inserted ID
 */
const insert = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  
  const result = await query(sql, values);
  return result.insertId;
};

/**
 * Update a record
 * @param {string} table - Table name
 * @param {Object} data - Data to update
 * @param {string} whereClause - WHERE clause (without the 'WHERE' keyword)
 * @param {Array} whereParams - Parameters for the WHERE clause
 * @returns {Promise<Object>} - Update result
 */
const update = async (table, data, whereClause, whereParams) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  
  const params = [...values, ...whereParams];
  return await query(sql, params);
};

/**
 * Delete a record
 * @param {string} table - Table name
 * @param {string} whereClause - WHERE clause (without the 'WHERE' keyword)
 * @param {Array} whereParams - Parameters for the WHERE clause
 * @returns {Promise<Object>} - Delete result
 */
const remove = async (table, whereClause, whereParams) => {
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  return await query(sql, whereParams);
};

// Test database connection
const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

module.exports = {
  query,
  getOne,
  insert,
  update,
  remove,
  testConnection
};