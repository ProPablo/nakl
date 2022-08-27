import React, { createContext, RefObject, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Peer, { DataConnection } from 'peerjs';
import QRCode from 'react-qr-code';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import JoinIndex from './pages/JoinIndex';
import JoinPage from './pages/JoinPage';
import ChatPage from './pages/ChatPage';
import { Ref } from 'react';
import IndexPage from './pages/Index';


export let peer: Peer;
export let connection: DataConnection;


// export function usePrevious(value: any) {
//     const ref = useRef();
//     useEffect(() => {
//       ref.current = value;
//     });
//     return ref.current;
// }
// export const SetConnectionDelegate = (conn: DataConnection) => {
//   connection = conn;
// }

export const SocketContext = createContext<Peer | null>(null);
// export const CurrentConnectionContext = createContext<DataConnection | null>(null);
export const CurrentConnectionContext = createContext<RefObject<DataConnection | null>>(null);
export const GlobalContext = React.createContext<[GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>]>(null);

export interface GlobalState {
  peerId: string,
}

const initialState: GlobalState = {
  peerId: '',
}


function App() {
  const connRef = useRef<DataConnection>(null);
  const stateAndDispatch = useState(initialState);

  let navigate = useNavigate();

  useEffect(() => {
    peer = new Peer();
    console.log("Making new peer");
    peer.on("open", (id) => {
      // setPeerId(id);
       stateAndDispatch[1]({
        ...initialState,
        peerId: id,
      })
    })
    //This is when a peer connects to us
    peer.on("connection", (conn) => {
      connRef.current = conn;
      console.log("Someone decided to join ")
      navigate("/chat");
    })

  }, []);



  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >

  //         <QRCode value={peerId} />
  //         {peerId}
  //       </a>
  //     </header>
  //   </div>
  // );
  return (
        <GlobalContext.Provider value={stateAndDispatch}>
    <SocketContext.Provider value={peer} >
      <CurrentConnectionContext.Provider value={connRef} >
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="join" element={<JoinIndex />} >
              <Route path=":peerId" element={<JoinPage />} />
            </Route>
            {/* <Route path="invoices" element={<Invoices />} /> */}
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
      </CurrentConnectionContext.Provider></SocketContext.Provider> </GlobalContext.Provider>
  )
}

export default App;
