import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, Dispatch, Ref, RefObject, useEffect, useReducer, useRef, useState } from 'react'
import { Peer } from 'peerjs';


export const SocketContext = createContext<any>(null);
// let peer: Peer | null = null;
console.log("Initial page render");

function MyApp({ Component, pageProps }: AppProps) {

  // const localConnection = new RTCPeerConnection();
  // const sendChannel = localConnection.createDataChannel('sendDataChannel');
  const peerRef = useRef<any>(null);
  const [peer , setPeer] = useState<any>(null);


  useEffect(() => {
    if (peerRef.current == null) {

      import('peerjs').then(({ default: Peer }) => {
        const newPeer = new Peer();
        setPeer(newPeer);
        peerRef.current = peer;
      }
      )
    };

  }, [])


  return (
    <SocketContext.Provider value={peer}>
      <Component {...pageProps} />
    </SocketContext.Provider>
  );
}

export default MyApp
