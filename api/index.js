const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Connect to external WebSocket API
const apiWs = new WebSocket('wss://pumpportal.fun/api/data');

apiWs.on('open', function open() {
    console.log('Connected to external WebSocket API');

    // Subscribe to new pools
   const payload = {
    method: "subscribeNewToken"
      }
    apiWs.send(JSON.stringify(payload));
});

apiWs.on('message', function message(data) {
    try {
        // Convert Buffer to string and parse JSON
        const jsonString = data.toString();
        const jsonData = JSON.parse(jsonString);

        console.log( jsonData);

        // Broadcast received data to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(jsonData));
            }
        });
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

apiWs.on('error', function error(err) {
    console.error('External WebSocket API error:', err);
});

apiWs.on('close', function close() {
    console.log('Disconnected from external WebSocket API');
});

// Handle WebSocket connections from clients
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message from client => ${message}`);
        // Handle client messages if needed
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket server error:', error);
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
