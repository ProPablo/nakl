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
  const [isLoadingChat, setisLoadingChat] = useState(false);


  useEffect(() => {
    //Ensure we didnt get to this page without peer being set
  }, [])

  const handleResult: OnResultFunction = (res, err) => {
    if (!!res && !isLoadingChat) {
      const id = res.getText();

      // const conn = peer.current.connect(id);
      // console.log("Connecting to chat...", conn);
      // setisLoadingChat(true);
      // conn.on("open", () => {
      // console.log("Connected !!");
      //   setisLoadingChat(false);
      //   connRef.current = conn;
      //   navigate('/chat');
      // })

      connRef.current = peer.current.connect(id);
      console.log("Connecting to chat...", connRef.current, id);
      setisLoadingChat(true);


      connRef.current.on("open", () => {
        console.log("Connected !!");
        setisLoadingChat(false);
        connRef.current.send("Yo Joining from client pc");
        navigate('/chat');
      })

    }
  }


  return (
    <>
      {isLoadingChat ? <div>LOADING...</div> :

        < QrReader
          onResult={handleResult}
          //@ts-ignore
          style={{ width: '100%' }}
        />
      }
    </>
  );
}


export default JoinIndex;