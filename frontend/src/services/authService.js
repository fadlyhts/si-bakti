import api from './axiosConfig';

export const login = async (username, password) => {
  try {
    const response = await api.post('/users/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', error.request);
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      throw { message: 'Network error: ' + error.message };
    }
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/users/logout');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to get profile');
    }
  } catch (error) {
    console.error('Get Profile Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};
