import api from './axiosConfig';

export const getAllLPs = async () => {
  try {
    const response = await api.get('/lp');
    // Handle response structure - backend returns { success, data } or { success, message }
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch LP data');
    }
  } catch (error) {
    console.error('LP Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getLPById = async (id) => {
  try {
    const response = await api.get(`/lp/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch LP data');
    }
  } catch (error) {
    console.error('LP Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const createLP = async (lpData) => {
  try {
    const response = await api.post('/lp', lpData);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create LP');
    }
  } catch (error) {
    console.error('LP Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const updateLP = async (id, lpData) => {
  try {
    const response = await api.put(`/lp/${id}`, lpData);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update LP');
    }
  } catch (error) {
    console.error('LP Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const deleteLP = async (id) => {
  try {
    const response = await api.delete(`/lp/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to delete LP');
    }
  } catch (error) {
    console.error('LP Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};
