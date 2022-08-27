import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, Dispatch, Ref, RefObject, useReducer, useRef } from 'react'
import { Socket } from 'socket.io-client';


//@ts-ignore
export const SocketContext = createContext<Socket>();

export enum SocketActionName {
  HOST = "host",
  CLIENT = "client"
}
export interface SocketState {
  isConnected: boolean
  isHost: boolean
  friendId: string
  selfID: string
}

const initialSocketState: SocketState = {
  isConnected: false,
  isHost: false,
  friendId: "",
  selfID: ""
}

type SocketAction =
  { type: SocketActionName.HOST, selfID: string } |
  { type: SocketActionName.CLIENT, friendID: string }

const SocketReducer = (state: SocketState, action: SocketAction): SocketState => {
  console.log({ state, action });
  switch (action.type) {
    case SocketActionName.HOST:
      return { ...state, isConnected: true, isHost: true, selfID: action.selfID };
    case SocketActionName.CLIENT:
      return { ...state, isHost: false, friendId: action.friendID };
  }
}

export const SocketStateContext = createContext<[SocketState, Dispatch<SocketAction>]>([initialSocketState, () => null]);
SocketStateContext.displayName = "TourStateContext";

function MyApp({ Component, pageProps }: AppProps) {
  const socketRef = useRef<Socket | null>(null);
  const socketStateReducer = useReducer(SocketReducer, initialSocketState);

  // const localConnection = new RTCPeerConnection();
  // const sendChannel = localConnection.createDataChannel('sendDataChannel');

  return (
    <SocketContext.Provider value={socketRef}>
      <SocketStateContext.Provider value={socketStateReducer}>
        <Component {...pageProps} />
      </SocketStateContext.Provider>
    </SocketContext.Provider>
  );
}

export default MyApp
