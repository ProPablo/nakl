import { useRouter } from 'next/router'
import type { DataConnection } from 'peerjs';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../_app';
import { setupPeerPage } from '..';

export default function QuickPage() {
	const [state, setGlobalState] = useContext(GlobalContext);

	const router = useRouter();
	// User A's ID (one already on the website)
	const id = router.query.id as string;
	console.log("ROUTER QUERY:" + id);

	useEffect(() => {

		const onPeerConnection = () => {
			console.log("Connected.");
			router.push("/chat");
		}
		const onPeerOpened = (pid: string) => {
			setGlobalState({
				...state,
				isLoadingPeer: false,
				peerId: pid,
			})
			// Connect to the other ID (userA) immediately
			console.log("Connecting to User A's chat: ", id);
			window.NAKL_CONNECTION = window.NAKL_PEER.connect(id);
			window.NAKL_CONNECTION.on("open", onPeerConnection);
		}

		const setupPage = async () => {
			await setupPeerPage();

			setGlobalState({
				...state,
				isLoadingPeer: true,
				peerId: "",
			})
			window.NAKL_PEER.on("open", onPeerOpened);
		}

		setupPage();
		return () => {
			window.NAKL_PEER?.off("open", onPeerOpened);
			window.NAKL_CONNECTION?.off("open", onPeerConnection);
		}
	}, [id])

	return (
		<div className='min-h-screen min-w-screen p-96 bg-french-gray font-link text-ultra-violet text-center'>Loading
		</div>
	)
}
