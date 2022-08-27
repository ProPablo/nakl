import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { SocketContext } from "../_app";

const JoinPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if(typeof(id) !="string") return;

  
  const peer = useContext(SocketContext);
  useEffect(() => {

    peer?.connect(id);
  
    return () => {
    }
  }, [])
  

}


export default JoinPage;