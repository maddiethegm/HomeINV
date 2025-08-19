// invRoutes.js

require('dotenv').config();
const generateUUID = require('uuid').v4;
const { executeQuery, logTransaction } = require('./dbquery');
const { authenticateToken } = require('./authMiddleware');

/**
 * Sets up inventory routes for app.
 *
 * @param {import('express').Application} app - The Express application object.
 * @param {object} config - Configuration settings for the database connection.
 */
function setupInvRoutes(app, config) {
    /**
     * Route to get inventory items based on query parameters.
     * Next up to-do: filter by multiple columns
     *
     * @route GET /api/inventory
     * @param {string} req.query.filterColumn - The column to filter by.
     * @param {string} req.query.searchValue - The value to search for.
     * @param {boolean} req.query.exactMatch - Whether to perform an exact match.
     */
    app.get('/api/inventory', authenticateToken, async (req, res) => {
        try {
            const { filterColumn, searchValue, exactMatch } = req.query;
            let query;

            if (exactMatch === 'true') {
                query = `SELECT * FROM Items WHERE ${filterColumn} = @searchValue`;
            } else {
                query = `SELECT * FROM Items WHERE CONCAT('%', ${filterColumn}, '%') LIKE CONCAT('%', @searchValue, '%')`;
            }

            const result = await executeQuery(config, query, { filterColumn, searchValue });
            res.json(result.recordset);
            if (process.env.LOGGING === 'high') {
                logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });

    /**
     * Route to update an inventory item.
     *
     * @route PUT /api/inventory/:ID
     * @param {string} req.params.ID - The ID of the item to update.
     * @param {object} req.body - The updated item data.
     */
    app.put('/api/inventory/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const { Name, Description, Location, Bin, Quantity, Image, Owner } = req.body;
            const query = `UPDATE Items SET Name = @Name, Description = @Description, Location = @Location, Bin = @Bin, Quantity = @Quantity, Image = @Image, Owner = @Owner WHERE ID = @ID`;
            await executeQuery(config, query, { ID, Name, Description, Location, Bin, Quantity, Image, Owner });
            res.json({ success: true });
            logTransaction(config, req.route.path, req.body, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database update failed' });
        }
    });

    /**
     * Route to delete an inventory item.
     *
     * @route DELETE /api/inventory/:ID
     * @param {string} req.params.ID - The ID of the item to delete.
     */
    app.delete('/api/inventory/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const query = `DELETE FROM Items WHERE ID = @ID`;
            await executeQuery(config, query, { ID });
            res.json({ success: true });
            logTransaction(config, req.route.path, `delete ${ID}`, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database deletion failed' });
        }
    });

    /**
     * Route to add a new inventory item.
     *
     * @route POST /api/inventory
     * @param {object} req.body - The new item data.
     */
    app.post('/api/inventory', authenticateToken, async (req, res) => {
        try {
            const { Name, Description, Location, Bin, Quantity, Image, Owner } = req.body;
            const ID = generateUUID();
            const query = `INSERT INTO Items (ID, Name, Description, Location, Bin, Quantity, Image, Owner) VALUES (@ID, @Name, @Description, @Location, @Bin, @Quantity, @Image, @Owner)`;
            await executeQuery(config, query, { ID, Name, Description, Location, Bin, Quantity, Image, Owner });
            res.status(201).json({ success: true });
            logTransaction(config, req.route.path, req.body, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database insertion failed' });
        }
    });

    /**
     * Route to get locations based on query parameters.
     *
     * @route GET /api/locations
     * @param {string} req.query.filterColumn - The column to filter by.
     * @param {string} req.query.searchValue - The value to search for.
     * @param {boolean} req.query.exactMatch - Whether to perform an exact match.
     */
    app.get('/api/locations', authenticateToken, async (req, res) => {
        try {
            const { filterColumn, searchValue, exactMatch } = req.query;
            let query;

            if (exactMatch === 'true') {
                query = `SELECT * FROM Locations WHERE ${filterColumn} = @searchValue`;
            } else {
                query = `SELECT * FROM Locations WHERE CONCAT('%', ${filterColumn}, '%') LIKE CONCAT('%', @searchValue, '%')`;
            }

            const result = await executeQuery(config, query, { filterColumn, searchValue });
            res.json(result.recordset);
            if (process.env.LOGGING === 'high') {
                logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });

    /**
     * Route to update a location.
     *
     * @route PUT /api/locations/:ID
     * @param {string} req.params.ID - The ID of the location to update.
     * @param {object} req.body - The updated location data.
     */
    app.put('/api/locations/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const { Name, Description, Building, Owner, Image } = req.body;
            const query = `UPDATE Locations SET Name = @Name, Description = @Description, Building = @Building, Owner = @Owner, Image = @Image WHERE ID = @ID`;
            await executeQuery(config, query, { ID, Name, Description, Building, Owner, Image });
            res.json({ success: true });
            logTransaction(config, req.route.path, req.body, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database update failed' });
        }
    });

    /**
     * Route to delete a location.
     *
     * @route DELETE /api/locations/:ID
     * @param {string} req.params.ID - The ID of the location to delete.
     */
    app.delete('/api/locations/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const query = `DELETE FROM Locations WHERE ID = @ID`;
            await executeQuery(config, query, { ID });
            res.json({ success: true });
            logTransaction(config, req.route.path, `delete ${ID}`, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database deletion failed' });
        }
    });

    /**
     * Route to add a new location.
     *
     * @route POST /api/locations
     * @param {object} req.body - The new location data.
     */
    app.post('/api/locations', authenticateToken, async (req, res) => {
        try {
            const { Name, Description, Building, Owner } = req.body;
            const ID = generateUUID();
            const query = `INSERT INTO Locations (ID, Name, Description, Building, Owner) VALUES (@ID, @Name, @Description, @Building, @Owner)`;
            await executeQuery(config, query, { ID, Name, Description, Building, Owner });
            res.status(201).json({ success: true });
            logTransaction(config, req.route.path, req.body, req.user ? req.user.Username : null);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database insertion failed' });
        }
    });

    /**
     * Route to get rooms.
     * Rooms are the same as locations. I wrote these routes for the home page with the initial intention of adding rooms 
     * as groups of locations, but that functionality has not been added.
     *
     * @route GET /api/rooms
     */
    app.get('/api/rooms', authenticateToken, async (req, res) => {
        try {
            const query = `SELECT Name, ID FROM Rooms`;
            const result = await executeQuery(config, query);
            res.json(result.recordset);
            if (process.env.LOGGING === 'high') {
                logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    });

    /**
     * Route to update the quantity of an item.
     * This route is used for the item card "update quantity" button
     *
     * @route PUT /api/update-quantity/:id
     * @param {string} req.params.id - The ID of the item to update.
     * @param {number} req.body.quantity - The new quantity value.
     */
    app.put('/api/update-quantity/:id', authenticateToken, async (req, res) => {
        try {
            const { quantity } = req.body;
            const { id } = req.params;

            const queryUpdateQuantity = `UPDATE Items SET Quantity = @Quantity WHERE ID = @ID`;
            await executeQuery(config, queryUpdateQuantity, { ID: id, Quantity: quantity });

            res.json({ message: 'Quantity updated successfully' });
            logTransaction(config, req.route.path, req.body, req.user ? req.user.Username : null);
        } catch (err) {
            if (err.code === 'EREQUEST') {
                console.error('Database query failed:', err.originalError.info.message);
                return res.status(500).json({ error: 'Database query failed' });
            }
            console.error('Update quantity error:', err);
            res.status(500).json({ error: 'Failed to update quantity' });
        }
    });
}

module.exports = setupInvRoutes;
