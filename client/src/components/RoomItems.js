// src/components/RoomItems.js

/**
 * React component that displays items for a specific room.
 * It fetches items from an API and renders them using ItemCard components.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemCard from './subcomponents/ItemCard';
import api from '../services/api';
import useInactivity from '../services/activity';
/**
 * RoomItems component.
 *
 * @returns {JSX.Element} - The JSX element representing the list of items in a specific room.
 */
function RoomItems() {
    useInactivity();
    const { roomName } = useParams();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const handleModify = (item) => {
        navigate('/update-inventory', { state: item, replace: true });
    };
    /**
     * useEffect hook to fetch items for the selected room when the component mounts.
     *
     * @param {string} roomName - The name of the room to fetch items for.
     */
    useEffect(() => {
        // Fetch items for the selected room when the component mounts
        fetchRoomItems(roomName);
    }, [roomName]);

    /**
     * Function to fetch items from the API based on the provided room name.
     *
     * @param {string} roomName - The name of the room to filter items by.
     */
    const fetchRoomItems = async (roomName) => {
        try {
            const response = await api.get('/inventory', {
                params: {
                    Location: roomName 
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    /**
     * Function to handle the back button click.
     * Navigates the user back to the home page.
     */
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
                        <ItemCard item={item} onModify={() => handleModify(item)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoomItems;
