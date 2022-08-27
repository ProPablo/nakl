import { Message, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentConnectionContext, SocketContext } from "../App";

const ChatPage = () => {

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const conn = useContext(CurrentConnectionContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (conn.current == null) {
      navigate("/");
      return;
    }

    conn.current.on("data", (data) => {
      console.log("data recieved ", data);
      setMessages(existing => {
        if (typeof (data) == "string") {
          const newModel: MessageModel = {
            direction: "incoming",
            position: "single",
            message: data
          }
          return [...existing,]
        }
        else if (data instanceof Blob) {

        }
      })
    });

    return () => {
      conn.current.removeAllListeners();
      conn.current.close();
    }

  }, [])
  //On disconnect go to root, you will get a new peer
  return (<div>
    <MessageList >
      {messages.map((m, i) =>
        <Message
          key={i}
          model={m}
        />
      )}
    </MessageList>
    ALL MESSAGE</div>)

}

export default ChatPage;