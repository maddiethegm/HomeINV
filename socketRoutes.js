// socketRoutes.js

const sql = require('mssql');

function setupSocketRoutes(app, config) {
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
                formattedParams[key] = { type: sql.Image, value: params[key] };
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
                .input('Image', sql.Image, formattedParams.Image ? formattedParams.Image.value : null) // Adjust the type and size as needed
                .input('Username', sql.NVarChar(50), formattedParams.Name ? formattedParams.Name.value : null) // Adjust the type and size as needed
                .input('Role', sql.NVarChar(50), formattedParams.Name ? formattedParams.Name.value : null) // Adjust the type and size as needed
                .input('PasswordHash', sql.VarChar(sql.MAX), formattedParams.Description ? formattedParams.Description.value : null) // Adjust the type and size as needed
                .query(query))
            .catch(err => {
                console.error('Database connection error:', err);
                throw new Error('Failed to connect to database');
            });
    };

        app.put('/update-quantity/:id', authenticateToken, async (req, res) => {
        try {
            const { quantity } = req.body;
            const { id } = req.params;

            const queryUpdateQuantity = `UPDATE Items SET Quantity = @Quantity WHERE ID = @ID`;
            await executeQuery(queryUpdateQuantity, { ID: id, Quantity: quantity });

            // Emit a change event to all connected clients
            notifyAllClients('itemUpdated', { id, quantity });

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

    // Example of emitting a change event when toggling out-of-stock status
    app.put('/update-out-of-stock/:id', authenticateToken, async (req, res) => {
        try {
            const { isOutOfStock } = req.body;
            const { id } = req.params;

            const queryUpdateOutofStock = `UPDATE Items SET IsOutOfStock = @IsOutOfStock WHERE ID = @ID`;
            await executeQuery(queryUpdateOutofStock, { ID: id, IsOutOfStock: isOutOfStock });

            // Emit a change event to all connected clients
            notifyAllClients('itemUpdated', { id, isOutOfStock });

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
}    
module.exports = setupSocketRoutes;
