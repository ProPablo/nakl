import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../App";

const JoinPage = () => {

  let params = useParams();

  const peer = useContext(SocketContext);
  useEffect(() => {

    if (params.id) {
      var conn = peer?.connect(params.id);
      if (!conn) return;
      conn.on("open", () => {

      })

    }

    return () => {
    }
  }, [])
  return (<div>LOADING...</div>)

}


export default JoinPage;