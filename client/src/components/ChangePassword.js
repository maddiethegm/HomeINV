// src/components/ChangePassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/change-password`,
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                setSuccessMessage('Password changed successfully.');
                setError(null);
                // Optionally, log the user out after password change
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(response.data.message || 'Failed to change password.');
            }
        } catch (error) {
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
