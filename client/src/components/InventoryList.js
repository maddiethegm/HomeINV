// src/components/InventoryList.js

/**
 * React component that displays a list of inventory items.
 * It allows filtering and searching through items based on user input.
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

/**
 * InventoryList component.
 *
 * @returns {JSX.Element} - The JSX element representing the inventory list interface.
 */
function InventoryList() {
    /**
     * State to hold the list of items fetched from the server.
     * @type {[Object[], function]}
     */
    const [items, setItems] = useState([]);

    /**
     * State to hold the column used for filtering items (e.g., 'Name', 'Description', 'Location').
     * @type {[string, function]}
     */
    const [filterColumn, setFilterColumn] = useState('Name');

    /**
     * State to hold the search value entered by the user.
     * @type {[string, function]}
     */
    const [searchValue, setSearchValue] = useState('');

    /**
     * State to determine if the search should match exactly or not.
     * @type {[boolean, function]}
     */
    const [exactMatch, setExactMatch] = useState(false);

    /**
     * Effect hook to fetch items when filterColumn, searchValue, or exactMatch changes.
     */
    useEffect(() => {
// This throws a linting error but fetchItems() is defined above and this works
// eslint-disable-next-line
        fetchItems();
    }, [filterColumn, searchValue, exactMatch]); // Dependency array to trigger fetchItems

    /**
     * Function to fetch items from the server based on current filters and search criteria.
     *
     * @async
     * @returns {void}
     */
    const fetchItems = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/api/inventory', {
                params: { filterColumn, searchValue, exactMatch }
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    /**
     * Handler function to update the filter column based on user selection.
     *
     * @param {Event} e - The event object from the select input.
     */
    const handleFilterChange = (e) => {
        setFilterColumn(e.target.value);
    };

    /**
     * Handler function to update the search value as the user types in the input field.
     *
     * @param {Event} e - The event object from the input field.
     */
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    /**
     * Handler function to toggle exact match mode on and off.
     *
     * @param {Event} e - The event object from the checkbox input.
     */
    const handleExactMatchChange = (e) => {
        setExactMatch(e.target.checked);
    };

    return (
        <div className="container">
            <h2>Inventory List</h2>
            <div className="mb-3">
                <label htmlFor="filterColumn" className="form-label">Filter by:</label>
                <select id="filterColumn" className="form-select" value={filterColumn} onChange={handleFilterChange}>
                    <option value="Name">Name</option>
                    <option value="Description">Description</option>
                    <option value="Location">Location</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="searchValue" className="form-label">Search Value:</label>
                <input type="text" id="searchValue" className="form-control" value={searchValue} onChange={handleSearchChange} />
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" id="exactMatch" className="form-check-input" checked={exactMatch} onChange={handleExactMatchChange} />
                <label htmlFor="exactMatch" className="form-check-label">Exact Match</label>
            </div>

            {/* Display inventory items as cards */}
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {items.map(item => (
                    <div key={item.ID} className="col-md-4 mb-4">
                        <ItemCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InventoryList;
