// authRoutes.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticate } = require('ldap-authentication');
const generateUUID = require('uuid').v4;
const { authenticateToken } = require('./authMiddleware');
const { createRateLimiter } = require('./rateLimitMiddleware');
const { executeQuery } = require('./dbquery');
const loginRateLimiter = createRateLimiter();

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

function setupAuthRoutes(app, config) {
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
            const resultCheck = await executeQuery(config, queryCheck, { Username: normalizedUsername });
            console.log('User check result:', resultCheck.recordset.length);
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);            
            if (resultCheck.recordset.length > 0) {
                return res.status(409).json({ error: 'User already exists' });
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(Password, saltRounds);
            console.log('Hashed password:', hashedPassword);

            const queryInsert = `INSERT INTO Users (ID, Username, PasswordHash, Role) VALUES (@ID, @Username, @PasswordHash, @Role)`;
            await executeQuery(config, queryInsert, { ID, Username: normalizedUsername, PasswordHash: hashedPassword, Role });
            logTransaction(config, req.route.path, req.query, req.user ? req.user.Username : null);
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

    app.post('/api/auth/login', loginRateLimiter, async (req, res) => {
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
            const result = await executeQuery(config, query, { Username: normalizedUsername });

            if (result.recordset.length === 0) {
                console.error('User not found for username:', normalizedUsername);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = result.recordset[0];
            console.log('User retrieved from database:', user);

            // Check if SQL_USER is set to 1 to bypass LDAP authentication
            if (user.SQL_USER === true) {
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
};

module.exports = setupAuthRoutes;