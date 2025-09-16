// src/components/HomePage.js

import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import useInactivity from '../services/activity';

/**
 * React component representing the home page.
 * It displays a list of rooms and allows users to click on them to view items in those rooms.
 */
function HomePage() {
    useInactivity();
    /**
     * State hook to hold the list of rooms fetched from the API.
     *
     * @type {[Array, Function]}
     */
    const [rooms, setRooms] = useState([]);

    /**
     * React Router's `useNavigate` hook for programmatic navigation.
     *
     * @type {Function}
     */
    const navigate = useNavigate();

    /**
     * useEffect to fetch rooms when the component mounts.
     */
    useEffect(() => {
        // Fetch rooms when the component mounts
        fetchRooms();
    }, []); // Empty dependency array ensures this effect runs only once after initial render

    /**
     * Asynchronous function to fetch rooms from the API.
     *
     * @async
     * @returns {Promise<void>}
     */
    const fetchRooms = async () => {
        try {
            const response = await api.get('/locations', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    /**
     * Function to handle room click event.
     *
     * @param {string} roomName - The name of the clicked room.
     */
    const handleRoomClick = (roomName) => {
        navigate(`/items/${roomName}`);
    };

    return (
        <div className="container mt-5">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {rooms.map(room => (
                    <div key={room.ID} className="col">
                        <div className="card h-100" onClick={() => handleRoomClick(room.Name)}>
                            <img src={room.Image} alt={room.Name} className="card-img-top"/>
                            <div className="card-body">
                                <h5 className="card-title card-text">{room.Name}</h5>
                                {/* Optionally, display room description or other details */}
                                {/* <p className="card-text">{room.Description}</p> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
