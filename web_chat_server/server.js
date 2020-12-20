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
      origin: "http://0.0.0.0:3000",
      methods: ["GET", "POST", "PUT"]
    }
  });

const userSocketIdMap = new Map();


function addClientToMap(userName, socketId){
    userSocketIdMap.set(userName, socketId);
    
}

function removeClientFromMap(socketId){
    let userName = '';
    for (let [key, value] of userSocketIdMap.entries()) {
        if (value === socketId)
          userName = key;
          break;
    }
    userSocketIdMap.delete(userName);
    return userName;
}

// event handler for connection event in default namespace
io.on('connection',  socket => {
    console.log('entro a connection con default namespace "/" ');
    // event handlers for received events on server
    // when user connects to chat
    socket.on('connected', (userName) => {
        addClientToMap(userName, socket.id);
        io.emit('updateList', Array.from(userSocketIdMap.keys()));
        console.log(`User ${userName} has connected`);
    });
    socket.on('disconnect', () => {
        //remove this client from online list
        let had = Array.from(userSocketIdMap.keys());
        userName = removeClientFromMap(socket.id);
        let has = Array.from(userSocketIdMap.keys());
        io.emit('updateList', Array.from(userSocketIdMap.keys()));
        console.log(`User had:${had} has:${has} username:${userName} disconnected`);
    });
    // send message to all chat members
    socket.on('sendAll', (userName, msg) => {
        // Aquí se debe agregar la interacción con la capa de persistencia
        io.emit('messageClients', userName, msg);
        console.log('Send Message to all clients');
    });
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