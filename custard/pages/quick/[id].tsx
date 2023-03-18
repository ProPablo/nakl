import { useRouter } from 'next/router'
import Peer from 'peerjs';
import { useContext, useEffect } from 'react';
import { CurrentConnectionContext, GlobalContext, SocketContext } from '../_app';

export default function QuickPage() {
	const peer = useContext(SocketContext);
	const connRef = useContext(CurrentConnectionContext);
	const [state, setGlobalState] = useContext(GlobalContext);

	const router = useRouter();
	// User A's ID (one already on the website)
	const { id } = router.query;
	useEffect(() => {
		// console.log(id);
		connRef.current?.close();
		const HOST = process.env.NEXT_PUBLIC_HOST;
		const PORT = parseInt(process.env.NEXT_PUBLIC_PORT);

		const importPeer = async () => {
			const PeerClass = (await import('peerjs')).default // loading library first
			peer.current = new PeerClass({
				host: HOST,
				port: PORT,
				path: '/peer'
			}) as Peer;

			// peer.current will be re-generated everytime page is loaded
			setGlobalState({
				...state,
				isLoadingPeer: true,
				peerId: "",
			})

			//   User B
			console.log("Making new peer.");
			peer.current.on("open", (id) => {

				setGlobalState({
					...state,
					isLoadingPeer: false,
					peerId: id,
				})

				//Connect to the other ID (userA) immediately 
				// Use this logic to invoke the connection
				// const handleResult: OnResultFunction = (res, err) => {
				//  if (!!res && !isLoadingChat) {
				//    const id = res.getText();
				//    console.log("Connecting to chat.", id);
				//    connRef.current = peer.current.connect(id);
				//    console.log(connRef.current);
				//    setisLoadingChat(false);
				//    connRef.current.on("open", () => {
				//      console.log("Connected.");
				//      setisLoadingChat(false);
				//      router.push("/chat");
				//    })
				//  }
				// }
				

			})

		}
		importPeer();
	}, [])
	return (
		<div className="min-h-screen min-w-screen">
			{id}
		</div>
	)
}
