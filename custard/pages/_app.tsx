import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { createContext, MutableRefObject, useEffect, useRef, useState } from 'react';
import '@/styles/globals.css'
import type { Peer, DataConnection } from "peerjs"
import '../styles/Chat.scss'  

type GlobalContextValue =[GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>];
export const GlobalContext = createContext<GlobalContextValue>({} as GlobalContextValue);

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
  const stateAndDispatch = useState(initialState);
  const router = useRouter(); // for navigation

  useEffect(() => {
    // ---- not necessary
    // if (peerRef.current == null) {
    //   console.log("Going home.");
    //   // This doesn't create an infinite loop cos NextJS smart :)
    //   router.push("/");
    // }
  }, []);

  return (

    <GlobalContext.Provider value={stateAndDispatch}>
          <Component {...pageProps} />
    </GlobalContext.Provider>
  )
}
