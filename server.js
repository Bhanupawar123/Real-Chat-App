const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);
  console.log('New client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // Broadcast message to all connected clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
