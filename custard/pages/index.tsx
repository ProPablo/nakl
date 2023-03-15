import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";
import { useContext, useEffect, useState } from 'react';
import { CurrentConnectionContext, GlobalContext, SocketContext } from './_app';
import { useRouter } from 'next/router';
import { Peer } from "peerjs"

enum LogLevel {
    Disabled = 0,
    Errors = 1,
    Warnings = 2,
    All = 3
}


export default function Home() {
  const peerRef = useContext(SocketContext);
  const [state, setGlobalState] = useContext(GlobalContext);
  const [code, setCode] = useState("");
  const connRef = useContext(CurrentConnectionContext);
  const router = useRouter();
  const [isLoadingChat, setisLoadingChat] = useState(false);


  function onPressJoin() {
    console.log("Connecting to chat...", code);
    connRef.current = peerRef.current.connect(code);
    console.log(connRef.current);
    setisLoadingChat(true);

    connRef.current.on("open", () => {
      console.log("Connected!");
      setisLoadingChat(false);
      router.push('/chat');
    })
  }

  useEffect(() => {
    connRef.current?.close();
    // No reason for doing this, websocket error from next js is a wsl thing (restart pc)
    // https://github.com/vercel/next.js/issues/30491#issuecomment-972811344
    // connRef.current = null;
    // peerRef.current?.destroy();
    // peerRef.current = null;

    
    const HOST = process.env.NEXT_PUBLIC_HOST;
    const PORT = parseInt(process.env.NEXT_PUBLIC_PORT);
    const importPeer = async () => {
      // loading library first 
      // Tested that the network import only happens once on page load
      const PeerClass = (await import('peerjs')).default
      peerRef.current = new PeerClass({
        host: HOST,
        port: PORT,
        path: '/peer',
        debug: LogLevel.All
      }) as Peer;

      // peer.current will be re-generated everytime page is loaded
      setGlobalState({
        ...state,
        isLoadingPeer: true,
        peerId: "",
      })

      console.log("Making new peer.");
      peerRef.current.on("open", (id) => {
        setGlobalState({
          ...state,
          isLoadingPeer: false,
          peerId: id,
        })
      })

      // when peer connects to us
      peerRef.current.on("connection", (conn) => {
        connRef.current = conn;
        console.log("Someone decided to join.");
        router.push("/chat");
      })
    }
    importPeer();
  }, [])

  return (
    <>
      <div className="navbar bg-lavender">
        <div className="flex-1 flex justify-center mr-auto navbar-center">
          <button className="btn btn-ghost flex justify-center align-items h-28">
            <img className="object-contain h-full w-full" src="/wlogo.svg" />
          </button>
        </div>
      </div>

      <main className={styles.main + "min-h-screen bg-french-gray"}>
        <div className="flex flex-col items-center h-screen">
          {state.isLoadingPeer ?
            <div>
              <h1 className="text-3xl font-bold underline text-center">LOADING</h1>
            </div>
            :
            <div className="flex flex-col justify-center items-center pt-16">
              <h1 className="text-5xl text-ultra-violet font-link">SCAN</h1>
              <h2 className="text-2xl text-ultra-violet font-link">someone joins you</h2>
              <QRCode className="qr-code justify-centre py-6" value={state.peerId} />
              <code className="text-dim-gray bg-french-gray-lite rounded-lg font-link p-1">{state.peerId}</code>
              <div className="flex flex-row pt-6">
                <input
                  type="text"
                  placeholder="enter code..."
                  className="input w-full max-w-xs bg-white text-dim-gray font-link"
                  onChange={(e) => { setCode(e.target.value) }}
                />
                <button
                  className="btn font-link"
                  onClick={onPressJoin}>Join
                </button>
              </div>

              <div className="p-6">
                <button
                  className="btn font-link"
                  onClick={() => console.log('SHOW CAMERA')}>
                  <img className="object-contain h-full w-full " src="/camera.svg" />
                </button>
              </div>
            </div>
          }
        </div>
      </main>
    </>
  )
}
