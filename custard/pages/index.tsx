import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";
import type { OnResultFunction } from 'react-qr-reader';

import { useContext, useEffect, useState } from 'react';
import { CurrentConnectionContext, GlobalContext, SocketContext } from './_app';
import { useRouter } from 'next/router';
import type { Peer } from "peerjs"

import dynamic from 'next/dynamic';
const QrReader = dynamic(() => import("react-qr-reader").then((qr) => qr.QrReader), { ssr: false });

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

  const handleResult: OnResultFunction = (res, err) => {
    console.log("SUP", res)
    if (!!res && !isLoadingChat) {
      const id = res.getText();
      console.log("Connecting to chat.", id);
      connRef.current = peer.current.connect(id);
      console.log(connRef.current);
      setisLoadingChat(false);

      connRef.current.on("open", () => {
        console.log("Connected.");
        setisLoadingChat(false);
        router.push("/chat");
      })
    }
  }

  useEffect(() => {
    connRef.current?.close();
    const HOST = process.env.NEXT_PUBLIC_HOST;
    const PORT = parseInt(process.env.NEXT_PUBLIC_PORT);

    const importPeer = async () => {
      const PeerClass = (await import('peerjs')).default // loading library first
      peer.current = new PeerClass({
        host: HOST,
        port: PORT,
        path: '/peer'
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
      peer.current.on("connection", (conn) => {
        connRef.current = conn;
        console.log("Someone decided to join.");
        router.push("/chat");
      })
    }
    importPeer();
  }, [])

  const videoStyle: React.CSSProperties = {
    position: "relative",
  }
  const videoContainerStyle: React.CSSProperties = {
    paddingTop: "0%",
    height: "218.5px",
    borderRadius: "25px",
  }

  return (
    <>
      <div className="navbar bg-lavender">
        <div className="flex-1 flex justify-center mr-auto navbar-center">
          <button className="btn btn-ghost flex justify-center align-items h-28" onClick={() => router.push("/")}>
            <img className="object-contain h-full w-full" src="/wlogo.svg" />
          </button>
        </div>
      </div>

      <main className={styles.main + "min-h-screen bg-french-gray"}>
        <div className="flex flex-col justify-items-center items-center h-screen">
          {state.isLoadingPeer
            ?
            <div className='mt-10 animate-pulse rounded bg-french-gray font-link text-ultra-violet'>LOADING
            </div>
            :
            <>
              <div className={`select-none toast transition-opacity duration-300 text-white ${idCopy ? 'opacity-100' : 'opacity-0'}`}>
                <div className="alert text-white">
                  <div>
                    <span>Connection ID copied.</span>
                  </div>
                </div>
              </div>
              {!cameraScreen ?
                <div className="flex flex-col justify-center items-center pt-16">
                  <h1 className="text-5xl text-ultra-violet font-link">SCAN</h1>
                  <h2 className="text-2xl text-ultra-violet font-link">someone joins you</h2>
                  <QRCode className="qr-code justify-centre py-6" value={state.peerId} />
                  <div className="cursor-pointer">
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
                      className="btn font-link"
                      onClick={onPressJoin}>Join
                    </button>
                  </div>
                </div>
                :
                <div className="flex flex-col justify-center items-center pt-16">
                  <h1 className="text-5xl text-ultra-violet font-link">JOIN</h1>
                  <h2 className="text-2xl text-ultra-violet font-link">you join someone</h2>
                  {isLoadingChat ?
                    <div className='p-28 mt-10 animate-pulse rounded bg-french-gray-lite font-link text-ultra-violet'>LOADING
                    </div>
                    :
                    <div className='flex justify-center items-center py-8'>
                      <QrReader
                        videoStyle={videoStyle}
                        videoContainerStyle={videoContainerStyle}
                        onResult={handleResult}
                        constraints={{ facingMode: 'environment' }}
                      />
                    </div>
                  }
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
                </div>
              }
              <div className="p-6">
                <button
                  className="btn font-link"
                  onClick={() => {
                    setIdCopy(false);
                    setCameraScreen(!cameraScreen);
                  }}>
                  <img className="object-contain h-full w-full " src="/camera.svg" />
                </button>
              </div>
            </>
          }
        </div>
      </main>
    </>
  )
}
