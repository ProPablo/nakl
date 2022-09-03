//https://github.com/peers/peerjs-server
const { PeerServer } = require('peer');

const PORT = 9000;

const peerOptions = { port: PORT, path: '/peer' };

const peerServer = PeerServer(peerOptions);
console.log(`Started peer server ${JSON.stringify(peerOptions, null, 2)}`)