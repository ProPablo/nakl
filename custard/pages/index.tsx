import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";

import { useContext, useEffect, useState } from 'react';
import { CurrentConnectionContext, GlobalContext, SocketContext } from './_app';
import { useRouter } from 'next/router';

enum LogLevel {
  Disabled = 0,
  Errors = 1,
  Warnings = 2,
  All = 3
}
import type { DataConnection, Peer } from "peerjs"

import QuickModal from '@/components/QuickModal';
import JoinScreen from '@/components/JoinScreen';

export default function Home() {
  const peer = useContext(SocketContext);
  const connRef = useContext(CurrentConnectionContext);
  const [state, setGlobalState] = useContext(GlobalContext);
  const [code, setCode] = useState("");
  const [isLoadingChat, setisLoadingChat] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  const [idCopy, setIdCopy] = useState(false);
  const router = useRouter();

  function onPressJoin(event) {
    event.preventDefault();
    console.log("Connecting to chat...", code);
    connRef.current = peer.current.connect(code);
    console.log(connRef.current);
    setisLoadingChat(true);

    connRef.current.on("open", () => {
      console.log("Connected!");
      setisLoadingChat(false);
      router.push('/chat');
    })
  }

  useEffect(() => {
    // No reason for doing this, websocket error from next js is a wsl thing (restart pc)
    // https://github.com/vercel/next.js/issues/30491#issuecomment-972811344
    // connRef.current = null;
    // peerRef.current?.destroy();
    // peerRef.current = null;

    connRef.current?.close();
    let HOST = process.env.NEXT_PUBLIC_HOST;
    let PORT = parseInt(process.env.NEXT_PUBLIC_PORT);

    if (window.location.hostname == 'localhost') {
      HOST = 'localhost';
      PORT = 9000;
    }

    const onPeerConnection = (conn: DataConnection) => {
      connRef.current = conn;
      console.log("Someone decided to join.");
      router.push("/chat");
    }

    const importPeer = async () => {
      // loading library first 
      // Tested that the network import only happens once on page load
      const PeerClass = (await import('peerjs')).default
      peer.current = new PeerClass({
        host: HOST,
        port: PORT,
        path: process.env.NEXT_PUBLIC_PEERPATH,
        debug: LogLevel.All
      }) as Peer;

      // peer.current will be re-generated everytime page is loaded
      setGlobalState({
        ...state,
        isLoadingPeer: true,
        peerId: "",
      })

      console.log("Making new peer.");
      peer.current.on("open", (id) => {
        setGlobalState({
          ...state,
          isLoadingPeer: false,
          peerId: id,
        })
      })
      // when peer connects to us
      peer.current.on("connection", onPeerConnection);
    }
    importPeer();
    return () => {
      peer.current?.off('connection', onPeerConnection);
    }
  }, [])

  return (
    <>
      {/* Fast Track MODAL */}
      <QuickModal peerId={state.peerId} />

      {/* TOAST */}
      <div className={`animate-bounce select-none toast transition-opacity duration-300 text-white ${idCopy ? 'opacity-100' : 'opacity-0'}`}>
        <div className="alert text-white">
          <div>
            <span>Connection ID copied.</span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="navbar bg-lavender px-8">
        <div className="navbar-left px-8 opacity-0">
        </div>
        <div className="flex-1 flex justify-center mr-auto ml-auto navbar-center">
          <button className="btn btn-ghost flex justify-center align-items h-28 focus:outline-none" onClick={() => router.push("/")}>
            <img className="object-contain h-full w-full" src="/wlogo.svg" />
          </button>
        </div>
        <div className="navbar-right">
          <label htmlFor="my-modal-4" className="btn btn-ghost">
            <img className="object-fit h-10 w-10" src="/link.svg" />
          </label>
        </div>
      </div>


      <main className={styles.main + "min-h-screen bg-french-gray"}>
        <div className="flex flex-col justify-items-center items-center h-screen">
          {state.isLoadingPeer
            ?
            <div className='mt-10 animate-pulse rounded bg-french-gray font-link text-ultra-violet'>Loading
            </div>
            :
            <>
                {!cameraScreen ?
                  <div className="flex flex-col justify-center items-center pt-16">
                    <h1 className="text-5xl text-ultra-violet font-link">SCAN</h1>
                    <h2 className="text-2xl text-ultra-violet font-link">someone joins you</h2>
                    <QRCode className="qr-code justify-centre py-6" value={state.peerId} />
                    <div className="cursor-pointer transition duration-300 hover:scale-110">
                      <code
                        onClick={() => {
                          setIdCopy(true);
                          setTimeout(() => setIdCopy(false), 2000);
                          navigator.clipboard.writeText(state.peerId)
                        }}
                        className="text-dim-gray bg-french-gray-lite rounded-lg font-link p-1">{state.peerId}
                      </code>
                    </div>
                    <div className="flex flex-row pt-6">
                      <form onSubmit={onPressJoin}>
                        <input
                          type="text"
                          placeholder="enter code..."
                          className="input w-full max-w-xs bg-white text-dim-gray font-link"
                          onChange={(e) => { setCode(e.target.value) }}
                        />
                      </form>
                      <button
                        className="btn font-link focus:outline-none"
                        onClick={onPressJoin}>Join
                      </button>
                    </div>
                  </div>
                  :
                  <JoinScreen />
                }
                <div className="p-6">
                  <button
                    className="btn bg-ultra-violet text-french-gray-lite hover:bg-maize-crayola hover:text-black focus:outline-none border-none"
                    onClick={() => {
                      setIdCopy(false);
                      setCameraScreen(!cameraScreen);
                    }}>
                    open scanner
                  </button>
                </div>
              </>
          }
            </div>
      </main>
    </>
  )
}
