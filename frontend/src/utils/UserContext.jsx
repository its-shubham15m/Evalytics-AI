import { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // This endpoint now fetches the complete user profile
        const { data } = await api.get('/user/profile');
        setUser(data);
      } catch (error) {
        // If it fails (e.g., invalid cookie), user is not logged in
        console.error("Failed to fetch user profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
