// src/components/LocationCard.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/**
 * A card component representing a location.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.location - An object containing information about the location.
 * @param {string} props.location.Name - The name of the location.
 * @param {string} [props.location.Description] - A description of the location.
 * @param {string} [props.location.Building] - The building where the location is situated.
 * @param {string} [props.location.Owner] - The owner of the location.
 * @param {string} [props.location.Image] - An image URL for the location.
 * @param {Function} props.onModify - A callback function to handle modifications of the location.
 *
 * @returns {JSX.Element} - The JSX element representing the location card.
 */

function LocationCard({ location, onModify }) {
    const navigate = useNavigate();    

    
    /**
     * Navigates to the locations page pre-filled.
     */
    const handleModify = () => {
        navigate('/update-locations', { state: location })
    };    
    return (
        <div className="card h-100">
            {/* Fixed image size */}
            <img 
                src={location.Image || 'https://via.placeholder.com/150'} 
                alt={location.Name} 
                className="card-img-top" 
                style={{ height: '200px', objectFit: 'cover' }} 
            />
            <div className="card-body">
                <h5 className="card-title"><a href="#" onClick={() => onModify(location)}>{location.Name}</a></h5>
                <p className="card-text">
                    <strong>Description:</strong> {location.Description}<br />
                    <strong>Building:</strong> {location.Building}<br />
                    <strong>Owner:</strong> {location.Owner}
                </p>
                        {/* Button to modify item */}
            <button
                onClick={() => onModify(location)}
                className="btn btn-warning ms-2">
            Modify
            </button>
            </div>

        </div>
    );
};

export default LocationCard;
