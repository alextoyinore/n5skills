import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // You can replace this with a proper LoadingSpinner component
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        // Redirect them to the /login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        // Redirect non-admins to home if they try to access admin pages
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
