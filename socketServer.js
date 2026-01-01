// socketServer.js

const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');

function setupWebSocketServer(httpServer) {
    const wss = new WebSocketServer({ server: httpServer });

    // Function to validate JWT token and extract user data
    function validateToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return {
                success: true,
                user: decoded,
            };
        } catch (err) {
            console.error('Invalid token:', err);
            return {
                success: false,
                error: 'Invalid or expired token',
            };
        }
    }

    // Function to add client to a room
    function joinRoom(ws, roomName) {
        if (!rooms[roomName]) {
            rooms[roomName] = [];
        }
        rooms[roomName].push(ws);
    }

    // Function to send message to all clients in a room
    function broadcastToRoom(roomName, data) {
        if (rooms[roomName]) {
            rooms[roomName].forEach(client => client.send(JSON.stringify(data)));
        }
    }

    // Function to send message to a single client by ID
    function sendMessageToClient(clientId, data) {
        if (clients[clientId]) {
            clients[clientId].send(JSON.stringify(data));
        }
    }

    // Create a map of rooms and a map of clients
    const rooms = {};
    const clients = {};

    wss.on('connection', function connection(ws) {
        console.log('Client connected');
        joinRoom(ws, `room-global`);

        // Listen for a token sent by the client
        ws.on('message', async (message) => {
            try {
                const token = message.toString();
                const { success, user } = validateToken(token);

                if (!success) {
                    ws.send(JSON.stringify({
                        status: 'error',
                        message: user.error
                    }));
                    return;
                }

                // Extract the role from the decoded JWT
                const role = user.role;

                console.log(`Client with role ${role} connected`);

                // Add client to a room based on their role
                joinRoom(ws, `room-${role}`);
            } catch (err) {
                console.error('Error handling token:', err);
                ws.send(JSON.stringify({
                    status: 'error',
                    message: 'Invalid token'
                }));
            }
        });
    });

    // Example: Send different messages to different roles
    setInterval(() => {
        const adminData = {
            type: 'admin',
            message: 'Admin notification: System is running smoothly!'
        };
        broadcastToRoom('room-admin', adminData);
    }, 5000);

    setInterval(() => {
        const userData = {
            type: 'user',
            message: 'User notification: You have a new message!'
        };
        broadcastToRoom('room-user', userData);
    }, 6000);
    
    setInterval(() => {
        const data = {
        event: 'stat-update',
        timestamp: new Date().toISOString(),
        value: Math.random() * 100,
        status: 'success'
    };
    broadcastToRoom('room-global', data);
    }, 20);
    return wss;
}

module.exports = { setupWebSocketServer };