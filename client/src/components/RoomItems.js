// src/components/RoomItems.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ItemCard from './ItemCard';

function RoomItems() {
    const { roomName } = useParams();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch items for the selected room when the component mounts
        fetchRoomItems(roomName);
    }, [roomName]);

    const fetchRoomItems = async (roomName) => {
        try {
            const response = await axios.get('http://localhost:3001/inventory', {
                params: { 
                    filterColumn: 'Location',
                    searchValue: roomName,
                    exactMatch: true
                }
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2>Items in {roomName}</h2>
            <button type="button" className="btn btn-secondary mb-3" onClick={handleBackClick}>Back to Locations</button>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {items.map(item => (
                    <div key={item.ID} className="col-md-4 mb-4">
                        <ItemCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoomItems;
