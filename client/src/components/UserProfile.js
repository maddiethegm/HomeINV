// src/components/UserProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getUserByUsername } from '../services/userService'; // Import necessary functions
import { fetchLocations } from '../services/locationsService';
import { fetchItems } from '../services/itemsService';
import { ListGroup, Container } from 'react-bootstrap';
import useInactivity from '../services/activity';
/**
 * User Profile component to display a user's details and owned locations/items.
 *
 * @returns {JSX.Element} - The JSX element representing the user profile page.
 */
function UserProfile() {
    useInactivity();
    const [user, setUser] = useState(null);
    const [locations, setLocations] = useState([]);
    const [items, setItems] = useState([]);
    const { username } = useParams();

    // Fetch user details and owned locations/items when the component mounts
    useEffect(() => {
        fetchUserDetails();
    }, [username]);

    /**
     * Fetches the user details and their owned locations/items.
     */
    const fetchUserDetails = async () => {
        try {
            // Fetch user details
            const userDetails = await getUserByUsername(username);
            setUser(userDetails);

            // Convert username to lowercase for case-insensitive comparison
            const usernameLowerCase = userDetails.Username.toLowerCase();

            // Fetch locations owned by the user
            const locationsResponse = await fetchLocations();
            const ownedLocations = locationsResponse.filter(location => location.Owner && location.Owner.toLowerCase().includes(usernameLowerCase));
            setLocations(ownedLocations);

            // Fetch items owned by the user
            const itemsResponse = await fetchItems();
            const ownedItems = itemsResponse.filter(item => item.Owner && item.Owner.toLowerCase().includes(usernameLowerCase));
            setItems(ownedItems);
        } catch (error) {
            console.error('Error fetching user details:', error);
            alert('Failed to load user data');
        }
    };

    return (
        <Container className="card text-light p-4 mt-5">
            {user ? (
                <>
                    <div className="card-title">{user.Username}</div>
                    <div className="mb-4 card-nob">
                            
                        <p className="card-text">
                            Display Name: {user.DisplayName}<br></br>
                            Contact: {user.Email}<br></br>
                            Team: {user.Team}<br></br>
                        </p>
                        <p className="card-text">
                            Bio:<br></br>
                            {user.Bio}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h3>Owned Locations</h3>
                        {locations.length > 0 ? (
                            <ListGroup variant="flush">
                                {locations.map((location) => (
                                    <ListGroup.Item key={location.ID}>{location.Name} - {location.Description}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No locations owned.</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <h3>Owned Items</h3>
                        {items.length > 0 ? (
                            <ListGroup variant="flush">
                                {items.map((item) => (
                                    <ListGroup.Item key={item.ID}>{item.Name} - {item.Description}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No items owned.</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading user profile...</p>
            )}
        </Container>
    );
}

export default UserProfile;
