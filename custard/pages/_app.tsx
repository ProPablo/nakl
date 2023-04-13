import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { createContext, MutableRefObject, useEffect, useRef, useState } from 'react';
import '@/styles/globals.css'
import '../styles/Chat.scss'
import Head from 'next/head';
import GlobalErrorProvider from '@/components/GlobalErrorProvider';

type GlobalContextValue = [GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>];
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
      <GlobalErrorProvider>
        <Head>
          <title>NAKL</title>
          <meta name="description" content="Not a Keylogger" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </GlobalErrorProvider>
    </GlobalContext.Provider>
  )
}
