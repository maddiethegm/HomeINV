// src/Components/Reports/ItemsReport.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemsReport = () => {
    const [items, setItems] = useState([]);
    const [filterColumn, setFilterColumn] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [exactMatch, setExactMatch] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/reports/items', {
                params: {
                    filterColumn,
                    searchValue,
                    exactMatch
                }
            });
            setItems(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Items Report</h2>
            <div>
                <label htmlFor="filterColumn">Filter Column:</label>
                <input
                    type="text"
                    id="filterColumn"
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="searchValue">Search Value:</label>
                <input
                    type="text"
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="exactMatch">
                    <input
                        type="checkbox"
                        id="exactMatch"
                        checked={exactMatch}
                        onChange={(e) => setExactMatch(e.target.checked)}
                    />
                    Exact Match
                </label>
            </div>
            <button onClick={fetchItems}>Fetch Items</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Bin</th>
                        <th>Quantity</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.ID}>
                            <td>{item.ID}</td>
                            <td>{item.Name}</td>
                            <td>{item.Description}</td>
                            <td>{item.Location}</td>
                            <td>{item.Bin}</td>
                            <td>{item.Quantity}</td>
                            <td>{item.Image ? <img src={item.Image} alt="Item" width="50" /> : null}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsReport;
