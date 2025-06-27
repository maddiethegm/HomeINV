// authRoutes.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const generateUUID = require('uuid').v4;

function setupAuthRoutes(app, config) {
    const formatQueryParams = (params) => {
        const formattedParams = {};
        for (const key in params) {
            if (key === 'ID') {
                formattedParams[key] = { type: sql.UniqueIdentifier, value: params[key] };
            } else if (key === 'Username') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key].toLowerCase() }; // Normalize to lowercase
            } else if (key === 'PasswordHash') {
                formattedParams[key] = { type: sql.NVarChar(sql.MAX), value: params[key] };
            } else if (key === 'Role') {
                formattedParams[key] = { type: sql.NVarChar(50), value: params[key].toLowerCase() }; // Normalize to lowercase
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

    const secretKey = process.env.JWT_SECRET; // Replace with a secure random key

    // Function to execute a query
    const executeQuery = (query, params = {}) => {
        const formattedParams = formatQueryParams(params);
        return sql.connect(config)
            .then(pool => pool.request()
                .input('ID', sql.UniqueIdentifier, formattedParams.ID ? formattedParams.ID.value : null) // Adjust the type and size as needed
                .input('Username', sql.NVarChar(50), params.Username) // Adjust the type and size as needed
                .input('PasswordHash', sql.NVarChar(sql.MAX), params.PasswordHash) // Adjust the type and size as needed
                .input('Role', sql.NVarChar(20), params.Role) // Adjust the type and size as needed
                .query(query))
            .catch(err => {
                console.error('Database connection error:', err);
                throw new Error('Failed to connect to database');
            });
    };

    app.post('/auth/login', async (req, res) => {
        try {
            const { Username, password } = req.body;

            if (!Username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            // Normalize username to lowercase
            const normalizedUsername = Username.toLowerCase();

            console.log('Login request received:', { Username });

            const query = `SELECT * FROM Users WHERE LOWER(Username) = @Username`;
            const result = await executeQuery(query, { Username: normalizedUsername });

            if (result.recordset.length === 0) {
                console.error('User not found for username:', normalizedUsername);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = result.recordset[0];
            console.log('User retrieved from database:', user);

            const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

            if (!passwordMatch) {
                console.error('Password mismatch for username:', normalizedUsername);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const payload = {
                Username: user.Username,
                role: user.Role
            };

            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            console.log('Login successful for username:', normalizedUsername);
            res.json({ token });
        } catch (err) {
            if (err.code === 'EREQUEST') {
                console.error('Database query failed:', err.originalError.info.message);
                return res.status(500).json({ error: 'Database query failed' });
            }
            console.error('Login error:', err);
            res.status(500).json({ error: 'Authentication failed' });
        }
    });

    app.post('/auth/register', async (req, res) => {
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
}

module.exports = setupAuthRoutes;
