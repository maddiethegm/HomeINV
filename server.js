// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const setupRoutes = require('./routes');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors());

// SQL Server Configuration
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};
// Connect to the database
sql.connect(config, err => {
    if (err) throw err;
    console.log('Connected to SQL Server');
});

setupRoutes(app, config);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
