import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { SocketContext } from "../_app";

const JoinPage = () => {
  const router = useRouter();
  const { id:friendId } = router.query;
  
  const peer = useContext(SocketContext);
  useEffect(() => {

    peer?.on()
  
    return () => {
    }
  }, [])
  

}

export default JoinPage;