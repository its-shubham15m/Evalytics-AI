import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check for the token in localStorage, which is more reliable for this setup.
  const token = localStorage.getItem('token');

  // If a token exists, the user is considered authenticated.
  // If not, they are redirected to the login page.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;