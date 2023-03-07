import Head from 'next/head'

import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";

// Constants
const PEER_SERVER = 'peer.kongroo.xyz';


export default function Home() {

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
          <button className="btn btn-primary">Join</button>
          <QRCode
            className="qr-code justify-centre" value={"custard"} />
          {/* value={state.peerId} /> */}

          {/* 
          <code>{state.peerId}</code>

          <Link to="/join">
          </Link> */}

          {/* {state.isLoadingPeer ? <div> Loading </div> : */}
          {/* } */}
        </div>
      </main>
    </>
  )
}
