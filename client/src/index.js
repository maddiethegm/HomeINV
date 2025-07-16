// src/index.js
/**
 * Entry point for the React application.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import './index.css';
import './App.css';

import reportWebVitals from './reportWebVitals';

/**
 * Creates a root for rendering the app and renders the main component.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

/**
 * Optional: Function to measure performance of the application.
 *
 * @param {function} onPerfEntry - A function that takes a performance entry as an argument.
 */
reportWebVitals(onPerfEntry => {
    // Example usage:
    console.log(onPerfEntry);
});
