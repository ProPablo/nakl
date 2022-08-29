import { useContext, useEffect } from "react";
import './../App.css';
import QRCode from "react-qr-code";
import { CurrentConnectionContext, GlobalContext, SocketContext } from "../App";
import Peer from "peerjs";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const PEER_SERVER = 'https://peer.kongroo.xyz';


const IndexPage = () => {

  const peer = useContext(SocketContext);
  const [state, setGlobalState] = useContext(GlobalContext);
  const connRef = useContext(CurrentConnectionContext);
  let navigate = useNavigate();

  //Only create peer on this page
  useEffect(() => {
    //Confirm if current already exists otherwise this page can be used to 
    // peer.current = new Peer();
    peer.current = new Peer('signal', {
      host: PEER_SERVER,
      port: 9000,
      path: '/server'
    });
    setGlobalState({
      ...state,
      isLoadingPeer: true,
      peerId: "",
    })

    console.log("Making new peer");
    peer.current.on("open", (id) => {
      setGlobalState({
        ...state,
        isLoadingPeer: false,
        peerId: id,
      })
    })
    //This is when a peer connects to us
    peer.current.on("connection", (conn) => {
      connRef.current = conn;
      console.log("Someone decided to join ")
      navigate("/chat");
    })

  }, [])

  return (<div>
    {state.isLoadingPeer ? <div> Loading </div> :
      <div>
        <QRCode
          style={{ margin: 10 }}
          className="qr-code" value={state.peerId} />

        {state.peerId}

        <Link to="/join">
          <button type="button">
            Want to join a dude?
          </button>
        </Link>

      </div>
    }
  </div>)

}

export default IndexPage;