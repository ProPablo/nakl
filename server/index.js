//https://github.com/peers/peerjs-server
// const { PeerServer } = require('peer');

const PORT = 9000;

// const peerOptions = { port: PORT, path: '/peer' };

// // const peerServer = PeerServer(peerOptions);
// console.log(`Started peer server ${JSON.stringify(peerOptions, null, 2)}`)




const express = require('express');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');

const app = express();

app.get('/', (req, res, next) => res.send('Hello world!'));

const server = app.listen(PORT);
const peerServer = ExpressPeerServer(server, {
  path: '/peer'
});

app.use('/', peerServer);
app.use(cors());