import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check authentication status
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      // Verify token with backend
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.valid) {
        setIsAuthenticated(true);
        
        // Check token expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired, attempt refresh
          await refreshToken();
        }
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('token');
      navigate('/login', { state: { from: location }, replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await api.post('/auth/refresh', { refreshToken });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login', { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Set up interval for periodic checks (every 2 minutes)
    const interval = setInterval(checkAuth, 120000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default AuthWrapper;