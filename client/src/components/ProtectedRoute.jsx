import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  if (!token) {
    // Jika tidak ada token, arahkan ke halaman login.
    // `state={{ from: location }}` berguna agar setelah login,
    // pengguna bisa diarahkan kembali ke halaman yang tadinya ingin ia tuju.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika ada token, tampilkan halaman yang diminta (children).
  return children;
}

export default ProtectedRoute;