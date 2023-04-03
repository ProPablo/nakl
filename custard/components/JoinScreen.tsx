import { SocketContext, CurrentConnectionContext, GlobalContext } from "@/pages/_app";
import router from "next/router";
import { useContext, useState } from "react";
import type { OnResultFunction } from 'react-qr-reader';
import dynamic from 'next/dynamic';

const QrReader = dynamic(() => import("react-qr-reader").then((qr) => qr.QrReader), { ssr: false });

const videoStyle: React.CSSProperties = {
	position: "relative",
}
const videoContainerStyle: React.CSSProperties = {
	paddingTop: "0%",
	height: "227px",
	borderRadius: "0.5rem",
}
export default function JoinScreen() {
	const peer = useContext(SocketContext);
	const connRef = useContext(CurrentConnectionContext);
	const [state, setGlobalState] = useContext(GlobalContext);
	const [isLoadingChat, setisLoadingChat] = useState(false);

	const handleResult: OnResultFunction = (res, err) => {
		if (!!res && !isLoadingChat) {
			const id = res.getText();
			console.log("Connecting to chat.", id);
			connRef.current = peer.current.connect(id);
			console.log(connRef.current);
			setisLoadingChat(false);

			connRef.current.on("open", () => {
				console.log("Connected.");
				setisLoadingChat(false);
				router.push("/chat");
			})
		}
	}
	return (
		<div className="flex flex-col justify-center items-center pt-16">
			<h1 className="text-5xl text-ultra-violet font-link">JOIN</h1>
			<h2 className="text-2xl text-ultra-violet font-link">you join someone</h2>
			{isLoadingChat ?
				<div className='p-28 mt-10 animate-pulse rounded bg-french-gray-lite font-link text-ultra-violet'>Loading
				</div>
				:
				<div className='flex justify-center items-center py-16'>
					<QrReader
						videoStyle={videoStyle}
						videoContainerStyle={videoContainerStyle}
						onResult={handleResult}
						constraints={{ facingMode: 'environment' }}
					/>
				</div>
			}
		</div>
	)
}