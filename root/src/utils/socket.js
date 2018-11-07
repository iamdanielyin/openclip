import io from 'socket.io-client';
const uri = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : window.location.origin;
const client = io(uri);

export default () => client;
