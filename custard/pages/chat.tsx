import { useContext, useEffect, useRef, useState } from 'react';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageListProps, MessageModel } from "@chatscope/chat-ui-kit-react";
import { useRouter } from 'next/router';
import { useError } from '@/hooks/useError';

import dynamic from 'next/dynamic';

const DocViewer = dynamic(() => import("@cyntler/react-doc-viewer"), { ssr: false });
import { DocViewerRenderers } from "@cyntler/react-doc-viewer"

export default function Chat() {
  const [renderers, setRenderers] = useState([]);
  const getRenderers = async () => {
    // setRenderers((prev) => {
    //   const newRenderers = [...prev];
    //   const newRenderer = (await import('@cyntler/react-doc-viewer/')).;
    //   newRenderers

    //   return
    // }

    setRenderers((await import('@cyntler/react-doc-viewer/')).DocViewerRenderers);
  }
  const inputRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef(null);
  const [msgInputValue, setMsgInputValue] = useState("");
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const router = useRouter();
  const setError = useError();
  const [idCopy, setIdCopy] = useState(false);


  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getRenderers();
  }, [])

  useEffect(() => {
    if (window.NAKL_CONNECTION == null) {
      if (process.env.NODE_ENV == "development") {
        console.log("Should reroute to home");
        return;
      }
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
      // TODO: metadata necessary to render
      else if (data instanceof ArrayBuffer) {
        const newBlob = new Blob([data]);
        addImage(newBlob, true);
        // addOther(newBlob, true);
      }
      else if (data instanceof Blob) {
        console.log("We have an image.");
        addImage(data, true);
        // addOther(data, true);
      }
    })
    return () => {
      window.NAKL_CONNECTION.removeAllListeners();
    }
  }, [])

  const handleSendText = (message) => {
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

  const addImage = (data: Blob, incoming: boolean) => {
    data.type
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

  // TODO: this only supports adding to self for now because metadata
  const addOther = (data: File, incoming: boolean) => {
    data.type
    setMessages(existing => {
      const newMessageModel: MessageModel = {
        type: 'custom',
        direction: incoming ? 'incoming' : 'outgoing',
        position: 'single',
        payload: {
          src: data,
          fileName: data.name,
        }
      }
      return [...existing, newMessageModel]
    })
  }


  const sendAttachHandler = (event) => {
    console.log({ file });
    if (file.type.startsWith("image/")) addImage(file, false);
    else addOther(file, false);

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

  const forceScrollToBottom = () => {
    messagesListRef.current.scrollToBottom("auto");
  }

  return (
    <>
      {/* TOAST */}
      <div className={`select-none toast transition-opacity duration-300 text-white ${idCopy ? 'opacity-100' : 'opacity-0'}`}>
        <div className="alert text-white">
          <div>
            <span>Message copied.</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-screen overflow-hidden bg-lavender">
        <div className="navbar bg-french-gray">
          <div className="flex flex-1 mr-auto navbar-left">
            <button className="btn btn-ghost flex justify-center align-items h-10" onClick={() => router.push("/")}>
              <img className="object-contain h-full w-full" src="/wlogo.svg" />
            </button>
          </div>

          <button
            className="btn bg-ultra-violet text-french-gray-lite hover:bg-maize-crayola hover:text-black focus:outline-none border-none"
            onClick={() => {
              setError("Hey man from chat");
            }}>
            Test Error
          </button>
        </div>

        <div className="flex flex-1 overflow-auto flex-row bg-lavender">
          <div className="w-2/3 p-3">
            <MainContainer>
              <ChatContainer>
                <MessageList autoScrollToBottom ref={messagesListRef}>
                  {messages.map((m, i) => {
                    if (m.type == 'image') {
                      return (
                        <Message
                          key={i}
                          model={{ direction: m.direction, position: m.position }}
                        >
                          {/* @ts-ignore */}
                          <Message.ImageContent src={m.payload.src} className="h-fit rounded-[10px] overflow-hidden my-1" />
                        </Message>
                      )
                    }
                    // else if (m.type == 'custom' ) {
                    //   return (
                    //     <Message
                    //       key={i}
                    //       model={{ direction: m.direction, position: m.position }}
                    //     >
                    //       <Message.CustomContent className="h-fit rounded-[10px] overflow-hidden my-1">
                    //         {/* @ts-ignore */}
                    //         <video controls src={m.payload.src}></video>
                    //       </Message.CustomContent>
                    //     </Message>
                    //   )
                    // }
                    if (m.type == 'custom') {
                      return (
                        <Message
                          key={i}
                          model={{ direction: m.direction, position: m.position }}
                        >
                          <Message.CustomContent className="h-fit rounded-[10px] overflow-hidden my-1">
                            <DocViewer
                              // @ts-ignore TODO: remove once blob metadata is ther
                              documents={[{ uri: window.URL.createObjectURL(m.payload.src), fileName: m.payload.fileName }]}
                              pluginRenderers={renderers}
                            />
                          </Message.CustomContent>
                        </Message>
                      )
                    }
                    return (
                      <Message
                        key={i}
                        model={m}
                      >
                        <Message.CustomContent>
                          <div className="flex flex-col">
                            <p>{m.message}</p>
                            <button
                              onClick={() => {
                                setIdCopy(true);
                                setTimeout(() => setIdCopy(false), 1000);
                                navigator.clipboard.writeText(m.message)
                              }}
                              className='btn btn-xs btn-ghost bg-french-gray-lite hover:bg-french-gray'>Copy
                            </button>
                          </div>
                        </Message.CustomContent>

                      </Message>
                    )
                  }
                  )}
                </MessageList>
                <MessageInput
                  placeholder="enter text..."
                  onSend={handleSendText}
                  onChange={setMsgInputValue}
                  value={msgInputValue}
                  ref={inputRef}
                  onAttachClick={sendAttachHandler}
                  attachDisabled={!!!file}
                />
              </ChatContainer>
            </MainContainer>
          </div>

          <div className="flex w-1/3 justify-center items-center shadow-inner bg-lavender">
            <div className={`flex border-dashed border-2 justify-center w-[100%] mx-5 rounded-lg border-wisteria ${file == null ? 'h-[75%]' : 'h-fit'}`}>
              {file == null ?

                <input
                  className="file-input indent-[-900em] file-input-ghost w-[100%] h-[100%]"
                  id='file' type="file" name="file" title="Choose or drag file here"
                  onChange={changeAttachHandler}
                />

                :

                <div className='flex flex-col rounded-lg p-5 m-5'>
                  <DocViewer
                    documents={[{ uri: window.URL.createObjectURL(file), fileName: file.name }]}
                    pluginRenderers={renderers}
                  />
                  {/* <img className="object-contain w-screen rounded-lg" src={window.URL.createObjectURL(file)} /> */}
                  <button
                    className="btn text-white hover:bg-french-gray bg-wisteria btn-ghost justify-center align-items h-10 mt-5"
                    onClick={() => setFile(null)}>Remove file</button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
