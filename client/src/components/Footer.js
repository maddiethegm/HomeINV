// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer text-center py-3">
            <div className="container d-flex justify-content-between align-items-center">
                {/* Image on one side */}
                <img
                    src="https://i.imgur.com/UUzSHTQ.gif" // Replace with the actual path to your image
                    alt="Your Company Logo"
                    style={{ height: '60px' }} // Adjust the size as needed
                />
                
                {/* Support contact info on the other side */}
                <div>
                    <p className="mb-0">Be gay, do crime</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
