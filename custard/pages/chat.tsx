import { useContext, useEffect, useRef, useState } from 'react';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";
import { useRouter } from 'next/router';

export default function Chat() {
  const inputRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef(null);
  const [msgInputValue, setMsgInputValue] = useState("enter text...");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (window.NAKL_CONNECTION == null) {
      // if (process.env.NODE_ENV == "development") {
      //   console.log("Should reroute to home");
      //   return;
      // }
      router.push("/");
      return;
    }

    window.NAKL_CONNECTION.on("data", (data) => {
      console.log("Data received", data);
      if (typeof (data) == "string") {
        if (data.startsWith("data:image")) {
          setMessages(existing => {
            const newMessageModel: MessageModel = {
              type: 'image',
              direction: 'incoming',
              position: 'single',
              payload: {
                src: data
              }
            }
            return [...existing, newMessageModel]
          })
          return;
        }
        setMessages(existing => {
          const newMessageModel: MessageModel = {
            direction: 'incoming',
            position: 'single',
            message: data,
          }
          return [...existing, newMessageModel]
        });
      }
      else if (data instanceof ArrayBuffer) {
        const newBlob = new Blob([data]);
        addImage(newBlob, true);
      }
      else if (data instanceof Blob) {
        console.log("We have an image.");
        addImage(data, true);
      }
    })
    return () => {
      window.NAKL_CONNECTION.removeAllListeners();
    }
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const addImage = (data: Blob, incoming: boolean) => {
    setMessages(existing => {
      const newMessageModel: MessageModel = {
        type: 'image',
        direction: incoming ? 'incoming' : 'outgoing',
        position: 'single',
        payload: {
          src: URL.createObjectURL(data),
        }
      }
      return [...existing, newMessageModel]
    })
  }

  const handleSend = (message) => {
    window.NAKL_CONNECTION.send(message);
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

  const sendAttachHandler = (event) => {
    addImage(file, false);
    window.NAKL_CONNECTION.send(file);
    setFile(null);
  }

  const changeAttachHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(event);
    if (event.target.files.length == 0) {
      setFile(null);
    }
    else {
      setFile(event.target.files[0])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-lavender">
      <div className="navbar bg-french-gray">
        <div className="flex flex-1 mr-auto navbar-left">
          <button className="btn btn-ghost flex justify-center align-items h-10" onClick={() => router.push("/")}>
            <img className="object-contain h-full w-full" src="/wlogo.svg" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-auto flex-row bg-lavender">
        <div className="w-1/2 p-3">
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messages.map((m, i) =>
                  <Message
                    key={i}
                    model={m}
                  />
                )}
                <div ref={messagesEndRef} />
              </MessageList>
              <MessageInput
                placeholder="enter text..."
                onSend={handleSend}
                onChange={setMsgInputValue}
                value={msgInputValue}
                ref={inputRef}
                onAttachClick={sendAttachHandler}
                attachDisabled={!!!file}
              />
            </ChatContainer>
          </MainContainer>
        </div>
        <div className="flex w-1/2 justify-center items-center shadow-inner bg-lavender ">
          <input id='file' type="file" className="file-input indent-[-900em] file-input-ghost w-[95%] h-[95%]" name="file" onChange={changeAttachHandler} title="Choose File or drag file here" />
        </div>
      </div>
    </div>
  )
}
