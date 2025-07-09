// src/Components/Reports/ItemsReport.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ItemCard from '../ItemCard'; // Assuming you have a common ItemCard component
import { useLocation, useNavigate } from 'react-router-dom';

const ItemsReport = () => {
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
    const [filterColumn, setFilterColumn] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [exactMatch, setExactMatch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const fetchItems = async () => {
        try {
            const response = await api.get('/reports/items', {
                params: { filterColumn, searchValue, exactMatch },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setItems(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // Initialize inventoryItem with data from route state if available
        if (location.state) {
            setInventoryItem(location.state);
        }

//        fetchLocations();
        fetchItems();
    }, [location]);
    const handleSearch = async () => {
        await fetchItems();
    };

    const handleClearFilters = () => {
        setFilterColumn('');
        setSearchValue('');
        setExactMatch(false);
        fetchItems(); // Refetch with cleared filters
    };

    return (
        <div className="container mt-5">
            <h2>Items Report</h2>
            
            {/* Search Filters */}
            <div className="d-flex mb-3">
                <div className="me-3">
                    <label htmlFor="filterColumn" className="form-label">Filter Column:</label>
                    <input
                        type="text"
                        id="filterColumn"
                        value={filterColumn}
//                        onChange={(e) => setFilterColumn(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="me-3">
                    <label htmlFor="searchValue" className="form-label">Search Value:</label>
                    <input
                        type="text"
                        id="searchValue"
                        value={searchValue}
//                        onChange={(e) => setSearchValue(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="me-3">
                    <label htmlFor="exactMatch" className="form-label">
                        <input
                            type="checkbox"
                            id="exactMatch"
                            checked={exactMatch}
                            onChange={(e) => setExactMatch(e.target.checked)}
                        />{' '}
                        Exact Match
                    </label>
                </div>
                <button className="btn btn-primary me-2" onClick={handleSearch}>Search</button>
                <button className="btn btn-secondary" onClick={handleClearFilters}>Clear Filters</button>
            </div>

            {/* Items Grid */}
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {items.map(item => (
                    <div key={item.ID} className="col">
                        <ItemCard item={item} onModify={() => navigate(`/update`, { state: item, replace: true })} />
                    </div>
                ))}
            </div>

            {/* No Results Message */}
            {!items.length && (
                <p>No items found.</p>
            )}
        </div>
    );
};

export default ItemsReport;
