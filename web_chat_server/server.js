/**
 * Web Server running on node js
 */

// libraries
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

// constants
const PORT = 3001;

// iniate express, web server and realtime web communication
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT"]
    }
  });


// event handler for connection event in default namespace
io.on('connection',  socket => {
    console.log('entro a connection con default namespace "/" ');
    // event handlers for received events on server
    // when user connects to chat
    socket.on('connected', (userName) => {
        console.log(`User ${userName} has connected`);
    })
    // send message to all chat members
    socket.on('sendAll', (userName, msg) => {
        io.emit('messageClients', userName, msg);
        console.log('Send Message to all clients');
    })
});


// get http method
app.get('*', (req, res) => {
    res.send('Hello');
});

// server listening
httpServer.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}!`);
});


// por probar cambiar ip y cambiar misma version de socket io