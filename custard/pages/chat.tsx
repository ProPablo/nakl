import Head from 'next/head'
import Image from 'next/image'
import custard from '../public/custard.svg';
import styles from '@/styles/Home.module.css'
import QRCode from "react-qr-code";

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
        <div className="container holder" >
          {/* <h1>Ask your friend to get on this website: </h1> */}
          <Image
            alt="Custard"
            src={custard}
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
          <h1>Chat</h1>
          
        </div>
      </main>
    </>
  )
}
