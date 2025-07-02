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
import ChangePassword from './components/ChangePassword';

function App() {
    return (
        <Router>
            <div className="app-container">
            <Navbar />
            <main className="main-content">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route exact path="/" element={
                    <ProtectedRoute>
                        <HomePage />                        
                    </ProtectedRoute>
                } />
                <Route path="/inventory-list" element={
                    <ProtectedRoute>
                        <InventoryList />                        
                    </ProtectedRoute>
                } />
                <Route path="/update-inventory" element={
                    <ProtectedRoute>
                        <UpdateInventory />                        
                    </ProtectedRoute>
                } />
                <Route path="/update-locations" element={
                    <ProtectedRoute>
                        <UpdateLocations />                        
                    </ProtectedRoute>
                } />
                <Route path="/change-password" element={
                    <ProtectedRoute>
                        <ChangePassword />                        
                    </ProtectedRoute>
                } />
                <Route path="/items/:roomName" element={
                    <ProtectedRoute>
                        <RoomItems />                        
                    </ProtectedRoute>
                } />
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
