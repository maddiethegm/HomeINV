// server.js
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const { executeQuery } = require('./services/dbconnector/queryExecutor');
const { syncData } = require('./services/sync/syncService')
require('./setEnv');

/**
 * Main entry point for the application.
 */
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const setupUserRoutes = require('./userRoutes');
const setupInvRoutes = require('./invRoutes');

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

/**
 * Test connection to the SQL Server database, err out if unavailable.
 */
function sqlTest() {
    try {
        const table = '';
        const operation = 'TEST';
        const params = {};        
        const result = executeQuery(table, operation, params);
        console.log('SQL Connection test successful');
        console.log(result);
    } catch (err) {
        console.error('SQL connection unavailable', err);
    }
}

function syncTest(syncConfig) {
    try {
        syncData(syncConfig);
        console.log('Data synced to sqlite server');
    } catch (err) {
        console.error('Sync error', err)
    }
}
const newdb = {
    dbType: 'SQLITE',
    filename: 'g:/share/dev/HomeINV/inv.db'
}
sqlTest();
//syncTest(newdb);

// Setup routes
setupUserRoutes(app);
setupInvRoutes(app);

/**
 * Start the server and listen on the specified port.
 */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});