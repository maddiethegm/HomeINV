// src/components/UserManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, updateUser } from '../services/userService'; // Import necessary functions
import useInactivity from '../services/activity';
/**
 * User Management component to display and edit users.
 *
 * @returns {JSX.Element} - The JSX element representing the user management page.
 */
function UserManagement() {
    useInactivity();
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    // Fetch all users when the component mounts
    useEffect(() => {
        fetchAllUsers();
    }, []);

    /**
     * Fetches all users from the backend.
     */
    const fetchAllUsers = async () => {
        try {
            const response = await fetchUsers(); // Use fetchUsers from userService
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load user data');
        }
    };

    /**
     * Handles editing a user.
     *
     * @param {Object} user - The user object to be edited.
     */
    const handleEdit = async (user) => {
        try {
            const response = await updateUser(user.ID, user);
            if (response.message === 'User updated successfully') {
                alert('User updated successfully');
                fetchAllUsers(); // Refresh the users list after update
            } else {
                console.error('Update error:', response);
                alert('Failed to update user');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update user');
        }
    };

    /**
     * Handles changes in the edit form.
     *
     * @param {Event} e - The input change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingUser({ ...editingUser, [name]: value });
    };

    /**
     * Handles canceling the edit operation.
     */
    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    /**
     * Handles starting to edit a user.
     *
     * @param {Object} user - The user object to start editing.
     */
    const startEditing = (user) => {
        setEditingUser({ ...user });
    };

    return (
        <div className="container mt-5">
            <h2>User Management</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Display Name</th>
                        <th>Avatar URL</th>
                        <th>UI Theme</th>
                        <th>Team</th>
                        <th>Bio</th>
                        <th>SQL_USER</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.ID}>
                            {/* ID Field */}
                            <td>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <>
                                        <button className="btn btn-success" onClick={() => handleEdit(editingUser)}>
                                            Update User
                                        </button>
                                        <button className="btn btn-secondary ms-2" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <span>{user.ID}</span>
                                )}
                            </td>

                            {/* Username Field */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <input type="text" className="form-control" name="Username" value={editingUser.Username} onChange={handleChange} />
                                ) : (
                                    user.Username
                                )}
                            </td>

                            {/* Email Field */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <input type="email" className="form-control" name="Email" value={editingUser.Email} onChange={handleChange} />
                                ) : (
                                    user.Email
                                )}
                            </td>

                            {/* Display Name Field */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <input type="text" className="form-control" name="DisplayName" value={editingUser.DisplayName} onChange={handleChange} />
                                ) : (
                                    user.DisplayName
                                )}
                            </td>

                            {/* Avatar URL Field */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <input type="text" className="form-control" name="AvatarURL" value={editingUser.AvatarURL} onChange={handleChange} />
                                ) : (
                                    user.AvatarURL
                                )}
                            </td>

                            {/* UI Theme Field */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <select className="form-select" name="UITheme" value={editingUser.UITheme} onChange={handleChange}>
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                ) : (
                                    user.UITheme
                                )}
                            </td>

                            {/* Team Field */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <input type="text" className="form-control" name="Team" value={editingUser.Team} onChange={handleChange} />
                                ) : (
                                    user.Team
                                )}
                            </td>

                            {/* Bio Field */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <textarea className="form-control" name="Bio" value={editingUser.Bio} onChange={handleChange}></textarea>
                                ) : (
                                    user.Bio
                                )}
                            </td>

                            {/* SQL_USER Checkbox */}
                            <td onDoubleClick={() => startEditing(user)}>
                                {editingUser && editingUser.ID === user.ID ? (
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" name="SQL_USER" checked={editingUser.SQL_USER} onChange={(e) => setEditingUser({ ...editingUser, SQL_USER: e.target.checked })} />
                                    </div>
                                ) : (
                                    user.SQL_USER ? 'Yes' : 'No'
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;
