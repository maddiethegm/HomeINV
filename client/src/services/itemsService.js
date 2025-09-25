// src/services/itemsService.js
import api from '../services/api'; // Ensure this import is correct

/**
 * Fetches all inventory items.
 *
 * @returns {Promise<Object[]>} - The promise resolving to an array of items.
 */
export const fetchItems = async (params) => {
    try {
        const response = await api.get('/inventory', {
                params: params,
                headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Adds a new inventory item.
 *
 * @param {Object} item - The item to add.
 * @returns {Promise<Object>} - The promise resolving to the added item.
 */
export const addItem = async (item) => {
    try {
        const response = await api.post('/inventory', item, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding item:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Updates an existing inventory item.
 *
 * @param {string} id - The ID of the item to update.
 * @param {Object} updatedItem - The updated item data.
 * @returns {Promise<Object>} - The promise resolving to the updated item.
 */
export const updateItem = async (id, updatedItem) => {
    try {
        const response = await api.put(`/inventory/${id}`, updatedItem, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};

/**
 * Deletes an inventory item.
 *
 * @param {string} id - The ID of the item to delete.
 * @returns {Promise<void>} - The promise resolving when deletion is complete.
 */
export const deleteItem = async (id) => {
    try {
        await api.delete(`/inventory/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error; // Optionally, you can handle the error more gracefully
    }
};
