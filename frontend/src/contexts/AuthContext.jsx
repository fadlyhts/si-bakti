import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, logout as logoutApi, getProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const checkAuthStatus = async () => {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginApi(username, password);
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Auth Context login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check if the backend server is running.' 
      };
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      navigate('/login');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Logout failed' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 1 // Assuming role 1 is admin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
