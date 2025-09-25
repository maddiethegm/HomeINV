// src/components/ProtectedRoute.js

/**
 * React component that wraps protected routes.
 * It checks for authentication and optionally authorizes based on roles.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component that checks if a user is authenticated and optionally authorized before rendering the child component.
 *
 * @param {object} props - Component props.
 * @param {JSX.Element} props.children - The child components to render if the route is protected.
 * @param {string} [props.role] - Optional role required for authorization.
 * @returns {JSX.Element} - The JSX element representing either the child component or a redirect based on authentication and authorization checks.
 */
const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    let decodedToken;

    if (token) {
        try {
            decodedToken = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
        {/* Handle decoding error */}
            console.error('Error decoding token:', error);
        }
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role && decodedToken.role !== role) {
        return <Navigate to="/" replace />; // Redirect to a default page or show an unauthorized message
    }

    return children;
};

export default ProtectedRoute;
