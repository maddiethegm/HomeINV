// server.js
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
require('./setEnv');
/**
 * Main entry point for the application.
 */
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const setupUserRoutes = require('./userRoutes')
const setupInvRoutes = require('./invRoutes')


/**
 * Middleware to parse JSON bodies.
 */
app.use(bodyParser.json({ limit: '5mb' }));

/**
 * Middleware to parse URL-encoded bodies.
 */
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

/**
 * CORS middleware configuration.
 */
app.use(cors());

// SQL Server Configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

/**
 * Test connection to the SQL Server database, err out if unavailable.
 */
sql.connect(config, err => {
    if (err) throw err;
    console.log('Connected to SQL Server');
});

// Setup routes
setupUserRoutes(app);
setupInvRoutes(app);


/**
 * Start the server and listen on the specified port.
 */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});