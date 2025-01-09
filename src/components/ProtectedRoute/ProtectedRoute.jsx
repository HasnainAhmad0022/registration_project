import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const userData = sessionStorage.getItem('userData');

  useEffect(() => {
    if (!userData) {
      toast.error('Please login to access this page', {
        id: 'auth-error', // Add a unique ID to prevent duplicate toasts
      });
      navigate('/', { replace: true });
      return;
    }

    try {
      const parsedData = JSON.parse(userData);
      if (!parsedData.data.token) {
        toast.error('Invalid session. Please login again', {
          id: 'invalid-session', // Add a unique ID to prevent duplicate toasts
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      sessionStorage.removeItem('userData');
      toast.error('Session expired. Please login again', {
        id: 'session-expired', // Add a unique ID to prevent duplicate toasts
      });
      navigate('/', { replace: true });
    }
  }, [navigate, userData]);

  if (!userData) return null;

  try {
    const parsedData = JSON.parse(userData);
    if (!parsedData.data.token) return null;
    return children;
  } catch (error) {
    return null;
  }
};

export default ProtectedRoute;