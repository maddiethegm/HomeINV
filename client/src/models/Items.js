// src/models/Items.js
import React from 'react';

export const initialItemState = {
    Name: '',
    Description: '',
    Location: '',
    Bin: '',
    Quantity: 0,
    Image: '',
    Owner: ''
};

export default function useItems(initialItems = []) {
    const [items, setItems] = React.useState(initialItems);

    // Method to add a new item
    const addItem = (newItem) => {
        setItems([...items, newItem]);
    };

    // Method to update an existing item
    const updateItem = (updatedItem) => {
        setItems(items.map(item => item.ID === updatedItem.ID ? updatedItem : item));
    };

    // Method to delete an item
    const deleteItem = (itemId) => {
        setItems(items.filter(item => item.ID !== itemId));
    };

    return { items, addItem, updateItem, deleteItem };
}
