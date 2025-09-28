// src/App.js

/**
 * React component that serves as the main application container.
 * It handles routing using react-router-dom and renders different pages based on the URL path.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UpdateInventory from './components/UpdateInventory';
import UpdateLocations from './components/UpdateLocations';
import RoomItems from './components/RoomItems';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './services/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import backgroundGif from './tenor1.gif';
import UserManagement from './components/UserManagement';
import UserProfile from './components/UserProfile';
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
                <div className="content-container">
                    <main style={{ backgroundImage:`url(${backgroundGif})`,backgroundRepeat:"no-repeat",backgroundSize:"cover" }} className="main-content">
                        <Routes>
                        {/* Route for login page. */}
                            <Route path="/login" element={<Login />} />

                        {/* Protected route for the home page. Requires authentication. */}
                            <Route exact path="/" element={
                                <ProtectedRoute>
                                    <HomePage />                        
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
                        {/* Protected route for user editing page. Requires admin role. */}
                            <Route path="/manage-users" element={
                                <ProtectedRoute role="admin">
                                    <UserManagement />
                                </ProtectedRoute>
                            } />
                        {/* Protected route for user profile page. Requires admin role. */}
                            <Route path="/profile/:username" element={
                                <ProtectedRoute role="admin">
                                    <UserProfile />
                                </ProtectedRoute>
                            } />                 
                        </Routes>
                    </main>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
