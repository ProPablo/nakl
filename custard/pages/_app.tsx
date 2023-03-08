import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { useEffect, useRef, useState } from 'react';

import type { Peer, DataConnection } from 'peerjs'
export let peer: Peer;

import '@/styles/globals.css'


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter(); // for navigation

  const connRef = useRef<any>(null);
  // console.log("Loaded main page")
    //This is when a peer connects to us
    // peer.on("connection", (conn: any) => {
    //   connRef.current = conn;
    //   // router.push("/chat");
    // })
  // }

  // useEffect(() => {
  //   //Keep in mind React strict mode makes it so that this runs twice but we should be able to combat that by doing the checks on peerref and router confining (like before)
  //   asyncFunc();
  //   console.log("Loaded main page")

    // const PeerImported = dynamic(() => import('peerjs')).
    // const Dynamic = dynamic(() => (import('peerjs'))
    //   .then(({ default: Peer }) => (
    //     peer = new Peer();
    // const Peer = (require('peerjs'))

    // console.log("Making new peer");
    // Peer.on("open", (id: any) => {
    //   setPeerId(id);
    // })
    // //This is when a peer connects to us
    // Peer.on("connection", (conn: any) => {
    //   connRef.current = conn;
    //   router.push("/chat");

    // })
  // }, []);

  return <Component {...pageProps} />
}
