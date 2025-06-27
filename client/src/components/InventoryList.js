// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

function InventoryList() {
    const [items, setItems] = useState([]);
    const [filterColumn, setFilterColumn] = useState('Name');
    const [searchValue, setSearchValue] = useState('');
    const [exactMatch, setExactMatch] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [filterColumn, searchValue, exactMatch]); // Dependency array to trigger fetchItems

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:3001/inventory', {
                params: { filterColumn, searchValue, exactMatch }
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilterColumn(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

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
