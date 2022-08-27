import { useContext, useEffect } from "react";
import { connection, SocketContext } from "../App";

const ChatPage = () => {

  // const peer = useContext(SocketContext);

  useEffect(() => {
    
    connection.on("data", (data) =>  {
      console.log("Got message" + data)
    });


  }, [])
  return (<div> ALL MESSAGE</div>)

}

export default ChatPage;