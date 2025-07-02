// routes.js
const sql = require('mssql');
const { authenticateToken } = require('./authMiddleware');
function setupRoutes(app, config) {
    const formatQueryParams = (params) => {
        const formattedParams = {};
        for (const key in params) {
            if (key === 'ID') {
                formattedParams[key] = { type: sql.UniqueIdentifier, value: params[key] };
            } else if (key === 'Name') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (key === 'Description') {
                formattedParams[key] = { type: sql.VarChar(sql.MAX), value: params[key] };
            } else if (key === 'Building') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (key === 'Owner') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (key === 'Username') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (key === 'Role') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (key === 'Location') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (typeof params[key] === 'string') {
                formattedParams[key] = { type: sql.NVarChar(255), value: params[key] };
            } else if (typeof params[key] === 'number') {
                formattedParams[key] = { type: sql.SmallInt, value: params[key] };
            } else if (key === 'Image') {
                formattedParams[key] = { type: sql.NVarChar(sql.MAX), value: params[key] };
            }
        }
        return formattedParams;
    };

    // Function to execute a query
    const executeQuery = (query, params) => {
        const formattedParams = formatQueryParams(params);
        return sql.connect(config)
            .then(pool => pool.request()
                .input('filterColumn', sql.NVarChar(255), formattedParams.filterColumn ? formattedParams.filterColumn.value : null) // Adjust the type and size as needed
                .input('searchValue', sql.NVarChar(255), formattedParams.searchValue ? formattedParams.searchValue.value : null) // Adjust the type and size as needed
                .input('ID', sql.UniqueIdentifier, formattedParams.ID ? formattedParams.ID.value : null) // Adjust the type and size as needed
                .input('Name', sql.NVarChar(50), formattedParams.Name ? formattedParams.Name.value : null) // Adjust the type and size as needed
                .input('Building', sql.NVarChar(50), formattedParams.Name ? formattedParams.Name.value : null) // Adjust the type and size as needed
                .input('Owner', sql.NVarChar(50), formattedParams.Name ? formattedParams.Name.value : null) // Adjust the type and size as needed
                .input('Description', sql.VarChar(sql.MAX), formattedParams.Description ? formattedParams.Description.value : null) // Adjust the type and size as needed
                .input('Location', sql.NVarChar(50), formattedParams.Location ? formattedParams.Location.value : null) // Adjust the type and size as needed
                .input('Bin', sql.NVarChar(50), formattedParams.Bin ? formattedParams.Bin.value : null) // Adjust the type and size as needed
                .input('Quantity', sql.SmallInt, formattedParams.Quantity ? formattedParams.Quantity.value : null) // Adjust the type and size as needed
                .input('Image', sql.NVarChar(sql.MAX), formattedParams.Image ? formattedParams.Image.value : null) // Adjust the type and size as needed
                .input('Username', sql.NVarChar(50), formattedParams.Name ? formattedParams.Name.value : null) // Adjust the type and size as needed
                .input('Role', sql.NVarChar(50), formattedParams.Name ? formattedParams.Name.value : null) // Adjust the type and size as needed
                .input('PasswordHash', sql.VarChar(sql.MAX), formattedParams.Description ? formattedParams.Description.value : null) // Adjust the type and size as needed
                .query(query))
            .catch(err => {
                console.error('Database connection error:', err);
                throw new Error('Failed to connect to database');
            });
    };

    const generateUUID = require('uuid').v4;

    app.get('/api/inventory', authenticateToken, async (req, res) => {
        try {
            const { filterColumn, searchValue, exactMatch } = req.query;
            let query;

            if (exactMatch === 'true') {
                query = `SELECT * FROM Items WHERE ${filterColumn} = @searchValue`;
            } else {
                query = `SELECT * FROM Items WHERE ${filterColumn} LIKE '%' + @searchValue + '%'`;
            }

            const result = await executeQuery(query, { filterColumn, searchValue });
            res.json(result.recordset);
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
            await executeQuery(query, { ID, Name, Description, Location, Bin, Quantity, Image });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database update failed' });
        }
    });

    app.delete('/api/inventory/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const query = `DELETE FROM Items WHERE ID = @ID`;
            await executeQuery(query, { ID });
            res.json({ success: true });
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
            await executeQuery(query, { ID, Name, Description, Location, Bin, Quantity, Image });
            res.status(201).json({ success: true });
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

            const result = await executeQuery(query, { filterColumn, searchValue });
            res.json(result.recordset);
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
            await executeQuery(query, { ID, Name, Description, Building, Owner, Image });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database update failed' });
        }
    });

    app.delete('/api/locations/:ID', authenticateToken, async (req, res) => {
        try {
            const { ID } = req.params;
            const query = `DELETE FROM Locations WHERE ID = @ID`;
            await executeQuery(query, { ID });
            res.json({ success: true });
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
            await executeQuery(query, { ID, Name, Description, Building, Owner });
            res.status(201).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database insertion failed' });
        }
    });

    app.get('/api/rooms', authenticateToken, async (req, res) => {
        try {
            const query = `SELECT Name, ID FROM Rooms`; // Ensure you select the necessary fields
            const result = await executeQuery(query);
            res.json(result.recordset);
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
            await executeQuery(queryUpdateQuantity, { ID: id, Quantity: quantity });

            res.json({ message: 'Quantity updated successfully' });
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
            await executeQuery(queryUpdateOutofStock, { ID: id, IsOutOfStock: isOutOfStock });

            res.json({ message: 'Out of Stock status updated successfully' });
        } catch (err) {
            if (err.code === 'EREQUEST') {
                console.error('Database query failed:', err.originalError.info.message);
                return res.status(500).json({ error: 'Database query failed' });
            }
            console.error('Update out-of-stock error:', err);
            res.status(500).json({ error: 'Failed to update out-of-stock status' });
        }
    });

    // Public routes can be added here if needed
}    


module.exports = setupRoutes;
