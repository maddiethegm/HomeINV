// src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg ">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Inventory App</Link>
                {token && decodedToken ? (
                    <>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/"></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/update-inventory">Items</Link>
                            </li>
                            {decodedToken.role === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Add User</Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/update-locations">Update Locations</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
