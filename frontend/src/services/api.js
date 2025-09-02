// Re-export all API services from their modular files
import * as authService from './authService';
import * as lpService from './lpService';
import * as sprindikService from './sprindikService';
import * as beritaAcaraService from './beritaAcaraService';
import * as assetService from './assetService';
import * as userService from './userService';
import api from './axiosConfig';

// Re-export all auth service functions
export const { login, logout, getProfile } = authService;

// Re-export all LP service functions
export const { getAllLPs, getLPById, createLP, updateLP, deleteLP } = lpService;

// Re-export all Sprindik service functions
export const { 
  getAllSprindiks, 
  getSprindikById, 
  getSprindiksByLpId, 
  createSprindik, 
  updateSprindik, 
  deleteSprindik 
} = sprindikService;

// Re-export all Berita Acara service functions
export const { 
  getAllBAs, 
  getBAById, 
  getBAsaBySprindikId, 
  createBA, 
  updateBA, 
  deleteBA 
} = beritaAcaraService;

// Re-export all Asset service functions
export const { 
  getAllAssets, 
  getAssetById, 
  getAssetsByBAId, 
  getAssetsByCategory, 
  createAsset, 
  updateAsset, 
  deleteAsset 
} = assetService;

// Re-export all User service functions
export const {
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser
} = userService;

// Export the API instance as default
export default api;
