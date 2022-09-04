import { useContext, useEffect } from "react";
import QRCode from "react-qr-code";
import { CurrentConnectionContext, GlobalContext, SocketContext } from "../App";
import Peer from "peerjs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import custard from '../custard.svg';
import './Home.css';

const PEER_SERVER = 'peer.kongroo.xyz';
export enum HomePageType {
  DEFAULT,
  FALLBACK,
  MONIKER,
}
export interface HomePageProps {
  type: HomePageType
}

const HomePage = ({ type }: HomePageProps) => {

  const peer = useContext(SocketContext);
  const [state, setGlobalState] = useContext(GlobalContext);
  const connRef = useContext(CurrentConnectionContext);
  let navigate = useNavigate();

  useEffect(() => {
    switch (type) {
      case HomePageType.DEFAULT:
        peer.current = new Peer({
          host: PEER_SERVER,
          port: process.env.NODE_ENV == "development" ? 80 : 443,
          path: '/peer'
        });
        break;
      case HomePageType.FALLBACK:
        peer.current = new Peer();
        break;
      case HomePageType.MONIKER:
        peer.current = new Peer("Hey man", {
          host: PEER_SERVER,
          port: 80,
          path: '/peer'
        });
        break;

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

    <div className="container holder" >
      {/* <h1>Ask your friend to get on this website: </h1> */}
      <img src={custard}
        className="custard"
      />
      <h1>Custard</h1>

      {state.isLoadingPeer ? <div> Loading </div> :
        <div className="holder">
          <QRCode
            className="qr-code" value={state.peerId} />

          <code>{state.peerId}</code>

          <Link to="/join">
            <button data-tooltip="Tooltip" type="button">
              Want to join a dude?
            </button>
          </Link>

        </div>
      }
    </div>
  )

}

export default HomePage;