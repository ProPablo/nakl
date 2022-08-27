import { useContext, useEffect } from "react";
import { CurrentConnectionContext, SocketContext } from "../App";

const ChatPage = () => {

  const conn = useContext(CurrentConnectionContext);

  useEffect(() => {

    conn.current.on("data", (data) => {
      console.log("data recieved ", data);
    })

  }, [])
  return (<div> ALL MESSAGE</div>)

}

export default ChatPage;