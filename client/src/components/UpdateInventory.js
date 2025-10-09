// src/components/UpdateInventory.js
import React, { useState, useEffect } from 'react';
import ItemList from './subcomponents/ItemGrid';
import { useLocation, useNavigate } from 'react-router-dom';
import * as itemsService from '../services/itemsService';
import * as locationsService from '../services/locationsService';
import { initialItemState } from '../models/Items';
import { initialLocationState } from '../models/Locations';
import useInactivity from '../services/activity';
/**
 * UpdateInventory component for managing inventory items.
 * This component allows users to update, add, and delete inventory items.
 */
function UpdateInventory() {
    useInactivity();
    // State to hold the current inventory item being edited or added
    const [inventoryItem, setInventoryItem] = useState(initialItemState);

    // State to hold all available locations
    const [locations, setLocations] = useState([initialLocationState]);

    // State to hold all items fetched from the server
    const [items, setItems] = useState([]);

    // React Router location hook to access route parameters and state
    const location = useLocation();

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
     * Fetches all inventory items from the server and updates the `items` state.
     */
    const fetchItems = async () => {
        try {
            const fetchedItems = await itemsService.fetchItems();
            setItems(fetchedItems);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    /**
     * Handles changes to input fields within the form.
     *
     * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - The change event object.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
            setInventoryItem((prevState) => ({
                ...prevState,
                [name]: value
            }));
    };

    /**
     * Handles changes to the image input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object.
     */
    const handleImageChange = (e) => {
        if (e.target.value.trim() !== '') {
            setInventoryItem((prevState) => ({
                ...prevState,
                Image: e.target.value.trim()
            }));
        }
    };

    /**
     * Performs a search for inventory items based on the current name in `inventoryItem`.
     */
    // Handle search
    const handleSearch = async () => {
        try {
            const fetchedItems = await itemsService.fetchItems(inventoryItem);
            setItems(fetchedItems);
        } catch (error) {
            console.error('Error searching items:', error);
        }
    };

    /**
     * Handles the update of an existing inventory item.
     */
    const handleUpdate = async () => {
        try {
            await itemsService.updateItem(inventoryItem.ID, inventoryItem);
            alert('Item updated successfully');
            fetchItems(); 
            navigate('.'); 
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    /**
     * Handles the addition of a new inventory item.
     */
    const handleAdd = async () => {
        try {
            await itemsService.addItem(inventoryItem);
            alert('Item added successfully');
            fetchItems(); 
            navigate('.'); 
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    /**
     * Handles the deletion of an inventory item.
     */
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await itemsService.deleteItem(inventoryItem.ID);
            alert('Item deleted successfully');
            fetchItems(); 
            navigate('.'); 
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    
    /**
     * Handles modification of an item by navigating to the update page with the item's details.
     *
     * @param {Object} item - The inventory item to modify.
     */
    const handleModify = (item) => {
        navigate('/update-inventory', { state: item, replace: true });
    };

    /**
     * Clears all fields in the form by resetting the `inventoryItem` state.
     */
    const handleClear = () => {
        setInventoryItem(initialItemState);
        inventoryItem.Quantity = '';
        fetchItems(inventoryItem);
    };

    useEffect(() => {
        if (location.state) {
            setInventoryItem(location.state);
        }

        fetchLocations();
        fetchItems();
    }, [location]);

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

                {/* Full Grid of All Items */}
            <ItemList items={items} onModify={handleModify} scrollable={false}/>
            </div>
        </div>
    );
}

export default UpdateInventory;
