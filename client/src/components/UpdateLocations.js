// src/components/UpdateLocations.js
import React, { useState, useEffect } from 'react';
import LocationList from './subcomponents/LocationList'; // Import the new LocationList component
import { useLocation, useNavigate } from 'react-router-dom';
import * as locationsService from '../services/locationsService';
import { initialLocationState } from '../models/Locations';
import useInactivity from '../services/activity';
/**
 * UpdateLocations component.
 *
 * @returns {JSX.Element} - The JSX element representing the update locations page.
 */
function UpdateLocations() {
    useInactivity();
    // State to hold the current location being edited or added
    const [location, setLocation] = useState(initialLocationState);

    // State to hold all locations fetched from the server
    const [locations, setLocations] = useState([]);

    // State to hold search results for locations
    const [searchResults, setSearchResults] = useState([]);

    // State to control visibility of the search modal
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    // Filter parameters state
    const [filterParams, setFilterParams] = useState({
        Name: '',
        Building: ''
    });

    // React Router location hook to access route parameters and state
    const locationRoute = useLocation();

    // React Router navigate hook for programmatically navigating routes
    const navigate = useNavigate();

    /**
     * Fetches all locations from the server and updates the `locations` state.
     */
    const fetchLocations = async () => {
        try {
            const fetchedLocations = await locationsService.fetchLocations();
            setLocations(fetchedLocations);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    /**
     * Effect hook to initialize location with data from route state if available and fetch locations.
     */
    useEffect(() => {
        // Initialize location with data from route state if available
        if (locationRoute.state) {
            setLocation(locationRoute.state);
        }
        fetchLocations();
    }, [locationRoute]);

    /**
     * Handles changes in the input fields and updates the location state.
     *
     * @param {Event} e - The event object containing the input field's new value.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Handles searching for locations based on multiple parameters.
     */
    const handleSearch = async () => {
        try {
            setFilterParams({
                Name: location.Name,
                Building: location.Building,
                Owner: location.Owner
            });
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    /**
     * Handles updating an existing location.
     */
    const handleUpdate = async () => {
        try {
            await locationsService.updateLocation(location.ID, location);
            alert('Location updated successfully');
            fetchLocations(); // Re-fetch the locations list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    /**
     * Handles adding a new location.
     */
    const handleAdd = async () => {
        try {
            await locationsService.addLocation(location);
            alert('Location added successfully');
            fetchLocations(); // Re-fetch the locations list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };
    const handleClear = () => {
        setLocation(initialLocationState);
        navigate('.');
    };
    /**
     * Handles deleting an existing location.
     */
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;
        try {
            await locationsService.deleteLocation(location.ID);
            alert('Location deleted successfully');
            fetchLocations(); // Re-fetch the locations list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    };

    /**
     * Modifies the location state with a new location object.
     *
     * @param {Object} location - The location object to modify.
     */
    const handleModify = (location) => {
        setLocation(location);
    };

    /**
     * Handles the selection of an item from search results.
     *
     * @param {Object} location - The selected location.
     */
    const handleSearchResultClick = (location) => {
        setLocation(location);
        setIsSearchModalOpen(false);
    };

    // Update filter parameters based on input changes
    useEffect(() => {
        setFilterParams({
            Name: location.Name,
            Building: location.Building
        });
    }, [location.Name, location.Building]);

    return (
        <div className="container mt-5">
            <h2>Update Locations</h2>
                        {/* Image Preview */}
            <div className="mt-5">
                {location.Image && (
                    <img
                        src={location.Image}
                        alt="Location"
                        style={{ width: '50%', height: 'auto', border: '2px solid #ccc', borderRadius: '5px' }}
                    />
                )}
            </div>
            <form>
                <div className="d-flex flex-column mb-3">
                    <div className="mb-4">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="Name" value={location.Name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" name="Description" rows="3" value={location.Description} onChange={handleChange} required></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="building" className="form-label">Building</label>
                        <input type="text" className="form-control" id="building" name="Building" value={location.Building} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="owner" className="form-label">Owner</label>
                        <input type="text" className="form-control" id="owner" name="Owner" value={location.Owner} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Image URL</label>
                        <input type="text" className="form-control" id="image" name="Image" value={location.Image} onChange={handleChange} required />
                    </div>
                </div>
            </form>

            {/* Buttons Container */}
            <div className="mb-4 d-flex justify-content-between">
{/*               <button type="button" className="btn btn-primary me-2" onClick={handleSearch}>Search</button> */}
                <button type="button" className="btn btn-primary me-2" onClick={handleSearch}>Search</button>
                <button 
                    type="button" 
                    className="btn btn-success me-2" 
                    onClick={() => location.ID ? handleUpdate() : handleAdd()} 
                    disabled={location.Name === ''}>
                    {location.ID ? 'Update' : 'Add'}
                </button>
                <button type="button" className="btn btn-secondary me-2" onClick={handleClear}>Clear</button>
                <button 
                    type="button" 
                    className="btn btn-danger me-2" 
                    onClick={handleDelete} 
                    disabled={!location.ID || location.ID === ''}>
                    Delete
                </button>
            </div>

            {/* Modal for Search Results */}
            {isSearchModalOpen && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header justify-content-between">
                                <h5 className="modal-title">Search Results</h5>
                                <button type="button" className="close" onClick={() => setIsSearchModalOpen(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Use LocationList for search results */}
                                <LocationList locations={searchResults} filterParams={{}} onModify={handleSearchResultClick} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Grid of All Locations */}
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll', marginTop: '20px' }}>
                {/* Use LocationList for full list of locations */}
                <LocationList locations={locations} filterParams={filterParams} onModify={handleModify} />
            </div>


        </div>
    );
}

export default UpdateLocations;
