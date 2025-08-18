import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Displays a list of items.
 *
 * @param {Array} props.items - The array of items to display.
 * @param {Function} props.onModify - Callback function when an item is modified.
 * @param {boolean} props.scrollable - Whether the list should be scrollable.
 */
function ItemList({ items, onModify, scrollable, filterParams }) {
    const filteredItems = items.filter(item =>
        (!filterParams.Name || (item && item.Name?.toLowerCase().includes(filterParams.Name.toLowerCase()))) &&
        (!filterParams.Location || (item && item.Location?.toLowerCase().includes(filterParams.Location.toLowerCase()))) &&
        (!filterParams.Bin || (item && item.Bin?.toLowerCase().includes(filterParams.Bin.toLowerCase())))
    );
    const containerStyle = {
        maxHeight: '3000px',
        overflowY: 'auto'
    };

    return (
        <div style={scrollable ? containerStyle : {}}>
            <div className="row">
                {filteredItems.map(item => (
                    <div key={item.ID} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={item.Image || 'https://via.placeholder.com/150'} alt={item.Name} className="card-img-top" style={{ height: '120px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{item.Name}</h5>
                                <p className="card-text"><strong>Location:</strong> {item.Location}</p>
                                <p className="card-text"><strong>Bin:</strong> {item.Bin}</p>
                                <p className="card-text"><strong>Quantity:</strong> {item.Quantity}</p>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                                <button type="button" className="btn btn-success me-2" onClick={() => onModify(item)}>Modify</button>
                                {/* You can add more actions like view details, etc., here */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemList;
