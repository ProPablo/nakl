import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { createContext, MutableRefObject, useEffect, useRef, useState } from 'react';
import '@/styles/globals.css'
import '../styles/Chat.scss'
import Head from 'next/head';

type GlobalContextValue = [GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>];
export const GlobalContext = createContext<GlobalContextValue>({} as GlobalContextValue);

type ErrorContextValue = React.Dispatch<React.SetStateAction<string | null>>;
export const ErrorContext = createContext<ErrorContextValue>({} as ErrorContextValue);

// Defining global state interfaces and default values
export interface GlobalState {
  peerId: string,
  isLoadingPeer: boolean,
}

const initialState: GlobalState = {
  peerId: '',
  isLoadingPeer: true,
}

const ERROR_TOAST_DELAY = 3000;

export default function App({ Component, pageProps }: AppProps) {
  const stateAndDispatch = useState(initialState);
  const router = useRouter(); // for navigation
  const [error, setError] = useState<string | null>(null);
  const [remainingError, setRemainingError] = useState<string>("");

  // Handles error changing and going back to null after some time
  // https://github.com/craig1123/react-recipes/blob/master/src/useDebounce.js for inspiration
  useEffect(() => {
    if (error == null) return;
    setRemainingError(error);

    let timer = setTimeout(() => { setError(null) }, ERROR_TOAST_DELAY);

    return () => {
      clearTimeout(timer);
    }
  }, [error]);

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
      <ErrorContext.Provider value={setError}>

        <Head>
          <title>NAKL</title>
          <meta name="description" content="Not a Keylogger" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />

        {/* toast for persistance through pages  */}
        <div className={`toast toast-start transition-opacity text-white ${!!error ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50`}>
          <div className="alert alert-error shadow-lg text-white">
            <div>
              <span>Error Encountered: {remainingError}</span>
            </div>
          </div>
        </div>
      </ErrorContext.Provider>
    </GlobalContext.Provider>
  )
}
