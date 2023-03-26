import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { createContext, MutableRefObject, useEffect, useRef, useState } from 'react';
import '@/styles/globals.css'
import type { Peer, DataConnection } from "peerjs"
import '../styles/chatscope/customChat.scss'
// import '../styles/chatscope/main.scss'

export const GlobalContext = createContext(null);
export const SocketContext = createContext(null);
export const CurrentConnectionContext = createContext(null);

// Defining global state interfaces and default values
export interface GlobalState {
  peerId: string,
  isLoadingPeer: boolean,
}

const initialState: GlobalState = {
  peerId: '',
  isLoadingPeer: true,
}

// Defining constants to be used for state
const FALLBACK_PAGE = "fallback";
const MONIKER_PAGE = "pc";
const HomePages = [FALLBACK_PAGE, MONIKER_PAGE]

export default function App({ Component, pageProps }: AppProps) {
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const stateAndDispatch = useState(initialState);
  const router = useRouter(); // for navigation

  useEffect(() => {
    if (peerRef.current == null && !HomePages.some(h => h == router.pathname)) {
      console.log("Going home.");
      router.push("/");
    }
  }, []);

  return (

    <GlobalContext.Provider value={stateAndDispatch}>
      <SocketContext.Provider value={peerRef}>
        <CurrentConnectionContext.Provider value={connRef}>
          <Component {...pageProps} />
        </CurrentConnectionContext.Provider>
      </SocketContext.Provider>
    </GlobalContext.Provider>
  )
}
