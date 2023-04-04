import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useEffect, useRef, useState } from 'react';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";
import { useRouter } from 'next/router';

export default function Chat() {
  const inputRef = useRef<HTMLDivElement>(null);
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
        addImage(newBlob);
      }
      else if (data instanceof Blob) {
        console.log("We have an image.");
        addImage(data);
      }
    })
    return () => {
      window.NAKL_CONNECTION.removeAllListeners();
    }
  }, [])

  const addImage = (data: Blob) => {
    setMessages(existing => {
      const newMessageModel: MessageModel = {
        type: 'image',
        direction: 'incoming',
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
    addImage(file);
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

  return (
    <>
      <div className="navbar bg-lavender">
        <div className="flex-1 flex mr-auto navbar-left">
          <button className="btn btn-ghost flex justify-center align-items h-10" onClick={() => router.push("/")}>
            <img className="object-contain h-full w-full" src="/wlogo.svg" />
          </button>
        </div>
      </div>
      <main className="min-h-screen bg-french-gray">
        <MainContainer className="min-h-screen bg-french-gray">
          <ChatContainer>
            <MessageList>
              {messages.map((m, i) =>
                <Message
                  key={i}
                  model={m}
                />
              )}
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
        <input id='file_input' type="file" name="file" onChange={changeAttachHandler} title="Choose File or drag file here" />
      </main>
    </>
  )
}
