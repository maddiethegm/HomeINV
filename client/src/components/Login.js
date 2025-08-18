// src/components/Login.js

/**
 * React component for handling user login.
 * It provides a form where users can input their username and password to log in.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService'; // Import the loginUser function

/**
 * Login component function.
 *
 * @returns {JSX.Element} - The JSX element representing the login form.
 */
function Login() {
    /**
     * State hook for storing the username input value.
     *
     * @type {[string, Function]}
     */
    const [Username, setUsername] = useState('');

    /**
     * State hook for storing the password input value.
     *
     * @type {[string, Function]}
     */
    const [password, setPassword] = useState('');

    /**
     * Navigation function from react-router-dom to redirect users after login.
     *
     * @type {Function}
     */
    const navigate = useNavigate();

    /**
     * Asynchronous function to handle form submission for user login.
     *
     * @param {Event} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            /**
             * Using the loginUser function from userService to authenticate the user.
             *
             * @type {Object}
             */
            const response = await loginUser({ Username, password });

            /**
             * Extracting the token from the response data.
             *
             * @type {string}
             */
            const token = response.token;

            /**
             * Storing the token in localStorage for future requests.
             */
            localStorage.setItem('token', token);

            /**
             * Alerting the user of successful login and redirecting to the home page.
             */
            alert('Logged in successfully');
            navigate('/');
        } catch (error) {
            /**
             * Logging any errors that occur during the login process.
             *
             * @type {Error}
             */
            console.error('Login error:', error);

            /**
             * Alerting the user with an invalid credentials message.
             */
            alert('Invalid credentials');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {/* Form group for username input */}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" 
                           className="form-control" 
                           id="username" 
                           value={Username} 
                           onChange={(e) => setUsername(e.target.value)} 
                           required />
                </div>

                {/* Form group for password input */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" 
                           className="form-control" 
                           id="password" 
                           value={password} 
                           onChange={(e) => setPassword(e.target.value)} 
                           required />
                </div>

                {/* Login button */}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default Login;
