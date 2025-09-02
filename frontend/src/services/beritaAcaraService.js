import api from './axiosConfig';

export const getAllBAs = async () => {
  try {
    const response = await api.get('/ba');
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Berita Acara data');
    }
  } catch (error) {
    console.error('Berita Acara Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getBAById = async (id) => {
  try {
    const response = await api.get(`/ba/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Berita Acara data');
    }
  } catch (error) {
    console.error('Berita Acara Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const getBAsaBySprindikId = async (sprindikId) => {
  try {
    const response = await api.get(`/ba/sprindik/${sprindikId}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch Berita Acara data');
    }
  } catch (error) {
    console.error('Berita Acara Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const createBA = async (formData) => {
  try {
    const response = await api.post('/ba', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create Berita Acara');
    }
  } catch (error) {
    console.error('Berita Acara Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const updateBA = async (id, formData) => {
  try {
    const response = await api.put(`/ba/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update Berita Acara');
    }
  } catch (error) {
    console.error('Berita Acara Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};

export const deleteBA = async (id) => {
  try {
    const response = await api.delete(`/ba/${id}`);
    if (response.data.success) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || 'Failed to delete Berita Acara');
    }
  } catch (error) {
    console.error('Berita Acara Service Error:', error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'Server not responding. Please check if the backend is running.' };
    } else {
      throw { message: error.message || 'Network error' };
    }
  }
};
