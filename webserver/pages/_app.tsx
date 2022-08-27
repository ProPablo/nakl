import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, Dispatch, Ref, RefObject, useReducer, useRef } from 'react'
import { Peer } from "peerjs";

export const SocketContext = createContext<Peer| null>(null);
var peer = new Peer();
console.log("Initial page render");

function MyApp({ Component, pageProps }: AppProps) {

  // const localConnection = new RTCPeerConnection();
  // const sendChannel = localConnection.createDataChannel('sendDataChannel');

  return (
    <SocketContext.Provider value={peer}>
        <Component {...pageProps} />
    </SocketContext.Provider>
  );
}

export default MyApp
