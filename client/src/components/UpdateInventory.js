// src/components/UpdateInventory.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard'; // Import ItemCard component
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
    const [items, setItems] = useState([]); // State to hold all items
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize inventoryItem with data from route state if available
        if (location.state) {
            setInventoryItem(location.state);
        }

        fetchLocations();
        fetchItems();
    }, [location]);

    const fetchLocations = async () => {
        try {
            const response = await api.get('/locations', {
                params: { 
                    filterColumn: 'Name',
                    searchValue: '',
                    exactMatch: false
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await api.get('/inventory', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: { 
                    filterColumn: 'Name',
                    searchValue: '',
                    exactMatch: false
                }
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'LocationName') {
            // Find the corresponding LocationID based on selected LocationName
            const selectedLocation = locations.find(loc => loc.Name === value);
            setInventoryItem((prevState) => ({
                ...prevState,
                [name]: value, // Update LocationName
                Location: selectedLocation ? selectedLocation.Name : ''
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
            const response = await api.get('/inventory', {
                params: { 
                    filterColumn: 'Name',
                    searchValue: inventoryItem.Name,
                    exactMatch: false
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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
            await api.put(`/inventory/${inventoryItem.ID}`, inventoryItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Item updated successfully');
            fetchItems(); // Re-fetch the item list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleAdd = async () => {
        try {
            await api.post('/inventory', inventoryItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Item added successfully');
            fetchItems(); // Re-fetch the item list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/inventory/${inventoryItem.ID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Item deleted successfully');
            fetchItems(); // Re-fetch the item list
            navigate('.'); // Navigate back to self without state
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleSearchResultClick = (item) => {
        setInventoryItem(item);
        setIsSearchModalOpen(false);
    };
    
    const handleModify = (item) => {
        navigate('/update', { state: item, replace: true });
    };

    
    return (
        <div className="container mt-5">
            {/* <h2>Update Inventory</h2> */}
            <div className="row">
                <div className="col-md-8">
                    <form>
                        <div className="d-flex flex-column mb-3">
                            <div className="mb-4">
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
                        </div>
                    </form>

                    {/* Buttons Container */}
                    <div className="mb-4 d-flex justify-content-between">
                        <button type="button" className="btn btn-primary me-2" onClick={handleSearch}>Search</button>
                        <button 
                            type="button" 
                            className="btn btn-success me-2" 
                            onClick={() => inventoryItem.ID ? handleUpdate() : handleAdd()} 
                            disabled={inventoryItem.Name === ''}>
                            {inventoryItem.ID ? 'Update' : 'Add'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-danger me-2" 
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
                                    <div className="modal-header justify-content-between">
                                        <h5 className="modal-title">Search Results</h5>
                                        <button type="button" class="close" onClick={() => setIsSearchModalOpen(false)}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row row-cols-1 row-cols-md-3 g-4">
                                            {searchResults.map(item => (
                                                <div key={item.ID} className="col">
                                                    <ItemCard item={item} onModify={() => handleModify(item)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Full Grid of All Items */}
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {items.map(item => (
                            <div key={item.ID} className="col">
                                <ItemCard item={item} onModify={() => handleModify(item)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Preview */}
                <div className="col-md-4">
                    {inventoryItem.Image && (
                        <img
                            src={inventoryItem.Image}
                            alt="Item"
                            style={{ width: '100%', height: 'auto', border: '2px solid #ccc', borderRadius: '5px' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default UpdateInventory;