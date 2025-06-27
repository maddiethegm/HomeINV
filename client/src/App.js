// src/App.js
//import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryList from './components/InventoryList';
import HomePage from './components/HomePage';
import UpdateInventory from './components/UpdateInventory';
import UpdateLocations from './components/UpdateLocations';
import RoomItems from './components/RoomItems';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


function App() {
//    useEffect(() => {
//        const socket = require('socket.io-client')('http://localhost:3001'); // Replace with your server URL
//
//        socket.on('connect', () => {
//            console.log(`Connected to socket server`);
//        });
//
//        socket.on('itemUpdated', (data) => {
//            console.log('Item updated:', data);
//            // You can refresh the list or update specific items here
//            // For example, you could dispatch a Redux action or update the component state
//        });
//
//        return () => {
//            socket.disconnect();
//        };
//    }, []);
    return (
        <Router>
            <div className="app-container">
            <Navbar />
            <main className="main-content">
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/inventory-list" element={<InventoryList />} />
                <Route path="/update-inventory" element={<UpdateInventory />} />
                <Route path="/update-locations" element={
                    <ProtectedRoute>
                        <UpdateLocations />                        
                    </ProtectedRoute>
                } />
                <Route path="/items/:roomName" element={<RoomItems />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={
                    <ProtectedRoute role="admin">
                        <Register />
                    </ProtectedRoute>
                } />                
            </Routes>
            </main>
            <Footer />
            </div>
        </Router>
    );
}

export default App;
