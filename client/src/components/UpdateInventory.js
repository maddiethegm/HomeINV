// src/components/UpdateInventory.js
import { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateInventory() {
    const [inventoryItem, setInventoryItem] = useState({
        ID: '',
        Name: '',
        Description: '',
        LocationID: '', // Use LocationID for database operations
        LocationName: '', // Displayed in the dropdown
        Bin: '',
        Quantity: 0,
        Image: ''
    });

    const [locations, setLocations] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:3001/locations', {
                params: { 
                    filterColumn: 'Name',
                    searchValue: ' ',
                    exactMatch: false
                }
            });
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };
    useEffect(() => {
        // Fetch locations when the component mounts
        fetchLocations();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'LocationName') {
            // Find the corresponding LocationID based on selected LocationName
            const selectedLocation = locations.find(loc => loc.Name === value);
            setInventoryItem((prevState) => ({
                ...prevState,
                [name]: value,
                LocationID: selectedLocation ? selectedLocation.ID : ''
            }));
        } else {
            setInventoryItem((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.value.trim() !== '') {
            // Validate the URL format here if needed
            setInventoryItem((prevState) => ({
                ...prevState,
                Image: e.target.value.trim()
            }));
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/inventory', {
                params: { 
                    filterColumn: 'Name',
                    searchValue: inventoryItem.Name,
                    exactMatch: false
                }
            });
            setSearchResults(response.data);
            setIsSearchModalOpen(true);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3001/inventory/${inventoryItem.ID}`, inventoryItem);
            alert('Item updated successfully');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:3001/inventory', inventoryItem);
            alert('Item added successfully');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await axios.delete(`http://localhost:3001/inventory/${inventoryItem.ID}`);
            alert('Item deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleSearchResultClick = (item) => {
        setInventoryItem(item);
        setIsSearchModalOpen(false);
    };

    return (
        <div className="container mt-5">
            <h2>Update Inventory</h2>
            <form>
                {/* Removed ID field */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="Name" value={inventoryItem.Name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="Description" rows="3" value={inventoryItem.Description} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <select className="form-select" id="location" name="LocationName" value={inventoryItem.LocationName} onChange={handleChange} required>
                        <option value="">Select a location</option>
                        {locations.map(loc => (
                            <option key={loc.ID} value={loc.Name}>{loc.Name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="bin" className="form-label">Bin</label>
                    <input type="text" className="form-control" id="bin" name="Bin" value={inventoryItem.Bin} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input type="number" className="form-control" id="quantity" name="Quantity" value={inventoryItem.Quantity} onChange={(e) => setInventoryItem((prevState) => ({
                        ...prevState,
                        Quantity: parseInt(e.target.value)
                    }))} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image URL</label>
                    <input type="text" className="form-control" id="image" value={inventoryItem.Image} onChange={handleImageChange} placeholder="Enter image URL here" required />
                </div>
            </form>

            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-primary me-2" onClick={handleSearch}>Search</button>
                <button type="button" className="btn btn-success me-2" 
                    onClick={handleUpdate} 
                    disabled={!inventoryItem.ID || inventoryItem.ID === ''}>
                    Update
                </button>
                <button type="button" className="btn btn-warning me-2" 
                    onClick={handleAdd} 
                    disabled={!!inventoryItem.ID && inventoryItem.ID !== ''}>
                    Add
                </button>
                <button type="button" className="btn btn-danger me-2" 
                    onClick={handleDelete} 
                    disabled={!inventoryItem.ID || inventoryItem.ID === ''}>
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
                                                <img src={item.Image || 'https://via.placeholder.com/150'} alt={item.Name} className="card-img-top" />
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

export default UpdateInventory;
