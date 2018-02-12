import io from 'socket.io-client';

const uri = process.env.__SOCKET__ || `http://localhost:4000`;
const client = io(uri);

export default () => client;