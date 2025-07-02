// src/components/LocationCard.js
import React from 'react';

const LocationCard = ({ location, onModify }) => {
    return (
        <div className="card h-100">
            <img 
                src={location.Image || 'https://via.placeholder.com/150'} 
                alt={location.Name} 
                className="card-img-top" 
                style={{ height: '200px', objectFit: 'cover' }} // Fixed image size
            />
            <div className="card-body">
                <h5 className="card-title"><a href="#" onClick={() => onModify(location)}>{location.Name}</a></h5>
                <p className="card-text">
                    <strong>Description:</strong> {location.Description}<br />
                    <strong>Building:</strong> {location.Building}<br />
                    <strong>Owner:</strong> {location.Owner}
                </p>
            </div>
        </div>
    );
};

export default LocationCard;
