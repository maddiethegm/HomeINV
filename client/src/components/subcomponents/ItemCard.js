// src/components/ItemCard.js

/**
 * React component that represents a single item card.
 * It displays item details and provides functionality to update quantity and modify items.
 */
import { useState } from 'react';
import api from '../../services/api';

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
/**
 * ItemCard component.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.item - The item object containing details like name, description, etc.
 * @param {Function} props.onModify - Callback function to handle modification of the item.
 * @returns {JSX.Element} - The JSX element representing the item card.
 */
function ItemCard({ item, onModify }) {
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
            await api.put(`/inventory/${item.ID}`, item, {
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
    if (isValidUrl(item.Image)) {
        return (
            <div className="card h-100">
                {/* Display item name */}
                <div className="card-header card-text">{item.Name}</div>
                <div className="card-body">
                    {/* Display item image, with a placeholder if none is available */}
                    <img src={item.Image} alt={item.Name} className="card-img-top" />

                    {/* Display item description */}                {/* Display item location */}
                    <p className="card-text">
                        Description: {item.Description}<br></br>
                        Location: {item.Location}
                    </p>
                </div>
                <div className="card-footer">
                    {/* Quantity update and modify buttons */}
                    <div className="d-flex align-items-end justify-content-between">
                        <div className="d-flex flex-column">
                            {/* Label for quantity or update action */}
                            <label className="mb-1 card-text">{isUpdating ? 'Update' : 'Quantity:'}</label>

                            {/* Dropdown to select quantity */}
                            <select
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="form-select"
                            >
                                {quantityOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    
                        {/* Button to update quantity */}
                        <button
                            onClick={handleUpdateQuantity}
                            className="btn btn-primary ms-2"
                        >
                            Update Quantity
                        </button>
                                
                        {/* Button to modify item */}
                        <button
                            onClick={() => onModify(item)}
                            className="btn btn-warning ms-2"
                        >
                            Modify
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="card h-100">
                {/* Display item name */}
                <div className="card-header card-text">{item.Name}</div>
                <div className="card-body">

                    {/* Display item description */}                {/* Display item location */}
                    <p className="card-text">
                        Description: {item.Description}<br></br>
                        Location: {item.Location}
                    </p>
                </div>
                <div className="card-footer">
                    {/* Quantity update and modify buttons */}
                    <div className="d-flex align-items-end justify-content-between">
                        <div className="d-flex flex-column">
                            {/* Label for quantity or update action */}
                            <label className="mb-1 card-text">{isUpdating ? 'Update' : 'Quantity:'}</label>

                            {/* Dropdown to select quantity */}
                            <select
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="form-select"
                            >
                                {quantityOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    
                        {/* Button to update quantity */}
                        <button
                            onClick={handleUpdateQuantity}
                            className="btn btn-primary ms-2"
                        >
                            Update Quantity
                        </button>
                                
                        {/* Button to modify item */}
                        <button
                            onClick={() => onModify(item)}
                            className="btn btn-warning ms-2"
                        >
                            Modify
                        </button>
                    </div>
                </div>
            </div>
        );
    };
}

export default ItemCard;
