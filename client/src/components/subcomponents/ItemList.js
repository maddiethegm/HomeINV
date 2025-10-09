// src/components/ItemList.js

import React, { useState } from 'react';
import api from '../../services/api';

/**
 * Helper function to validate URLs.
 *
 * @param {string} string - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Displays a scrollable list of items.
 *
 * @param {Array} props.items - The array of items to display.
 * @param {Function} props.onModify - Callback function when an item is modified.
 */
function ItemList({ items, onModify }) {
    const containerStyle = {
        maxHeight: '500px', // Adjust the max height as needed
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '8px'
    };

    return (
        <div style={containerStyle}>
            {items.map(item => (
                <div key={item.ID} className="list-item" style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                    {/* Display item name */}
                    <h5>{item.Name}</h5>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Display item description and location */}
                        <p>
                            Description: {item.Description}<br></br>
                            Location: {item.Location}
                        </p>

                        {/* Buttons to update quantity and modify item */}
                        <QuantityUpdateAndModifyButtons item={item} onModify={onModify} />
                    </div>

                    {isValidUrl(item.Image) && (
                        <img src={item.Image} alt={item.Name} className="card-img-top" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
                    )}
                </div>
            ))}
        </div>
    );
}

/**
 * Component for updating quantity and modifying an item.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.item - The item object containing details like name, description, etc.
 * @param {Function} props.onModify - Callback function to handle modification of the item.
 */
const QuantityUpdateAndModifyButtons = ({ item, onModify }) => {
    const [quantity, setQuantity] = useState(item.Quantity);
    const [isUpdating, setIsUpdating] = useState(false);

    /**
     * Handles changes to the quantity input field.
     *
     * @param {Event} e - The change event from the input field.
     */
    const handleQuantityChange = (e) => {
        setQuantity(parseInt(e.target.value));
        setIsUpdating(true); // Change label to "Update"
    };

    /**
     * Updates the item quantity in the backend.
     */
    const handleUpdateQuantity = async () => {
        try {
            await api.put(`/inventory/${item.ID}`, { Quantity: quantity }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setIsUpdating(false); // Revert label back to "Quantity"
            alert('Quantity updated successfully');
        } catch (error) {
            console.error('Failed to update quantity:', error.response ? error.response.data : 'No response data');
            alert('Failed to update quantity');
        }
    };

    // Generate quantity options for the dropdown
    const quantityOptions = [];
    for (let i = 0; i <= 20; i++) { // Adjust the range as needed
        quantityOptions.push(i);
    };

    return (
        <div style={{ marginLeft: 'auto', display: 'flex' }}>
            {/* Label for quantity or update action */}
            <label className="me-2" style={{ marginRight: '5px' }}>{isUpdating ? 'Update:' : 'Quantity:'}</label>

            {/* Dropdown to select quantity */}
            <select
                value={quantity}
                onChange={handleQuantityChange}
                className="form-select"
                style={{ width: '60px', marginInlineEnd: '10px' }}
            >
                {quantityOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

            {/* Button to update quantity */}
            <button
                onClick={handleUpdateQuantity}
                className="btn btn-primary me-2"
            >
                Update
            </button>

            {/* Button to modify item */}
            <button
                onClick={() => onModify(item)}
                className="btn btn-warning"
            >
                Modify
            </button>
        </div>
    );
};

export default ItemList;
