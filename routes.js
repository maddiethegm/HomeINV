// routes.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const { authenticate } = require('ldap-authentication');
const generateUUID = require('uuid').v4;
const { authenticateToken } = require('./authMiddleware');
const { createRateLimiter } = require('./rateLimitMiddleware');
const loginRateLimiter = createRateLimiter();
const secretKey = process.env.JWT_SECRET; // Replace with a secure random key

async function authenticateLDAP(username, password) {
    const userDnConstructed = `${process.env.LDAP_USER_ATTRIBUTE}=${username},${process.env.LDAP_DOMAIN_COMPONENTS}`;
    console.log('Constructed User DN:', userDnConstructed);
    const options = {
        ldapOpts: { 
            url: process.env.LDAP_URL,
            rejectUnauthorized: false, 
        },
        userDn: userDnConstructed,
        userPassword: password,
        starttls: true
    };

    try {
        const user = await authenticate(options);
        return true;
    } catch (error) {
        console.error('LDAP authentication error:', error);
        return false;
    }
}


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
            } else if (key === 'Role') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (key === 'Location') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
            } else if (key === 'Username') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key].toLowerCase() }; // Normalize to lowercase
            } else if (key === 'PasswordHash') {
                formattedParams[key] = { type: sql.NVarChar(sql.MAX), value: params[key] };
            } else if (key === 'Image') {
                formattedParams[key] = { type: sql.NVarChar(sql.MAX), value: params[key] };
            } else if (typeof params[key] === 'string') {
                formattedParams[key] = { type: sql.NVarChar(255), value: params[key] };
            } else if (typeof params[key] === 'number') {
                formattedParams[key] = { type: sql.SmallInt, value: params[key] };
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
                .input('Username', sql.NVarChar(50), params.Username) // Adjust the type and size as needed
                .input('PasswordHash', sql.NVarChar(sql.MAX), params.PasswordHash) // Adjust the type and size as needed
                .input('Role', sql.NVarChar(20), params.Role) // Adjust the type and size as needed
                .query(query))
            .catch(err => {
                console.error('Database connection error:', err);
                throw new Error('Failed to connect to database');
            });
    };

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

    app.post('/api/auth/register', authenticateToken, async (req, res) => {
        try {
            const ID = generateUUID();
            const { Username, Password, Role } = req.body;
            console.log('Registration request received:', { Username, Password, Role });
            if (!Username || !Password || !Role) {
                return res.status(400).json({ error: 'Username, password, and role are required' });
            }

            // Normalize username to lowercase
            const normalizedUsername = Username.toLowerCase();

            console.log('Normalized username:', normalizedUsername);

            // Check if the user already exists
            const queryCheck = `SELECT * FROM Users WHERE LOWER(Username) = @Username`;
            const resultCheck = await executeQuery(queryCheck, { Username: normalizedUsername });
            console.log('User check result:', resultCheck.recordset.length);
            
            if (resultCheck.recordset.length > 0) {
                return res.status(409).json({ error: 'User already exists' });
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(Password, saltRounds);
            console.log('Hashed password:', hashedPassword);

            const queryInsert = `INSERT INTO Users (ID, Username, PasswordHash, Role) VALUES (@ID, @Username, @PasswordHash, @Role)`;
            await executeQuery(queryInsert, { ID, Username: normalizedUsername, PasswordHash: hashedPassword, Role });

            console.log('User registered successfully:', { Username });
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            if (err.code === 'EREQUEST') {
                console.error('Database query failed:', err.originalError.info.message);
                return res.status(500).json({ error: 'Database query failed' });
            }
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Registration failed' });
        }
    });

app.post('/api/auth/login', loginRateLimiter, async  (req, res) => {
    const { Username, password } = req.body;

    if (!Username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Normalize username to lowercase
    const normalizedUsername = Username.toLowerCase();

    console.log('Login request received:', { Username });

    try {
        // Fetch user details from SQL Server
        const query = `SELECT * FROM Users WHERE Username = @Username`;
        const result = await executeQuery(query, { Username: normalizedUsername });

        if (result.recordset.length === 0) {
            console.error('User not found for username:', normalizedUsername);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.recordset[0];
        console.log('User retrieved from database:', user);

        // Check if SQL_USER is set to 1 to bypass LDAP authentication
        if (user.SQL_USER === true ) {
            const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

            if (!passwordMatch) {
                console.error('Password mismatch for username:', normalizedUsername);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // If password matches and SQL_USER is 1, generate JWT token
            const payload = {
                Username: user.Username,
                role: user.Role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            console.log('Login successful for username:', normalizedUsername);
            return res.json({ token });
        }

        // If SQL_USER is not 1, authenticate with LDAP
        try {
            const isAuthenticatedLDAP = await authenticateLDAP(normalizedUsername, password);

            if (!isAuthenticatedLDAP) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // If authenticated, generate a JWT token or set session
            const payload = {
                Username: user.Username,
                role: user.Role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            console.log('Login successful for username:', normalizedUsername);
            res.json({ token });

        } catch (ldapError) {
            console.error('LDAP authentication error:', ldapError);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (err) {
        if (err.code === 'EREQUEST') {
            console.error('Database query failed:', err.originalError.info.message);
            return res.status(500).json({ error: 'Database query failed' });
        }
        console.error('Login error:', err);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
}    


module.exports = setupRoutes;
