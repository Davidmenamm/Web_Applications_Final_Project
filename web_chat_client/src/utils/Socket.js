/**
 * Socket.io client component
 * represents all sockets connected to default namespace
*/
import io from 'socket.io-client';


// Este IP debe cambiarse al IP de la máquina que corre el servidor
let ip = 'localhost';

export let Socket = io(`http://${ip}:3001`, {transports: ['websocket']});