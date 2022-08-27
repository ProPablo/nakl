import { useState } from "react";
import LoadingPage from "./loading";

export interface ConnectionObject {
  sendChannel: RTCDataChannel
  receiveChannel: RTCDataChannel

  localConnection: RTCPeerConnection
  remoteConnection: RTCPeerConnection
}

const ChatPage = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [connection, setConnection] = useState<ConnectionObject | null>(null);

  return (<div> {connection || <LoadingPage />}</div>)
}

export default ChatPage; 