import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";

import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from './_app';
import { useRouter } from 'next/router';

enum LogLevel {
  Disabled = 0,
  Errors = 1,
  Warnings = 2,
  All = 3
}
import type { DataConnection, Peer, PeerJSOption } from "peerjs"

import QuickModal from '@/components/QuickModal';
import JoinScreen from '@/components/JoinScreen';
import { useError } from '@/hooks/useError';

export const setupPeerPage = async () => {
  window.NAKL_CONNECTION?.close();
  let HOST = process.env.NEXT_PUBLIC_HOST;
  let PORT = parseInt(process.env.NEXT_PUBLIC_PORT);
  let PEER_PATH = process.env.NEXT_PUBLIC_PEERPATH;

  if (window.location.hostname == 'localhost') {
    HOST = 'localhost';
    PORT = 9000;
  }

  // loading library first 
  // Tested that the network import only happens once on page load
  const PeerClass = (await import('peerjs')).default;
  const peerOptions: PeerJSOption = {
    host: HOST,
    port: PORT,
    debug: LogLevel.All,
    path: PEER_PATH
  };
  console.log(`Making new peer, connecting with options: `, peerOptions);

  // peer will be re-generated everytime page is loaded
  window.NAKL_PEER = new PeerClass(peerOptions);
}


export default function Home() {
  const [state, setGlobalState] = useContext(GlobalContext);
  const [code, setCode] = useState("");
  const [isLoadingChat, setisLoadingChat] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  const [idCopy, setIdCopy] = useState(false);
  const router = useRouter();
  const setError = useError();


  function onPressJoin(event) {
    if (!window.NAKL_PEER) return;
    event.preventDefault();
    console.log("Connecting to chat...", code);
    window.NAKL_CONNECTION = window.NAKL_PEER.connect(code);
    console.log(window.NAKL_CONNECTION);
    setisLoadingChat(true);

    window.NAKL_CONNECTION.on("open", () => {
      console.log("Connected!");
      setisLoadingChat(false);
      router.push('/chat');
    })
  }

  useEffect(() => {
    const onPeerConnection = (conn: DataConnection) => {
      window.NAKL_CONNECTION = conn;
      console.log("Someone decided to join.");
      router.push("/chat");
    }

    const onPeerOpened = (id: string) => {
      console.log(`Finished making Peer... ${id}`);
      setGlobalState({
        ...state,
        isLoadingPeer: false,
        peerId: id,
      });
    }


    const setupPage = async () => {
      await setupPeerPage();

      // For some reason its fine without placing the Dispatch in useffect dependancy
      setGlobalState({
        ...state,
        isLoadingPeer: true,
        peerId: "",
      })

      window.NAKL_PEER!.on("open", onPeerOpened);
      window.NAKL_PEER!.on("connection", onPeerConnection);
    }

    setupPage();
    return () => {
      console.log("Unsubscribing from events registered");
      window.NAKL_PEER?.off("open", onPeerOpened);
      window.NAKL_PEER?.off('connection', onPeerConnection);
    }
  }, [])

  return (
    <div className='overflow-x-hidden'>
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
      <div className="navbar bg-lavender px-10 z-10">

        {/* Workaround for centering the title div */}
        {/* <div className="navbar-left px-8 opacity-0" /> */}

        <div className="navbar-left">
          <button
            className="btn bg-ultra-violet text-french-gray-lite hover:bg-saffron hover:text-black focus:outline-none border-none"
            onClick={() => {
              setError("Hey man");
            }}>
            Test
          </button>
        </div>

        <div className="flex-1 flex justify-center mr-auto ml-auto navbar-center">
          <button className="btn btn-ghost flex justify-center align-items h-28 focus:outline-none" onClick={() => router.push("/")}>
            <img className="object-contain h-full w-full" src="/wlogo.svg" />
          </button>
        </div>


        <div className="navbar-right">
          <label htmlFor="quick-connect-modal" className="btn btn-ghost">
            <img className="object-fit h-10 w-10" src="/link.svg" />
          </label>
        </div>
      </div>

      <main className="flex flex-col overflow-auto items-center justify-around bg-french-gray">
        {state.peerId === ''
          ?
          <div className='h-[37.2rem] flex flex-col items-center justify-center animate-pulse rounded bg-french-gray font-link text-ultra-violet'>
            <p>Loading</p>
          </div>
          :
          <div className='flex-col items-center justify-center'>
            {!cameraScreen ?
              <div className="flex flex-col justify-center items-center pt-10">
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
            <div className="flex flex-col p-6 pb-12 items-center">
              <button
                className="btn bg-ultra-violet text-french-gray-lite hover:bg-saffron hover:text-ultra-violet font-link focus:outline-none border-none"
                onClick={() => {
                  setIdCopy(false);
                  setCameraScreen(!cameraScreen);
                }}>
                {!cameraScreen ?
                  "open scanner" :
                  "close camera"
                }
              </button>
            </div>
          </div>
        }
      </main>
      <footer className="footer footer-center p-9 bottom-0 bg-dim-gray text-base-content">
        <div>
          <p>Copyright © 2023 - All right reserved by kongi</p>
        </div>
      </footer>
    </div>
  )
}
