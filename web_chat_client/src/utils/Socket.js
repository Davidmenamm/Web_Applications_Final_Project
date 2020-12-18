/**
 * Socket.io client component
 * represents all sockets connected to default namespace
*/
import io from 'socket.io-client';
export let Socket = io('http://localhost:3001', {transports: ['websocket']});