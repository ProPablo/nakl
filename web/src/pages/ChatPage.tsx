//@ts-ignore
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";
import { Ref, useRef, useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentConnectionContext, SocketContext } from "../App";


//TODO: use this interface


// type SettingsAction =
//   { type: SettingsActionName.TOGGLE_AUTO_PLAY } |
//   { type: SettingsActionName.FINISH_APP_TOUR } |
//   { type: SettingsActionName.REPLACE_SETTINGS, settings: LocalSettingsState }




const ChatPage = () => {

  const inputRef = useRef<HTMLDivElement>(null);
  const [msgInputValue, setMsgInputValue] = useState("");

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const connRef = useContext(CurrentConnectionContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (connRef.current == null) {
      navigate("/");
      return;
    }

    connRef.current.on("data", (data) => {
      console.log("data recieved ", data);
      if (typeof (data) == "string") {

        if (data.startsWith("data:image")) {

          setMessages(existing => {
            const newModel: MessageModel = {
              type:'image',
              direction: "incoming",
              position: "single",
              payload: {
                src: data
              }
            }
            return [...existing, newModel];
          });

          return;
        }


        setMessages(existing => {
          const newModel: MessageModel = {
            direction: "incoming",
            position: "single",
            message: data
          }
          return [...existing, newModel];
        });
      }
      else if (data instanceof Blob) {
        console.log("we have imgae");

        setMessages(existing => {
          const newModel: MessageModel = {
            direction: "incoming",
            position: "single",
            payload: {
              src: data
            }
          }
          return [...existing, newModel];
        });

      }
    })


    return () => {
      connRef.current.removeAllListeners();
      connRef.current.close();
    }
  }, [])




  const handleSend = (message) => {

    connRef.current.send(message);
    setMessages([...messages,
    {
      position: 'single',
      message,
      direction: 'outgoing'
    }
    ]);
    setMsgInputValue("");
    inputRef.current.focus();

  }



  return (<div style={{
    height: "90vh",
    width: "100vw"

  }}>
    <MainContainer >
      <ChatContainer >
        <MessageList >
          {messages.map((m, i) =>
            <Message
              key={i}
              model={m}
            />
          )}

        </MessageList>
        <MessageInput
          placeholder="Type message here"
          onSend={handleSend}
          onChange={setMsgInputValue}
          value={msgInputValue}
          ref={inputRef}
        />
      </ChatContainer>
    </MainContainer>
  </div>)
}

export default ChatPage;