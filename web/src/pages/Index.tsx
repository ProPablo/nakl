import { useContext, useEffect } from "react";
import './../App.css';
import QRCode from "react-qr-code";
import { connection, GlobalContext, SocketContext } from "../App";

const IndexPage = () => {

  const peer = useContext(SocketContext);
  const [state, setGlobalState] = useContext(GlobalContext);

  useEffect(() => {


  }, [])

  return (<div> ALL MESSAGE
    
    <QRCode 
    style={{margin: 10}}
    className="qr-code" value={state.peerId} />

    {state.peerId}
  </div>)

}

export default IndexPage;