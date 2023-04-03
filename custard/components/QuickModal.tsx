import { useHostName } from "@/hooks/useHostName";
import { useEffect } from "react";

export interface ModalProps {
	peerId: string,
}

import QRCode from "react-qr-code";

export default function QuickModal(props: ModalProps) {
	const URL = useHostName();

	// for debugging quick join URL
	useEffect(() => {
		console.log(`${URL}/quick/${props.peerId}`)
	},[props, URL])

	return (
		<>
			<input type="checkbox" id="my-modal-4" className="modal-toggle" />
			<label htmlFor="my-modal-4" className="modal">
				<label className="modal-box relative bg-french-gray p-0" htmlFor="">
					<div className="flex flex-col justify-center items-center bg-french-gray p-0">
						<div className="bg-french-gray-lite rounded w-full items-center">
							<h1 className="text-5xl text-ultra-violet text-center font-link py-6 pt-9">QUICK JOIN</h1>
						</div>
						<div className="flex flex-col justify-center items-center">
							<QRCode className="qr-code justify-centre py-6 pt-8" value={`${URL}/quick/${props.peerId}`} />
							<div className="modal-action pb-5 pl-96">
								<label htmlFor="my-modal-4" className="btn font-link">Close</label>
							</div>
						</div>
					</div>
				</label>
			</label>
		</>
	)
}