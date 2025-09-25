// src/components/subcomponents/LocationList.js
import React from 'react';
import LocationCard from './LocationCard';
/**
 * LocationList component.
 *
 * @param {Object} props - The component properties.
 * @param {Array<Object>} props.locations - An array of location objects.
 * @param {Object} props.filterParams - Object containing filter parameters.
 * @param {Function} props.onModify - Callback to handle modifying a location.
 */
const LocationList = ({ locations, filterParams, onModify }) => {
    // Filter the locations based on filter parameters
    const filteredLocations = locations.filter(location =>
        (!filterParams.Name || (location && location.Name?.toLowerCase().includes(filterParams.Name.toLowerCase()))) &&
        (!filterParams.Building || (location && location.Building?.toLowerCase().includes(filterParams.Building.toLowerCase()))) &&
        (!filterParams.Owner || (location && location.Owner?.toLowerCase().includes(filterParams.Owner.toLowerCase())))
    );

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredLocations.map(location => (
                <div key={location.ID} className="col">
                    {/* Assuming LocationCard is imported and correctly defined */}
                    <LocationCard location={location} onModify={() => onModify(location)} />
                </div>
            ))}
        </div>
    );
};

export default LocationList;
