// src/components/ItemCard.js
import { useState } from 'react';
import axios from 'axios';

function ItemCard({ item }) {
    const [quantity, setQuantity] = useState(item.Quantity);
    const [isOutOfStock, setIsOutOfStock] = useState(item.IsOutOfStock);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleQuantityChange = (e) => {
        setQuantity(parseInt(e.target.value));
        setIsUpdating(true); // Change label to "Update"
    };

    const handleToggleOutOfStock = async () => {
        try {
            // Update out-of-stock status in the backend
            await axios.put(`http://localhost:3001/update-out-of-stock/${item.ID}`, { isOutOfStock: !isOutOfStock });
            setIsOutOfStock(!isOutOfStock);
        } catch (error) {
            console.error('Failed to toggle out-of-stock:', error.response ? error.response.data : 'No response data');
            alert('Failed to toggle out-of-stock status');
        }
    };

    const handleUpdateQuantity = async () => {
        try {
            // Update quantity in the backend
            await axios.put(`http://localhost:3001/update-quantity/${item.ID}`, { quantity });
            setIsUpdating(false); // Revert label back to "Quantity"
            alert('Quantity updated successfully');
        } catch (error) {
            console.error('Failed to update quantity:', error.response ? error.response.data : 'No response data');
            alert('Failed to update quantity');
        }
    };

    const quantityOptions = [];
    for (let i = 0; i <= 20; i++) { // Adjust the range as needed
        quantityOptions.push(i);
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{item.Name}</h5>
                <p className="card-text">Description: {item.Description}</p>
                <p className="card-text"><strong>Location:</strong> {item.Location}</p>
                <div className="d-flex align-items-end justify-content-between">
                    <div className="d-flex flex-column">
                        <label className="mb-1">{isUpdating ? 'Update' : 'Quantity:'}</label>
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
                        <button
                            onClick={handleUpdateQuantity}
                            className="btn btn-primary ms-2"
                        >
                            Update
                        </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;
