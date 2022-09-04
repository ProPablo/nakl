import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { OnResultFunction, QrReader } from 'react-qr-reader';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentConnectionContext, SocketContext } from '../App';
import './Join.css';


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
    console.log("hey man", res)
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

      console.log("Connecting to chat...", id);
      connRef.current = peer.current.connect(id);
      console.log(connRef.current);
      setisLoadingChat(true);


      connRef.current.on("open", () => {
        console.log("Connected !!");
        setisLoadingChat(false);
        connRef.current.send("Yo Joining from client pc");
        navigate('/chat');
      })

    }
  }
  const videoStyle: React.CSSProperties = {
    // height: "85%",
    paddingTop:"1rem"
  }
  const videoContainerStyle: React.CSSProperties = {
    paddingTop:"60%"
  }


  return (
    <div className='container qr-scanner'>
      {isLoadingChat ? <h3>LOADING...</h3> :
          //@ts-ignore
        < QrReader
          // videoStyle={videoStyle}
          // videoContainerStyle={videoContainerStyle}
          onResult={handleResult}
          // constraints={{ facingMode: 'environment' }}
          // constraints={{ facingMode: 'user' }}
        />
      }
          <Link to="/">
            <button data-tooltip="Tooltip" type="button">
              Home
            </button>
          </Link>
    </div>
  );
}


export default JoinIndex;