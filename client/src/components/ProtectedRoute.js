// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    let decodedToken;

    if (token) {
        try {
            decodedToken = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            // Handle decoding error
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
