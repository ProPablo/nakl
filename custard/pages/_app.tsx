import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Component, useEffect, useRef, useState } from 'react';

import '@/styles/globals.css'


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter(); // for navigation
  const [peerId, setPeerId] = useState("");

  const connRef = useRef<any>(null);

  const importPeer = async () => {
    const Peer = (await import('peerjs')).default
    const peer = new Peer();

    peer.on("open", (id: any) => {
      setPeerId(id);
    })

    //This is when a peer connects to us
    peer.on("connection", (conn: any) => {
      connRef.current = conn;
      router.push("/chat");
    })
  }
  useEffect(() => {
    importPeer();

    console.log("Making new peer");

  }, []);

  return <Component {...pageProps} />
}
