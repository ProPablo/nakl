import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { OnResultFunction, QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { CurrentConnectionContext, SocketContext } from '../App';
const JoinIndex = () => {
  //TODO: this would be a great place to do the epic google check of numbers to make sure someone in public didnt just scan ur code by accident
  //THis would be handled by socket.io implementation

  const peer = useContext(SocketContext);
  const connRef = useContext(CurrentConnectionContext);
  const navigate = useNavigate();


  useEffect(() => {
    //Ensure we didnt get to this page without peer being set
  }, [])

  const handleResult: OnResultFunction = (res, err) => {
    if (!!res) {
      var id = res.getText();
      var conn = peer.current.connect(id);
      if (!conn) return;
      console.log("Connecting to chat...");
      conn.on("open", () => {
        connRef.current = conn;
        navigate('/chat');
      })
    }
  }


  return (
    <>
      <QrReader
        onResult={handleResult}
        //@ts-ignore
        style={{ width: '100%' }}
      />
    </>
  );
}


export default JoinIndex;