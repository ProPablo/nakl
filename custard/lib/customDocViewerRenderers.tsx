import React from "react";

import dynamic from "next/dynamic";

const DocViewer = dynamic(() => import("@cyntler/react-doc-viewer"), { ssr: false });
import type { DocRenderer } from "@cyntler/react-doc-viewer"


// const MyCustomPNGRenderer: DocRenderer = ({
//   mainState: { currentDocument },
// }) => {
//   if (!currentDocument) return null;

//   return (
//     <div id="my-png-renderer">
//       <img id="png-img" src={currentDocument.fileData as string} />
//     </div>
//   );
// };

// MyCustomPNGRenderer.fileTypes = ["png", "image/png"];
// MyCustomPNGRenderer.weight = 1;

export const VideoRenderer: DocRenderer = ({
	mainState: { currentDocument },
}) => {
	if (!currentDocument) return null;
	return (
		<div className="bg-black">
			<video controls src={currentDocument.uri}></video>
		</div>
	)
}

VideoRenderer.fileTypes = ["mp4", "video/mp4", "webm", "video/webm", "ogg", "video/ogg", "video/quicktime"];
VideoRenderer.weight = 1;

export const AudioRenderer: DocRenderer = ({
	mainState: { currentDocument },
}) => {
	if (!currentDocument) return null;
	return (
		<div className="bg-black">
			<audio controls src={currentDocument.uri} className="rounded-none"></audio>
		</div>
	)
}

AudioRenderer.fileTypes = ["mp3", "audio/mp3", "wav", "audio/wav", "ogg", "audio/ogg", "audio/mpeg", "mpeg"];
AudioRenderer.weight = 1;

export const ZipRenderer: DocRenderer = ({
	mainState: { currentDocument },
}) => {
	if (!currentDocument) return null;
	return (
		<div className="flex flex-col justify-center bg-french-gray-lite items-center overflow-hidden p-6">
			<img className="object-contain" src="/zip.svg"/>
			<a href={currentDocument.uri} download={currentDocument.fileName} className="p-3 rounded-lg text-white bg-ultra-violet">
				Download
			</a>
		</div>
	)
}

ZipRenderer.fileTypes = ["zip", "application/zip"];
ZipRenderer.weight = 1;
