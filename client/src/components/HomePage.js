// src/components/HomePage.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch rooms when the component mounts
        fetchRooms();
    }, []);

const fetchRooms = async () => {
        try {
            const response = await axios.get( process.env.REACT_APP_API_URL + '/locations', {
                params: { 
                    filterColumn: 'Name',
                    searchValue: '',
                    exactMatch: false
                },
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };


    const handleRoomClick = (roomName) => {
        navigate(`/items/${roomName}`);
    };

    return (
        <div className="container mt-5">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {rooms.map(room => (
                    <div key={room.ID} className="col">
                        <div className="card loca-card h-100" onClick={() => handleRoomClick(room.Name)}>
                            <img src={room.Image} alt={room.Name} className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{room.Name}</h5>
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
