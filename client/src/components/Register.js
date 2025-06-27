import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [Role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Sending data:', { Username, Password, Role }); // Add this line for debugging
        try {
            const response = await axios.post('http://localhost:3001/auth/register', { Username, Password, Role });
            console.log('Registration Response:', response.data);
            alert('Registered successfully');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : 'No response data');
            alert('Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" value={Username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={Password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-select" id="role" value={Role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success">Register</button>
            </form>
        </div>
    );
}

export default Register;
