// src/services/userService.js

import api from '../services/api'; // Ensure this import is correct

/**
 * Registers a new user.
 *
 * @param {Object} userData - The user data to register.
 * @returns {Promise<Object>} - The promise resolving to the registered user.
 */
export const registerUser = async (userData) => {
    try {
        const response = await api.post(
            '/auth/register', 
            userData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : 'No response data');
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Logs in a user.
 *
 * @param {Object} credentials - The login credentials (Username and Password).
 * @returns {Promise<Object>} - The promise resolving to the authentication token.
 */
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Fetches user details by username.
 *
 * @param {string} username - The username of the user to fetch.
 * @returns {Promise<Object>} - The promise resolving to the user details.
 */
export const getUserByUsername = async (username) => {
    try {
        const response = await api.get(`/users/${username}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error.response ? error.response.data : 'No response data');
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Updates a user by ID.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Object} userData - The updated user data.
 * @returns {Promise<Object>} - The promise resolving to the update response.
 */
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, 
            userData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error.response ? error.response.data : 'No response data');
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Deletes a user by ID.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Object>} - The promise resolving to the deletion response.
 */
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : 'No response data');
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Fetches all users.
 *
 * @returns {Promise<Object>} - The promise resolving to the list of users.
 */
export const fetchUsers = async () => {
    try {
        const response = await api.get('/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : 'No response data');
        throw error; // Optionally, you can handle the error more gracefully
    }
};
