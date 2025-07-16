// src/App.js

/**
 * React component that serves as the main application container.
 * It handles routing using react-router-dom and renders different pages based on the URL path.
 */
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
import ItemsReport from './components/reports/ItemsReport';
import TransactionsReport from './components/reports/TransactionsReport';

/**
 * Main application component.
 *
 * @returns {JSX.Element} - The JSX element representing the app's layout and routing structure.
 */
function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        {/* Route for login page. */}
                        <Route path="/login" element={<Login />} />

                        {/* Route for items report page. */}
                        <Route path="/items-report" element={<ItemsReport />} />

                        {/* Route for transactions report page. */}
                        <Route path="/transactions-report" element={<TransactionsReport />} />

                        {/* Protected route for the home page. Requires authentication. */}
                        <Route exact path="/" element={
                            <ProtectedRoute>
                                <HomePage />                        
                            </ProtectedRoute>
                        } />

                        {/* Protected route for inventory list page. Requires authentication. */}
                        <Route path="/inventory-list" element={
                            <ProtectedRoute>
                                <InventoryList />                        
                            </ProtectedRoute>
                        } />

                        {/* Protected route for update inventory page. Requires authentication. */}
                        <Route path="/update-inventory" element={
                            <ProtectedRoute>
                                <UpdateInventory />                        
                            </ProtectedRoute>
                        } />

                        {/* Protected route for update locations page. Requires authentication. */}
                        <Route path="/update-locations" element={
                            <ProtectedRoute>
                                <UpdateLocations />                        
                            </ProtectedRoute>
                        } />

                        {/* Protected route for change password page. Requires authentication. */}
                        <Route path="/change-password" element={
                            <ProtectedRoute>
                                <ChangePassword />                        
                            </ProtectedRoute>
                        } />

                        {/* Protected route for room items page. Requires authentication and takes a `roomName` parameter. */}
                        <Route path="/items/:roomName" element={
                            <ProtectedRoute>
                                <RoomItems />                        
                            </ProtectedRoute>
                        } />

                        {/* Protected route for registration page. Requires admin role. */}
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
