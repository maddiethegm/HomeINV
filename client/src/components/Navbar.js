// src/components/Navbar.js

/**
 * React component for the navigation bar.
 * It displays different links based on whether a user is authenticated or not.
 */
import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Navbar component.
 *
 * @returns {JSX.Element} - The JSX element representing the navigation bar.
 */
function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let decodedToken;

    if (token) {
        try {
            decodedToken = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            // Handle decoding error
            console.error('Error decoding token:', error);
        }
    }

    /**
     * Handles user logout by removing the token from local storage and navigating to the login page.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <nav className="navbar glassy-navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* Hamburger button for toggling sidebar 
                <button className="btn btn-primary me-2" data-bs-toggle="offcanvas" onClick={toggleSidebar} role="button">
                    ☰
                </button>*/}
                <Link className="navbar-brand nav-dark me-2" to="/">Inventory Home</Link>
                {token && decodedToken ? (
                    <>
                        <ul className="navbar-nav d-flex flex-row-reverse">
                            <li className="nav-item">
                                <Link className="btn nav-light" to="/update-inventory">Items</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn nav-light" to="/update-locations">Locations</Link>
                            </li>
                            {decodedToken.role === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <Link className="btn nav-light" to="/register">Add User</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn nav-light" to="/manage-users">Manage Users</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/inventory-list">Inventory Search</Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
