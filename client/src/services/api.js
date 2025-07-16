// src/services/api.js

/**
 * Module for creating an Axios instance configured for API requests.
 * It includes interceptors to handle response errors, such as unauthorized or forbidden access.
 */

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Create an Axios instance with a base URL and default headers.
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor to handle response errors globally.
 * If the error status is 401 or 403, it clears the token and redirects to the login page.
 */
api.interceptors.response.use(
    response => response,
    error => {
        const navigate = useNavigate();
        if (error.response && [401, 403].includes(error.response.status)) {
            localStorage.removeItem('token'); // Clear the token
            navigate('/login', { replace: true }); // Redirect to login page
            alert('Session expired. Please log in again.');
        }
        return Promise.reject(error);
    }
);

/**
 * Export the configured Axios instance for use throughout the application.
 */
export default api;
