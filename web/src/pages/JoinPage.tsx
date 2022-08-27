import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CurrentConnectionContext, SocketContext } from "../App";

//Depreciated
const JoinPage = () => {

  let params = useParams();

  const peer = useContext(SocketContext);
  const connRef = useContext(CurrentConnectionContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (params.id) {
      var conn = peer.current.connect(params.id);
      if (!conn) return;
      conn.on("open", () => {
        connRef.current = conn;
        navigate('/chat');
      })

    }

    return () => {
    }
  }, [])
  return (<div>LOADING...</div>)

}


export default JoinPage;