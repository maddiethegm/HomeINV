// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService'; // Import the registerUser function
import useInactivity from '../services/activity';
/**
 * React component for user registration.
 * Allows users to create a new account by submitting their username, password, role, and other details.
 */
function Register() {
    useInactivity();
    /**
     * State to hold the user data input values.
     *
     * @type {[Object, Function]}
     */
    const [userData, setUserData] = useState({
        Username: '',
        Password: '',
        Role: 'user',
        Email: '',
        DisplayName: '',
        AvatarURL: '',
        UITheme: 'light',
        Team: '',
        Bio: '',
        SQL_USER: false
    });

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
        
        try {
            // Call registerUser function from userService
            await registerUser(userData);
            
            alert('Registered successfully');
            navigate('/login'); // Navigate to login page after successful registration
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : 'No response data');
            alert('Registration failed');
        }
    };

    /**
     * Updates the state based on input changes.
     *
     * @param {Event} e - The input change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
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
                    <input type="text" 
                           className="form-control" 
                           id="username" 
                           name="Username"
                           value={userData.Username} 
                           onChange={handleChange} 
                           required />
                </div>

                {/* Password input field */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" 
                           className="form-control" 
                           id="password"
                           name="Password"
                           value={userData.Password} 
                           onChange={handleChange} 
                           required />
                </div>

                {/* Role selection dropdown */}
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-select" 
                            id="role"
                            name="Role"
                            value={userData.Role} 
                            onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Email input field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" 
                           className="form-control" 
                           id="email"
                           name="Email"
                           value={userData.Email} 
                           onChange={handleChange}
                           required />
                </div>

                {/* Display Name input field */}
                <div className="mb-3">
                    <label htmlFor="displayName" className="form-label">Display Name</label>
                    <input type="text" 
                           className="form-control" 
                           id="displayName"
                           name="DisplayName"
                           value={userData.DisplayName} 
                           onChange={handleChange}
                           required />
                </div>

                {/* Avatar URL input field */}
                <div className="mb-3">
                    <label htmlFor="avatarURL" className="form-label">Avatar URL</label>
                    <input type="text" 
                           className="form-control" 
                           id="avatarURL"
                           name="AvatarURL"
                           value={userData.AvatarURL} 
                           onChange={handleChange}
                           required />
                </div>

                {/* UI Theme selection dropdown */}
                <div className="mb-3">
                    <label htmlFor="uiTheme" className="form-label">UI Theme</label>
                    <select className="form-select" 
                            id="uiTheme"
                            name="UITheme"
                            value={userData.UITheme} 
                            onChange={handleChange}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                {/* Team input field */}
                <div className="mb-3">
                    <label htmlFor="team" className="form-label">Team</label>
                    <input type="text" 
                           className="form-control" 
                           id="team"
                           name="Team"
                           value={userData.Team} 
                           onChange={handleChange}
                           required />
                </div>

                {/* Bio textarea field */}
                <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea className="form-control" 
                               id="bio"
                               name="Bio"
                               value={userData.Bio} 
                               onChange={handleChange}
                               rows="3"></textarea>
                </div>

                {/* SQL_USER checkbox */}
                <div className="mb-3 form-check">
                    <input type="checkbox" 
                           className="form-check-input"
                           id="sqlUser"
                           name="SQL_USER"
                           checked={userData.SQL_USER} 
                           onChange={(e) => setUserData({ ...userData, SQL_USER: e.target.checked })} />
                    <label className="form-check-label" htmlFor="sqlUser">Bypass LDAP authentication</label>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-success">Register</button>
            </form>
        </div>
    );
}

export default Register;
