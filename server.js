// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const setupRoutes = require('./routes');
const setupSocketRoutes = require('./socketRoutes');
const setupAuthRoutes = require('./authRoutes');
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

// Socket.IO setup
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let connectedClients = new Set();

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    connectedClients.add(socket.id);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        connectedClients.delete(socket.id);
    });

    // Emit an event to notify all clients about changes
    const notifyAllClients = (event, data) => {
        io.emit(event, data);
    };
    setupSocketRoutes(app, config);
});

// server.js (continued)
setupRoutes(app, config);
setupAuthRoutes(app, config);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
