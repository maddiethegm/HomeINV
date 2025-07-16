// src/components/Register.js

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * React component for user registration.
 * Allows users to create a new account by submitting their username, password, and role.
 */
function Register() {
    /**
     * State to hold the username input value.
     *
     * @type {[string, Function]}
     */
    const [Username, setUsername] = useState('');

    /**
     * State to hold the password input value.
     *
     * @type {[string, Function]}
     */
    const [Password, setPassword] = useState('');

    /**
     * State to hold the user role selection (either 'user' or 'admin').
     *
     * @type {[string, Function]}
     */
    const [Role, setRole] = useState('user');

    /**
     * Hook to navigate programmatically within the application.
     */
    const navigate = useNavigate();

    /**
     * Handles form submission for user registration.
     *
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Sending data:', { Username, Password, Role }); // Add this line for debugging

        try {
            /**
             * API request to register a new user.
             *
             * @type {Object}
             */
            const response = await axios.post( 
                process.env.REACT_APP_API_URL + '/auth/register', 
                { Username, Password, Role },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log('Registration Response:', response.data);
            alert('Registered successfully');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : 'No response data');
            alert('Registration failed');
        }
    };

    /**
     * JSX to render the registration form.
     *
     * @returns {JSX.Element} - The JSX element representing the register form.
     */
    return (
        <div className="container mt-5">
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                {/* Username input field */}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" value={Username} onChange={(e) => setUsername(e.target.value)} required />
                </div>

                {/* Password input field */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={Password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {/* Role selection dropdown */}
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-select" id="role" value={Role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-success">Register</button>
            </form>
        </div>
    );
}

export default Register;
