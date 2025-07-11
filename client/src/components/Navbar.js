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
        <nav className="navbar glassy-navbar navbar-expand-lg ">
            <div className="container-fluid">
                <Link className="navbar-brand nav-dark" to="/">Inventory Home</Link>
                {token && decodedToken ? (
                    <>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-light">
                            <li className="nav-item">
                                <Link className="nav-light nav-link" to="/"></Link>
                            </li>
                            <li>
                                <Link className="nav-light nav-link" to="/items-report">Items Report</Link>
                            </li>
                            <li>
                                <Link className="nav-light nav-link" to="/transactions-report">Transactions Report</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link nav-light" to="/update-inventory">Items</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link nav-light" to="/update-locations">Locations</Link>
                            </li>
                            {decodedToken.role === 'admin' && (
                                <>

                                    <li className="nav-item">
                                        <Link className="nav-link nav-light" to="/register">Add User</Link>
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
