import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

// Component to protect routes that require authentication
const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size={40} className="animate-spin text-[#8f00ff]" />
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route requires admin and user is not admin, redirect to dashboard
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated (and admin if required), render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 