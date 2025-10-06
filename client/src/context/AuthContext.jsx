import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Cek jika token sudah kedaluwarsa
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem('authToken');
          setUser(null);
        } else {
          setUser(decodedUser);
        }
      } catch (error) {
        // Token tidak valid
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;