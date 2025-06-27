// src/components/UpdateLocations.js
import React, { useState } from 'react';
import axios from 'axios';

function UpdateLocations() {
    const [location, setLocation] = useState({
        ID: '',
        Name: '',
        Description: '',
        Building: '',
        Owner: '',
        Image: ''
    });

    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/locations', {
                params: { 
                    filterColumn: 'Name',
                    searchValue: location.Name,
                    exactMatch: false
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
            await axios.put(`http://localhost:3001/locations/${location.ID}`, location);
            alert('Location updated successfully');
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:3001/locations', location);
            alert('Location added successfully');
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;
        try {
            await axios.delete(`http://localhost:3001/locations/${location.ID}`);
            alert('Location deleted successfully');
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    };

    const handleSearchResultClick = (item) => {
        setLocation(item);
        setIsSearchModalOpen(false);
    };

    return (
        <div className="container mt-5">
            <h2>Update Locations</h2>
            <form>
                <div className="mb-3">
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
                    <label htmlFor="owner" className="form-label">Image URL</label>
                    <input type="text" className="form-control" id="image" name="Image" value={location.Image} onChange={handleChange} required />
                </div>
            </form>

            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-primary me-2" onClick={handleSearch}>Search</button>
                <button type="button" className="btn btn-success me-2" 
                    onClick={handleUpdate} 
                    disabled={!location.ID || location.ID === ''}>
                    Update
                </button>
                <button type="button" className="btn btn-warning me-2" 
                    onClick={handleAdd} 
                    disabled={!!location.ID && location.ID !== ''}>
                    Add
                </button>
                <button type="button" className="btn btn-danger me-2" 
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
                            <div className="modal-header">
                                <h5 className="modal-title">Search Results</h5>
                                <button type="button" className="btn-close" onClick={() => setIsSearchModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row row-cols-1 row-cols-md-3 g-4">
                                    {searchResults.map(item => (
                                        <div key={item.ID} className="col">
                                            <div className="card h-100">
                                                <img src={location.Image || 'https://via.placeholder.com/150'} alt={item.Name} className="card-img-top" />
                                                <div className="card-body">
                                                    <h5 className="card-title"><a href="#" onClick={() => handleSearchResultClick(item)}>{item.Name}</a></h5>
                                                    <p className="card-text">{item.Description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateLocations;
