import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";
import { OnResultFunction } from 'react-qr-reader';

import { Component, useContext, useEffect, useState } from 'react';
import { CurrentConnectionContext, GlobalContext, SocketContext } from './_app';
import { useRouter } from 'next/router';
import type { Peer } from "peerjs"

// import dynamic from 'next/dynamic';
// export default dynamic(() => import("react-qr-reader"), { ssr: false });
// import QrReader from "../components/QrReader";

export default function Home() {
  const peer = useContext(SocketContext);
  const connRef = useContext(CurrentConnectionContext);
  const [state, setGlobalState] = useContext(GlobalContext);
  const [code, setCode] = useState("");
  const [isLoadingChat, setisLoadingChat] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  const router = useRouter();


  function onPressJoin() {
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
    height: "85%",
    paddingTop: "2rem"
  }
  const videoContainerStyle: React.CSSProperties = {
    paddingTop: "100%"
  }

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
          {state.isLoadingPeer
            ?
            <div>
              <h1 className="text-3xl font-bold underline text-center">LOADING</h1>
            </div>
            :
            <>
              {!cameraScreen ?
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
                </div>
                :
                <div className="flex flex-col justify-center items-center pt-16">
                  <h1 className="text-5xl text-ultra-violet font-link">JOIN</h1>
                  <h2 className="text-2xl text-ultra-violet font-link">you join someone</h2>
                  {
                    isLoadingChat ?             
                    <div>
                      <h1 className="text-3xl font-bold underline text-center">LOADING</h1>
                    </div>
                    :
                    <div>
                    </div>
                    // <QrReader
                    //   className='justify-centre py-6'
                    //   videoStyle={videoStyle}
                    //   videoContainerStyle={videoContainerStyle}
                    //   onResult={handleResult}
                    //   constraints={{ facingMode: 'environment' }}
                    // />
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
            </>
          }
          <div className="p-6">
            <button
              className="btn font-link"
              onClick={() => setCameraScreen(!cameraScreen)}>
              <img className="object-contain h-full w-full " src="/camera.svg" />
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
