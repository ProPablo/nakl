//@ts-ignore
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";
import { Ref, useRef, useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentConnectionContext, SocketContext } from "../App";
import { gzipSync, zlibSync, decompress} from 'fflate';


//TODO: use this interface


// type SettingsAction =
//   { type: SettingsActionName.TOGGLE_AUTO_PLAY } |
//   { type: SettingsActionName.FINISH_APP_TOUR } |
//   { type: SettingsActionName.REPLACE_SETTINGS, settings: LocalSettingsState }


interface AttachementDTO {
  /**
   * Compressed data in zlib
   */
  data: Uint8Array,
  /**
   * The mimetype of the file, stored on the blob of the file
   */
  fileType: string,

  /**
   * Stored on the file itself
   */
  fileName: string,
  /**
   * Generated on sender, used for ACK
   */
  attachmentID: string
}


const ChatPage = () => {

  const inputRef = useRef<HTMLDivElement>(null);
  const [msgInputValue, setMsgInputValue] = useState("");

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const connRef = useContext(CurrentConnectionContext);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (connRef.current == null) {
      if (process.env.NODE_ENV == "development") return;
      navigate("/");
      return;
    }

    connRef.current.on("data", async (data: string | AttachementDTO) => {
      console.log("data recieved ", data);
      if (typeof (data) == "string") {

        if (data.startsWith("data:image")) {

          setMessages(existing => {
            const newModel: MessageModel = {
              type: 'image',
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
      else if (data instanceof ArrayBuffer) {
        const newBlob = new Blob([data]);
        addImage(newBlob, true);
      }
      else {
        const decompressed = decompress(data.data, res => {});

      }
    })

    return () => {
      connRef.current.removeAllListeners();
      connRef.current.close();
    }
  }, [])

  const addImage = (data: Blob, received: boolean) => {

    setMessages(existing => {
      const newModel: MessageModel = {
        type: 'image',
        direction: "incoming",
        position: "single",
        payload: {
          src: URL.createObjectURL(data),
        }
      }
      return [...existing, newModel];
    });
  }



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

  const changeAttachHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(event);
    if (event.target.files.length == 0) {
      setFile(null);
    }
    else {
      setFile(event.target.files[0]);
    }
  };

  const sendAttachHandler = async (event) => {
    addImage(file, false);
    const data = new Uint8Array(await file.arrayBuffer());
    // const compressed = zlibSync(data);
    const sendDTO: AttachementDTO = {
      // data: compressed,
      data,
      attachmentID: crypto.randomUUID(),
      fileName: file.name,
      fileType: file.type
    }
    connRef.current.send(sendDTO);

    //Confirm the ack 
    //then close file access
    //Implement timeout here for the ack?
    setFile(null);
  };


  return (
    <div style={{
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
            onAttachClick={sendAttachHandler}
            attachDisabled={!!!file}
          />
        </ChatContainer>
      </MainContainer>
      {/* TODO: style according to this  https://stackoverflow.com/questions/572768/styling-an-input-type-file-button
    and make responsive to page so on desktop it takes half and half of the screen, on mobile, it is below chat
    if image it can display image
    using lflex wrap or grid
    */}
      <input id='file_input' type="file" name="file" onChange={changeAttachHandler} title="Choose File or drag file here" />
      {/* <a href={file} >Download File here</a> */}
    </div>
    )
}

export default ChatPage;