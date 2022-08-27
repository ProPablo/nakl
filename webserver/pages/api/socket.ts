// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from "socket.io";
import crypto from "crypto"

type Data = {
  name: string
}

export default function SocketHandler(
  req: NextApiRequest,
  // res: NextApiResponse<Data>
  res: any
) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;


  // Define actions inside
  io.on("connection", (socket) => {
    console.log('a user connected');
    socket.on("joinRoom", (roomId)=> {
      socket.join(roomId);
      socket.emit("joinedRoom", roomId);
    });
    //Room Shit is cringe
    socket.on("makeRoom", () => {
      var roomId = crypto.randomBytes(20).toString('hex');
      console.log("making room" + roomId);
      socket.join(roomId);
      socket.emit("joinedRoom", roomId);

      socket.on('sendMessage', (mess: any) => socket.to(roomId).emit("getMessage", mess));
    });

    //Can also use this and communicate privately
    socket.on("privateMessage", (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit("getMessage", socket.id, msg);
    });
  });

  console.log("Setting up socket");
  res.end();
  //Someone connects to socket server, gets roomId, displays room id

  //join connects to room id

  //they exchange ice

  // var id = crypto.randomBytes(20).toString('hex');
  // delete socket connection
  // res.status(200).json({ id });
}
