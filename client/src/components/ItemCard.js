// src/components/ItemCard.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function ItemCard({ item, onModify }) {
    const [quantity, setQuantity] = useState(item.Quantity);
    const [isOutOfStock, setIsOutOfStock] = useState(item.IsOutOfStock);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();
    const handleQuantityChange = (e) => {
        setQuantity(parseInt(e.target.value));
        setIsUpdating(true); // Change label to "Update"
    };

    const handleUpdateQuantity = async () => {
        try {
            // Update quantity in the backend
            await axios.put(`${process.env.REACT_APP_API_URL}/update-quantity/${item.ID}`, { quantity }, {
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
    const handleModify = () => {
        navigate('/update-inventory', { state: item })
    };
    const quantityOptions = [];
    for (let i = 0; i <= 20; i++) { // Adjust the range as needed
        quantityOptions.push(i);
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{item.Name}</h5>
                <img src={item.Image || 'https://via.placeholder.com/150'} alt={item.Name} className="card-img-top" />
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
                        Update Quantity
                    </button>
                    <button
                        onClick={handleModify}
                        className="btn btn-warning ms-2"
                    >
                        Modify
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;
