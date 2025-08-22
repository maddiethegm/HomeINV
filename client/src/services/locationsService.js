// src/services/locationsService.js
import api from '../services/api'; // Ensure this import is correct

/**
 * Fetches all locations.
 *
 * @returns {Promise<Object[]>} - The promise resolving to an array of locations.
 */
export const fetchLocations = async () => {
    try {
        const response = await api.get('/locations', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Adds a new location.
 *
 * @param {Object} location - The location to add.
 * @returns {Promise<Object>} - The promise resolving to the added location.
 */
export const addLocation = async (location) => {
    try {
        const response = await api.post('/locations', location, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding location:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Updates an existing location.
 *
 * @param {string} id - The ID of the location to update.
 * @param {Object} updatedLocation - The updated location data.
 * @returns {Promise<Object>} - The promise resolving to the updated location.
 */
export const updateLocation = async (id, updatedLocation) => {
    try {
        const response = await api.put(`/locations/${id}`, updatedLocation, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating location:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Deletes a location.
 *
 * @param {string} id - The ID of the location to delete.
 * @returns {Promise<void>} - The promise resolving when deletion is complete.
 */
export const deleteLocation = async (id) => {
    try {
        await api.delete(`/locations/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error('Error deleting location:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};
