
import ItemCard from './ItemCard';

/**
 * Displays a list of items.
 *
 * @param {Array} props.items - The array of items to display.
 * @param {Function} props.onModify - Callback function when an item is modified.
 * @param {boolean} props.scrollable - Whether the list should be scrollable.
 */
function ItemList({ items, onModify, scrollable }) {
    const containerStyle = {
        maxHeight: '3000px',
        overflowY: 'auto'
    };

    return (
        <div style={scrollable ? containerStyle : {}}>
            <div className="row">
                {items.map(item => (
                    <div key={item.ID} className="col-md-4 mb-4">
                        <ItemCard item={item} onModify={() => onModify(item)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemList;
