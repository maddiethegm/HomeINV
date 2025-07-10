// src/services/api.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export default api;
