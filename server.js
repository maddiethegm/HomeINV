// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
/**
 * Main entry point for the application.
 */

const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const setupAuthRoutes = require('./authRoutes')
const setupInvRoutes = require('./invRoutes')
const setupReportRoutes = require('./reportRoutes')

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
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,POST,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// SQL Server Configuration
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
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
setupAuthRoutes(app);
setupInvRoutes(app);
setupReportRoutes(app);

/**
 * Start the server and listen on the specified port.
 */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
