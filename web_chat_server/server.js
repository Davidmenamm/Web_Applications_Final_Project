/**
 * Web Server running on node js
 */

// libraries
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { networkInterfaces } = require('os');

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
    // check if user name already exists
    // console.log('attemp adding userName to map', userName);
    // otherSockId = userSocketIdMap.get(userName);
    // console.log('other sock id', otherSockId, typeof(otherSockId));
    // console.log(socketId, typeof(socketId));
    // userSocketIdMap.forEach((values,keys)=>{ 
    //     console.log('testttt');
    //     console.log('active are this ', keys, values, typeof(keys), typeof(values));
    //  })

    let addedUser = false;
    // avoid repeated names
    if (typeof(userSocketIdMap.get(userName)) === 'undefined'){
        // console.log('Anadir usuario ->', userName, socketId);
        userSocketIdMap.set(userName, socketId);
        addedUser = true;
    }
    return addedUser;
}

function removeClientFromMap(socketId){
    let userName = '';
    for (let [key, value] of userSocketIdMap.entries()) {
        if (value == socketId)
          userName = key;
          break;
    }
    
    userSocketIdMap.delete(userName);
    return userName;
}

// event handler for connection event in default namespace
io.on('connection',  socket => {
    //console.log('entro a connection con default namespace "/" ');
    // event handlers for received events on server
    // when user connects to chat
    let responseMsg = '';
    socket.on('connectme', (userName) => {
        // add user
        const added = addClientToMap(userName, socket.id);
        // if user was correctly added
        if (added){
            responseMsg = 'Sucessful connection';
            io.to(socket.id).emit('validAccess', 'YES', responseMsg);
            console.log(`User ${userName} has connected`);
            console.log('Active users are:')
            userSocketIdMap.forEach((values,keys)=>{ 
               console.log(keys)
            }) 
        }
        // if not correctly added due to repeated name
        else {
            console.log(`User ${userName} was denied acess`);
            responseMsg = 'The user name already exists.'
            io.to(socket.id).emit('validAccess', 'NO', responseMsg);
        }              
    });
    socket.on('newClient', (name) => {
        // update list for all clients
        io.emit('updateList', Array.from(userSocketIdMap.keys()));
    })
    socket.on('disconnect', () => {
        //remove this client from online list
        userName = removeClientFromMap(socket.id);
        io.emit('updateList', Array.from(userSocketIdMap.keys()));
        console.log(`User ${userName} disconnected`);
    });
    // send message to all chat members
    socket.on('sendAll', (userName, msg) => {
        // Aquí se debe agregar la interacción con la capa de persistencia
        io.emit('messageClients', userName, msg);
        console.log('Send Message to all clients');
    });

    socket.on('sendTo', (fromUser, toUser, msg) => {
        // Aquí se debe agregar la interacción con la capa de persistencia
        let socketId = userSocketIdMap.get(toUser);
        io.to(socketId).emit('privateMessage', fromUser, msg);
        console.log(`Send Message from ${fromUser} to ${toUser}`);
    });
});


// get http method
app.get('*', (req, res) => {
    res.send('Hello');
});

// server listening
httpServer.listen(PORT, () => {   

    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    // Write IP to a file
    
    console.log(`Server is up on port ${PORT}!`);
});


// por probar cambiar ip y cambiar misma version de socket io