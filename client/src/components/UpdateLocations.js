// src/components/UpdateLocations.js
import { useState, useEffect } from 'react';
import LocationCard from './LocationCard'; // Import LocationCard component
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function UpdateLocations() {
    const [location, setLocation] = useState({
        ID: '',
        Name: '',
        Description: '',
        Building: '',
        Owner: '',
        Image: ''
    });

    const [locations, setLocations] = useState([]); // State to hold all locations
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const locationRoute = useLocation();
    const navigate = useNavigate();

    const fetchLocations = async () => {
        try {
            const response = await api.get('/locations', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: { 
                    filterColumn: 'Name',
                    searchValue: '',
                    exactMatch: false
                }
            });
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    
    useEffect(() => {
        // Initialize location with data from route state if available
        if (locationRoute.state) {
            setLocation(locationRoute.state);
        }
        fetchLocations();
    }, [locationRoute]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearch = async () => {
        try {
            const response = await api.get('/locations', {
                params: { 
                    filterColumn: 'Name',
                    searchValue: location.Name,
                    exactMatch: false
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSearchResults(response.data);
            setIsSearchModalOpen(true);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/locations/${location.ID}`, location, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Location updated successfully');
            fetchLocations(); // Re-fetch the locations list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const handleAdd = async () => {
        try {
            await api.post('/locations', location, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Location added successfully');
            fetchLocations(); // Re-fetch the locations list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;
        try {
            await api.delete(`/locations/${location.ID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Location deleted successfully');
            fetchLocations(); // Re-fetch the locations list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    };


    
        const handleModify = (locationRoute) => {
        setLocation(locationRoute);
    };

    return (
        <div className="container mt-5">
            <h2>Update Locations</h2>
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
                <button type="button" className="btn btn-primary me-2" onClick={handleSearch}>Search</button>
                <button 
                    type="button" 
                    className="btn btn-success me-2" 
                    onClick={() => location.ID ? handleUpdate() : handleAdd()} 
                    disabled={location.Name === ''}>
                    {location.ID ? 'Update' : 'Add'}
                </button>
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
                            <div className="modal-header flex-d justify-content-between">
                                <h5 className="modal-title">Search Results</h5>
                                <button type="button" class="close" onClick={() => setIsSearchModalOpen(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row row-cols-1 row-cols-md-3 g-4">
                                    {searchResults.map(item => (
                                        <div key={item.ID} className="col">
                                            <LocationCard location={item} onModify={() => handleModify(item)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Grid of All Locations */}
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {locations.map(location => (
                    <div key={location.ID} className="col">
                        <LocationCard location={location} onModify={() => handleModify(location)} />
                    </div>
                ))}
            </div>

            {/* Image Preview */}
            <div className="mt-5">
                {location.Image && (
                    <img
                        src={location.Image}
                        alt="Location"
                        style={{ width: '100%', height: 'auto', border: '2px solid #ccc', borderRadius: '5px' }}
                    />
                )}
            </div>
        </div>
    );
}

export default UpdateLocations;
