import { useHostName } from "@/hooks/useOrigin";
import { memo, useEffect } from "react";

export interface ModalProps {
	peerId: string,
}

import QRCode from "react-qr-code";

function QuickModalImpure(props: ModalProps) {
	const URL = useHostName();

	useEffect(() => {
		console.log(`PRINTING QUICK URL: ${URL}/quick/${props.peerId}`)
	},[props, URL])

	return (
		<>
			<input type="checkbox" id="quick-connect-modal" className="modal-toggle" />
			<label htmlFor="quick-connect-modal" className="modal">
				<label className="modal-box relative bg-french-gray p-0" htmlFor="">
					<div className="flex flex-col justify-center items-center bg-french-gray p-0">
						<div className="bg-french-gray-lite rounded w-full items-center">
							<h1 className="text-5xl text-ultra-violet text-center font-link py-6 pt-9">QUICK JOIN</h1>
						</div>
						<div className="flex flex-col justify-center items-center">
							<QRCode className="qr-code justify-centre py-6 pt-8" value={`${URL}/quick/${props.peerId}`} />
							<div className="modal-action pb-5 pl-96">
								<label htmlFor="quick-connect-modal" className="btn font-link">Close</label>
							</div>
						</div>
					</div>
				</label>
			</label>
		</>
	)
}

// Prevents unecessary rerenders when props dont change, tested to be useful
export default memo(QuickModalImpure);