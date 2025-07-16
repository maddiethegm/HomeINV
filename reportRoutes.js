// reportRoutes.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./authMiddleware');
const { executeQuery, logTransaction } = require('./dbquery');

/**
 * Sets up report routes for app.
 *
 * @param {import('express').Application} app - The Express application object.
 * @param {object} config - Configuration settings for the database connection.
 */
function setupReportRoutes(app, config) {
    /**
     * Route to get items based on query parameters.
     * 
     * Because this function doesn't write anything, we only log the transaction if LOGGING=high
     * 
     * @route GET /api/reports/items
     * @param {string} req.query.filterColumn - The column to filter by.
     * @param {string} req.query.searchValue - The value to search for.
     * @param {boolean} req.query.exactMatch - Whether to perform an exact match.
     */
    app.get('/api/reports/items', authenticateToken, async (req, res) => {
        try {
            const { filterColumn, searchValue, exactMatch } = req.query;
            let query;

            if (exactMatch === 'true') {
                query = `SELECT * FROM Items WHERE ${filterColumn} = @searchValue`;
            } else {
                query = `SELECT * FROM Items WHERE ${filterColumn} LIKE '%' + @searchValue + '%'`;
            }

            const result = await executeQuery(config, query, { filterColumn, searchValue });
            res.json(result.recordset);

            // Log the transaction after sending the response
            try {
                if (process.env.LOGGING === 'high') {
                    logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
                }
            } catch (logErr) {
                console.error("Error logging transaction:", logErr);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });

    /**
     * Route to get transactions based on query parameters.
     * 
     * Because this function doesn't write anything, we only log the transaction if LOGGING=high
     * 
     * @route GET /api/reports/transactions
     * @param {string} req.query.filterColumn - The column to filter by.
     * @param {string} req.query.searchValue - The value to search for.
     * @param {boolean} req.query.exactMatch - Whether to perform an exact match.
     */
    app.get('/api/reports/transactions', authenticateToken, async (req, res) => {
        try {
            const { filterColumn, searchValue, exactMatch } = req.query;
            let query;

            if (exactMatch === 'true') {
                query = `SELECT * FROM Transactions WHERE ${filterColumn} = @searchValue`;
            } else {
                query = `SELECT * FROM Transactions WHERE ${filterColumn} LIKE '%' + @searchValue + '%' ORDER BY Timestamp DESC`;
            }

            const result = await executeQuery(config, query, { filterColumn, searchValue });
            res.json(result.recordset);

            // Log the transaction after sending the response
            try {
                if (process.env.LOGGING === 'high') {
                    logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
                }
            } catch (logErr) {
                console.error("Error logging transaction:", logErr);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });
}

module.exports = setupReportRoutes;
