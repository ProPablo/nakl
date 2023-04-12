import { useContext, useEffect, useRef, useState } from 'react';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";
import { CurrentConnectionContext } from './_app';
import { useRouter } from 'next/router';

export default function Home() {
  const inputRef = useRef<HTMLDivElement>(null);
  const [msgInputValue, setMsgInputValue] = useState("enter text...");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const connRef = useContext(CurrentConnectionContext);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (connRef.current == null) {
      if (process.env.NODE_ENV == "development") return;
      router.push("/");
      return;
    }

    connRef.current.on("data", (data) => {
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
      connRef.current.removeAllListeners();
    }
  }, [])

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

  const sendAttachHandler = (event) => {
    addImage(file, false);
    connRef.current.send(file);
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
      <div className="navbar bg-french-gray">
        <div className="flex-1 flex mr-auto navbar-left">
          <button className="btn btn-ghost flex justify-center align-items h-10" onClick={() => router.push("/")}>
            <img className="object-contain h-full w-full" src="/wlogo.svg" />
          </button>
        </div>
      </div>
      <main className="min-h-screen bg-lavender">
        <div className="flex mb-4 flex-direction-col max-h-[] bg-lavender">
          <MainContainer className="bg-french-gray w-1/2">
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
          <div className="flex w-1/2 h-[100vh] justify-center items-center shadow-inner bg-lavender ">
            <input id='file' type="file" className="file-input file-input-ghost" name="file" onChange={changeAttachHandler} title="Choose File or drag file here" />
          </div>
        </div>
      </main>
    </>
  )
}
