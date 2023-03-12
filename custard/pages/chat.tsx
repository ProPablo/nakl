import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useContext, useEffect, useRef, useState } from 'react';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";
import { CurrentConnectionContext } from './_app';
import { useRouter } from 'next/router';


export default function Home() {
  const inputRef = useRef<HTMLDivElement>(null);
  const [msgInputValue, setMsgInputValue] = useState("null");
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
        addImage(newBlob);
      }
      else if (data instanceof Blob) {
        console.log("We have an image.");
        addImage(data);
      }
    })
    return () => {
      connRef.current.removeAllListeners();
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
    addImage(file);
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
      <main className={styles.main + "min-h-screen bg-french-gray"}>
        <div className="container holder" >
          {/* <h1>Ask your friend to get on this website: </h1> */}
          <h1>Chat</h1>
        </div>
        <MainContainer>
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
