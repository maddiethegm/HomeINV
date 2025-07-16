// src/components/Navbar.js

/**
 * React component that renders the footer of the application.
 * Contains support contact information and a logo (commented out).
 */
function Footer() {
    const imageUrl = process.env.REACT_APP_FOOTER_IMG_URL;
    const supportContact = process.env.REACT_APP_SUPPORT_CONTACT;
    return (
        <footer className="footer glassy-footer text-center py-3">
            <div className="container d-flex justify-content-between ">
                {/* Image on one side */} 
                    <img
                        src={imageUrl}
                        alt="Praise the sun"
                        style={{ height: '70px', }} // Adjust the size as needed
                    />               
                {/* Support contact info on the other side */}
                <div>
                    <p className="mb-0">For support, contact {supportContact}</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
