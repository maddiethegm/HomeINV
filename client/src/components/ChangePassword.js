// src/components/ChangePassword.js
// This component is broken and unused but left in place as a reminder to fix it
/**
 * React component for changing user password.
 */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Main change password component.
 *
 * @returns {JSX.Element} - The JSX element representing the change password form.
 */
const ChangePassword = () => {
    /**
     * State to hold current password input value.
     */
    const [currentPassword, setCurrentPassword] = useState('');

    /**
     * State to hold new password input value.
     */
    const [newPassword, setNewPassword] = useState('');

    /**
     * State to hold confirm password input value.
     */
    const [confirmPassword, setConfirmPassword] = useState('');

    /**
     * State to store any error messages.
     */
    const [error, setError] = useState(null);

    /**
     * State to store success message after successful password change.
     */
    const [successMessage, setSuccessMessage] = useState(null);

    /**
     * Navigate hook from react-router-dom for programmatic navigation.
     */
    const navigate = useNavigate();

    /**
     * Function to handle the password change form submission.
     *
     * @param {Event} e - The form submit event.
     */
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            // Retrieve the auth token from local storage
            const token = localStorage.getItem('token');
            
            // Make a PUT request to update the password
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/change-password`,
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Handle successful password change
            if (response.status === 200) {
                setSuccessMessage('Password changed successfully.');
                setError(null);
                
                // Optionally log the user out after password change
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(response.data.message || 'Failed to change password.');
            }
        } catch (error) {
            // Handle any errors during the password change request
            setError(error.response ? error.response.data.message : 'An error occurred while changing the password.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Change Password</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                    <label htmlFor="current-password" className="form-label">Current Password</label>
                    <input type="password" className="form-control" id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="new-password" className="form-label">New Password</label>
                    <input type="password" className="form-control" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
