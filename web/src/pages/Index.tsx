import { useContext, useEffect } from "react";
import './../App.css';
import QRCode from "react-qr-code";
import { CurrentConnectionContext, GlobalContext, SocketContext } from "../App";
import Peer from "peerjs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const PEER_SERVER = 'https://peer.kongroo.xyz';
import logo from '../custard.svg';

const IndexPage = () => {

  const peer = useContext(SocketContext);
  const [state, setGlobalState] = useContext(GlobalContext);
  const connRef = useContext(CurrentConnectionContext);
  let navigate = useNavigate();
  const location = useLocation();

  //Only create peer on this page
  useEffect(() => {
    console.log({ location });
    //check query if has fallback in params
    if (location.hash == "fallback") {
      peer.current = new Peer();
    }
    else {
      peer.current = new Peer('signal', {
        host: PEER_SERVER,
        port: 9000,
        path: '/server'
      });
    }

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

  return (
    // TODO: add threejs canvas for miasma shader or some kind of movement that indicates something is happening
    //Is a custard jiggle based on mouse using ammo js and softbodies
    //While loading have animation for custard maybe even using marching cubes

    <div>
      <img src={logo} alt="logo" style={{ justifyContent: "center" }} />
      {state.isLoadingPeer ? <div> Loading </div> :
        <div style={{ flex: 1 }}>
          <QRCode
            style={{
              flex: 1,
              margin: "auto",
              justifyContent: "center",
              alignContent: "center",
              display: "block",

            }}
            className="qr-code" value={state.peerId} />

          {state.peerId}

          <Link to="/join">
            <button type="button">
              Want to join a dude?
            </button>
          </Link>

        </div>
      }
    </div>
    )

}

export default IndexPage;