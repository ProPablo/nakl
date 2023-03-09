import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";
import { useContext, useEffect } from 'react';
import { CurrentConnectionContext, GlobalContext, SocketContext } from './_app';
import { useRouter } from 'next/router';
import type { Peer } from "peerjs"


export default function Home() {
  const peer = useContext(SocketContext);
  const [state, setGlobalState] = useContext(GlobalContext);
  const connRef = useContext(CurrentConnectionContext);
  const router = useRouter();
  
  useEffect(() => {
    const HOST = process.env.NEXT_PUBLIC_HOST;
    const PORT = parseInt(process.env.NEXT_PUBLIC_PORT);
    const importPeer = async () => {
      const PeerClass = (await import('peerjs')).default // loading library first
      peer.current = new PeerClass({
        host: HOST,
        port: PORT,
        path: '/peer'
      }) as Peer;
      console.log(HOST, PORT)

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

  return (
    <>
      <Head>
        <title>NAKL</title>
        <meta name="description" content="Not a Keylogger" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/custard.svg" />
      </Head>

      <main className={styles.main}>
        <div className="flex flex-col justify-center items-center h-screen">
          <img className="w-16 md:w-32 lg:w-48" src='/custard.svg' />
          <h1 className="text-3xl font-bold underline text-center">
            Custard
          </h1>
          {state.isLoadingPeer ?
            <div>
              <h1 className="text-3xl font-bold underline text-center">LOADING</h1>
            </div>
            :
            <div>
              <QRCode className="qr-code justify-centre" value={state.peerId} />
              <code>{state.peerId}</code>
              <button className="btn btn-primary">Join</button>
            </div>
          }
        </div>
      </main>
    </>
  )
}
