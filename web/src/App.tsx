import React, { createContext, MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Peer, { DataConnection } from 'peerjs';
import QRCode from 'react-qr-code';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import JoinIndex from './pages/JoinIndex';
import ChatPage from './pages/ChatPage';
import { Ref } from 'react';
import HomePage, { HomePageType } from './pages/HomePage';

//https://fonts.google.com/specimen/Permanent+Marker


export const SocketContext = createContext<MutableRefObject<Peer>>(null);
export const CurrentConnectionContext = createContext<MutableRefObject<DataConnection>>(null);
export const GlobalContext = createContext<[GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>]>(null);

export interface GlobalState {
  peerId: string,
  isLoadingPeer: boolean
}

const initialState: GlobalState = {
  peerId: '', isLoadingPeer: true
}
const FALLBACK_PAGE = "fallback";
const MONIKER_PAGE = "pc";
const HomePages = [FALLBACK_PAGE, MONIKER_PAGE];


function App() {
  const peerRef = useRef<Peer>(null);
  const connRef = useRef<DataConnection | null>(null);
  const stateAndDispatch = useState(initialState);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    //This use effect gets run for all routs every time
    if (peerRef.current == null && !HomePages.some(h => h == location.pathname)) {
      if (process.env.NODE_ENV == "development") return;
      console.log("going home");
      navigate("/");
    }

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
      <SocketContext.Provider value={peerRef} >
        <CurrentConnectionContext.Provider value={connRef} >
          <Routes>
            <Route path="/" element={<HomePage type={HomePageType.DEFAULT}/>} />
            <Route path="fallback" element={<HomePage type={HomePageType.FALLBACK}/>} />
            <Route path="pc" element={<HomePage type={HomePageType.MONIKER}/>} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="join" element={<JoinIndex />} >
              {/* <Route path=":peerId" element={<JoinPage />} /> */}
            </Route>
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
