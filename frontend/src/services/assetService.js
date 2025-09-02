import api from './axiosConfig';

export const getAllAssets = async () => {
  try {
    const response = await api.get('/asset');
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Asset data');
    }
  } catch (error) {
    console.error('Asset Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getAssetById = async (id) => {
  try {
    const response = await api.get(`/asset/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Asset data');
    }
  } catch (error) {
    console.error('Asset Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getAssetsByBAId = async (baId) => {
  try {
    const response = await api.get(`/asset/ba/${baId}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Asset data');
    }
  } catch (error) {
    console.error('Asset Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getAssetsByCategory = async (category) => {
  try {
    const response = await api.get(`/asset/category/${category}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Asset data');
    }
  } catch (error) {
    console.error('Asset Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const createAsset = async (formData) => {
  try {
    const response = await api.post('/asset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create Asset');
    }
  } catch (error) {
    console.error('Asset Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const updateAsset = async (id, formData) => {
  try {
    const response = await api.put(`/asset/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update Asset');
    }
  } catch (error) {
    console.error('Asset Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const deleteAsset = async (id) => {
  try {
    const response = await api.delete(`/asset/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to delete Asset');
    }
  } catch (error) {
    console.error('Asset Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};
