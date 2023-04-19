import { GlobalContext } from "@/pages/_app";
import router from "next/router";
import { useContext, useState } from "react";
import type { OnResultFunction } from 'react-qr-reader';
import dynamic from 'next/dynamic';

const QrReader = dynamic(() => import("react-qr-reader").then((qr) => qr.QrReader), { ssr: false });

const videoStyle: React.CSSProperties = {
	position: "relative",
}
const videoLoadingStyle: React.CSSProperties = {
	position: "unset",
}
const videoContainerStyle: React.CSSProperties = {
	paddingTop: "0%",
	height: "226px",
	borderRadius: "0.5rem",
}
const videoContainerLoadingStyle: React.CSSProperties = {
	paddingTop: "4rem",
	height: "0px",
}
export default function JoinScreen() {
	// isLoadingChat handles it so the camera won't re-query a connection 
	const [isLoadingChat, setisLoadingChat] = useState(false);
	const [isLoadingCamera, setisLoadingCamera] = useState(false);

	const handleResult: OnResultFunction = (res, err) => {
		if (!isLoadingCamera) setisLoadingCamera(true);
		if (!!res && !isLoadingChat) {
			const id = res.getText();
			console.log("Connecting to chat.", id);
			window.NAKL_CONNECTION = window.NAKL_PEER!.connect(id);
			console.log(window.NAKL_CONNECTION);
			setisLoadingChat(false);

			window.NAKL_CONNECTION.on("open", () => {
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
			{!isLoadingCamera &&
				<div className='p-28 mt-[42px] animate-pulse rounded bg-french-gray-lite font-link text-ultra-violet'>Loading
				</div>
			}
			<div className={`flex justify-center items-center ${isLoadingCamera && 'py-16'}`}>
				<QrReader
					videoStyle={!isLoadingCamera ? videoLoadingStyle : videoStyle}
					videoContainerStyle={!isLoadingCamera ? videoContainerLoadingStyle : videoContainerStyle}
					onResult={handleResult}
					constraints={{ facingMode: 'environment' }}
				/>
			</div>
		</div>
	)
}