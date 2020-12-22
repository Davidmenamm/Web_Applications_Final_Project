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
const db_pool = require('./database');
const { resolve } = require('path');


function addClientToMap(userName, socketId){
    userSocketIdMap.set(userName, socketId);
}

async function addClientToDB(userName){
    my_query = `SELECT EXISTS(SELECT * FROM users WHERE Name = '${userName}')`;
    db_pool.query(my_query, function(err,result,_fields){
        if(err) throw err;
        k = Object.keys(result[0])[0]
        k = result[0][k]
        console.log('Previous existent user: ',k==1)
        if(k==0){
            my_query = `INSERT INTO users (Name) VALUES ('${userName}')`
            db_pool.query(my_query, function(err,_result,_fields){
                if(err) throw err;
                console.log('Added user:', userName)
            })
        }
    })
}

async function addMessageToGeneral(userName, msg){
    my_query = `INSERT INTO globalchat (\`From\`,Msg) VALUES ('${userName}','${msg}')`;
    db_pool.query(my_query, function(err,_result,_fields){
        if(err) throw err;
        console.log('Persisted message from :',userName);
    })
}

async function getChatID(userA,userB){
    my_query = `Select a.Chat_idChat from (Select * from mydb.user_chat where Users_Name = '${userA}') \
    as a inner join (Select * from mydb.user_chat where Users_Name = '${userB}') as b on a.Chat_idChat = b.Chat_idChat`;
    let result = await db_pool.query(my_query);
    if (result.length>0){
        return result[0].Chat_idChat;
    }

    my_query = 'INSERT INTO chat () VALUES ()';
    result = await db_pool.query(my_query);
    result = result.insertId;
    console.log("New chat generated", result);
    
    my_query = `INSERT INTO user_chat (Users_Name,Chat_idChat) VALUES ('${userA}','${result}'), ('${userB}','${result}')`;
    await db_pool.query(my_query);
    
    console.log("Linking done");
    return result;
}

async function addMessageToChat(userA,userB,msg){
    chatID = await getChatID(userA,userB);
    db_pool.query(`INSERT INTO message (Msg,Chat_idChat,Users_Name) VALUES ('${msg}','${chatID}','${userA}')`)
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
    socket.on('connected', (userName) => {
        addClientToMap(userName, socket.id);
        addClientToDB(userName);
        io.emit('updateList', Array.from(userSocketIdMap.keys()));
        console.log(`User ${userName} has connected`);
    });
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
        addMessageToGeneral(userName,msg);
        console.log('Send Message to all clients');
    });

    socket.on('sendTo', (fromUser, toUser, msg) => {
        // Aquí se debe agregar la interacción con la capa de persistencia
        let socketId = userSocketIdMap.get(toUser);
        io.to(socketId).emit('privateMessage', fromUser, msg);
        addMessageToChat(fromUser,toUser,msg);
        console.log(`Send Message from ${fromUser} to ${toUser}`);
    });
});


// get http method
app.get('*', (_req, res) => {
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