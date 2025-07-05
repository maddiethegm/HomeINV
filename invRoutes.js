// invRoutes.js
require('dotenv').config();
const generateUUID = require('uuid').v4;
const { executeQuery, logTransaction } = require('./dbquery');
const { authenticateToken } = require('./authMiddleware');

function setupInvRoutes(app, config) {
    app.get('/api/inventory', authenticateToken, async (req, res) => {
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

    app.put('/api/inventory/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const { Name, Description, Location, Bin, Quantity, Image } = req.body;
            const query = `UPDATE Items SET Name = @Name, Description = @Description, Location = @Location, Bin = @Bin, Quantity = @Quantity, Image = @Image WHERE ID = @ID`;
            await executeQuery(config, query, { ID, Name, Description, Location, Bin, Quantity, Image });
            res.json({ success: true });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database update failed' });
        }
    });

    app.delete('/api/inventory/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const query = `DELETE FROM Items WHERE ID = @ID`;
            await executeQuery(config, query, { ID });
            res.json({ success: true });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database deletion failed' });
        }
    });

    app.post('/api/inventory', authenticateToken, async (req, res) => {
        try {
            const { Name, Description, Location, Bin, Quantity, Image } = req.body;
            const ID = generateUUID();
            const query = `INSERT INTO Items (ID, Name, Description, Location, Bin, Quantity, Image) VALUES (@ID, @Name, @Description, @Location, @Bin, @Quantity, @Image)`;
            await executeQuery(config, query, { ID, Name, Description, Location, Bin, Quantity, Image });
            res.status(201).json({ success: true });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database insertion failed' });
        }
    });

    app.get('/api/locations', authenticateToken, async (req, res) => {
        try {
            const { filterColumn, searchValue, exactMatch } = req.query;
            let query;

            if (exactMatch === 'true') {
                query = `SELECT * FROM Locations WHERE ${filterColumn} = @searchValue`;
            } else {
                query = `SELECT * FROM Locations WHERE ${filterColumn} LIKE '%' + @searchValue + '%'`;
            }

            const result = await executeQuery(config, query, { filterColumn, searchValue });
            res.json(result.recordset);
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });

    app.put('/api/locations/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const { Name, Description, Building, Owner, Image } = req.body;
            const query = `UPDATE Locations SET Name = @Name, Description = @Description, Building = @Building, Owner = @Owner, Image = @Image WHERE ID = @ID`;
            await executeQuery(config, query, { ID, Name, Description, Building, Owner, Image });
            res.json({ success: true });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database update failed' });
        }
    });

    app.delete('/api/locations/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const query = `DELETE FROM Locations WHERE ID = @ID`;
            await executeQuery(config, query, { ID });
            res.json({ success: true });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database deletion failed' });
        }
    });

    app.post('/api/locations', authenticateToken, async (req, res) => {
        try {
            const { Name, Description, Building, Owner } = req.body;
            const ID = generateUUID();
            const query = `INSERT INTO Locations (ID, Name, Description, Building, Owner) VALUES (@ID, @Name, @Description, @Building, @Owner)`;
            await executeQuery(config, query, { ID, Name, Description, Building, Owner });
            res.status(201).json({ success: true });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database insertion failed' });
        }
    });

    app.get('/api/rooms', authenticateToken, async (req, res) => {
        try {
            const query = `SELECT Name, ID FROM Rooms`; // Ensure you select the necessary fields
            const result = await executeQuery(config, query);
            res.json(result.recordset);
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });

    app.put('/api/update-quantity/:id', authenticateToken, async (req, res) => {
        try {
            const { quantity } = req.body;
            const { id } = req.params;

            const queryUpdateQuantity = `UPDATE Items SET Quantity = @Quantity WHERE ID = @ID`;
            await executeQuery(config, queryUpdateQuantity, { ID: id, Quantity: quantity });

            res.json({ message: 'Quantity updated successfully' });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            if (err.code === 'EREQUEST') {
                console.error('Database query failed:', err.originalError.info.message);
                return res.status(500).json({ error: 'Database query failed' });
            }
            console.error('Update quantity error:', err);
            res.status(500).json({ error: 'Failed to update quantity' });
        }
    });

    app.put('/api/update-out-of-stock/:id', authenticateToken, async (req, res) => {
        try {
            const { isOutOfStock } = req.body;
            const { id } = req.params;

            const queryUpdateOutofStock = `UPDATE Items SET IsOutOfStock = @IsOutOfStock WHERE ID = @ID`;
            await executeQuery(config, queryUpdateOutofStock, { ID: id, IsOutOfStock: isOutOfStock });

            res.json({ message: 'Out of Stock status updated successfully' });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
        } catch (err) {
            if (err.code === 'EREQUEST') {
                console.error('Database query failed:', err.originalError.info.message);
                return res.status(500).json({ error: 'Database query failed' });
            }
            console.error('Update out-of-stock error:', err);
            res.status(500).json({ error: 'Failed to update out-of-stock status' });
        }
    });
}

module.exports = setupInvRoutes;
