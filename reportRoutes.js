// reportRoutes.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./authMiddleware');
const { executeQuery } = require('./dbquery');

function setupReportRoutes(app, config) {
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
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });

    app.get('/api/reports/transactions', authenticateToken, async (req, res) => {
        try {
            const { filterColumn, searchValue, exactMatch } = req.query;
            let query;

            if (exactMatch === 'true') {
                query = `SELECT * FROM Transactions WHERE ${filterColumn} = @searchValue`;
            } else {
                query = `SELECT * FROM Transactions WHERE ${filterColumn} LIKE '%' + @searchValue + '%'`;
            }

            const result = await executeQuery(config, query, { filterColumn, searchValue });
            res.json(result.recordset);
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });
}

module.exports = setupReportRoutes;
