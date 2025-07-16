// src/components/Navbar.js

/**
 * React component that renders the footer of the application.
 * Contains support contact information and a logo (commented out).
 */
function Footer() {
    return (
        <footer className="footer glassy-footer text-center py-3">
            <div className="container d-flex justify-content-between ">
                {/* Image on one side */}
                {/* 
                    <img
                        src="https://i.imgur.com/UUzSHTQ.gif" // Replace with the actual path to your image
                        alt="Your Company Logo"
                        style={{ height: '70px', }} // Adjust the size as needed
                    />
                */}                

                {/* Support contact info on the other side */}
                <div>
                    <p className="mb-0">Be gay, do crime</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
