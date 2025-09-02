import api from './axiosConfig';

export const getAllSprindiks = async () => {
  try {
    const response = await api.get('/sprindik');
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Sprindik data');
    }
  } catch (error) {
    console.error('Sprindik Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getSprindikById = async (id) => {
  try {
    const response = await api.get(`/sprindik/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Sprindik data');
    }
  } catch (error) {
    console.error('Sprindik Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getSprindiksByLpId = async (lpId) => {
  try {
    const response = await api.get(`/sprindik/lp/${lpId}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Sprindik data');
    }
  } catch (error) {
    console.error('Sprindik Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const createSprindik = async (formData) => {
  try {
    const response = await api.post('/sprindik', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create Sprindik');
    }
  } catch (error) {
    console.error('Sprindik Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const updateSprindik = async (id, formData) => {
  try {
    const response = await api.put(`/sprindik/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update Sprindik');
    }
  } catch (error) {
    console.error('Sprindik Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const deleteSprindik = async (id) => {
  try {
    const response = await api.delete(`/sprindik/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to delete Sprindik');
    }
  } catch (error) {
    console.error('Sprindik Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};
