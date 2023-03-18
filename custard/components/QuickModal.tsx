import dynamic from "next/dynamic";

export interface ModalProps {
	peerId: string,
}

import QRCode from "react-qr-code";

export default function QuickModal(props: ModalProps) {

	const URL = process.env.NEXT_PUBLIC_STATIC_WEB_HOST;

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
								<code className="text-dim-gray bg-french-gray-lite rounded-lg font-link p-1">{`${URL}/quick/${props.peerId}`}
								</code>
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