// src/models/Locations.js
import React from 'react';

export const initialLocationState = {
    ID: '',
    Name: '',
    Description: '',
    Building: '',
    Owner: '',
    Image: ''
};

export default function useLocations(initialLocations = []) {
    const [locations, setLocations] = React.useState(initialLocations);

    // Method to add a new location
    const addLocation = (newLocation) => {
        setLocations([...locations, newLocation]);
    };

    // Method to update an existing location
    const updateLocation = (updatedLocation) => {
        setLocations(locations.map(location => location.ID === updatedLocation.ID ? updatedLocation : location));
    };

    // Method to delete a location
    const deleteLocation = (locationId) => {
        setLocations(locations.filter(location => location.ID !== locationId));
    };

    return { locations, addLocation, updateLocation, deleteLocation };
}
