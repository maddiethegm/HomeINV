import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard'; // Ensure this component is imported correctly
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function UpdateInventory() {
    const [inventoryItem, setInventoryItem] = useState({
        ID: '',
        Name: '',
        Description: '',
        LocationID: '',
        Location: '',
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
        if (name === 'Location') {
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
            fetchItems(); 
            navigate('.'); 
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
            fetchItems(); 
            navigate('.'); 
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
            fetchItems(); 
            navigate('.'); 
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

    const handleClear = () => {
        setInventoryItem({
            ID: '',
            Name: '',
            Description: '',
            LocationID: '',
            Location: '',
            Bin: '',
            Quantity: 0,
            Image: ''
        });
    };

    return (
        <div className="container mt-5">
            {/* Fixed form at the top */}
            <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <h2>Update Inventory</h2>
                <form>
                    {/* Two columns for Name and Location on the left, Bin, Quantity, Image URL on the right */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name="Name" value={inventoryItem.Name} onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="location" className="form-label">Location</label>
                                <select className="form-select" id="location" name="Location" value={inventoryItem.Location} onChange={handleChange} required>
                                    <option value="">Select a location</option>
                                    {locations.map(loc => (
                                        <option key={loc.ID} value={loc.Name}>{loc.Name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="bin" className="form-label">Bin</label>
                                <input type="text" className="form-control" id="bin" name="Bin" value={inventoryItem.Bin} onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" name="Quantity" value={inventoryItem.Quantity} onChange={(e) => setInventoryItem((prevState) => ({
                                    ...prevState,
                                    Quantity: parseInt(e.target.value, 10)
                                }))} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Image URL</label>
                                <input type="text" className="form-control" id="image" value={inventoryItem.Image} onChange={handleImageChange} placeholder="Enter image URL here" required />
                            </div>
                        </div>
                    </div>

                    {/* Single column for Description */}
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" name="Description" rows="4" value={inventoryItem.Description} onChange={handleChange} required></textarea>
                    </div>

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
                        <button type="button" className="btn btn-secondary me-2" onClick={handleClear}>Clear</button>
                    </div>
                </form>
            </div>

            {/* Scrolling area for items */}
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll', marginTop: '20px' }}>
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
        </div>
    );
}

export default UpdateInventory;
