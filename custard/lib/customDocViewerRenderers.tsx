import type { DocRenderer } from "@cyntler/react-doc-viewer"

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
AudioRenderer.fileTypes = ["mp3", "audio/mp3", "wav", "audio/wav", "ogg", "audio/ogg", "audio/mpeg", "mpeg", "webm", "audio/webm"];
AudioRenderer.weight = 1;

export const SvgRenderer: DocRenderer = ({
	mainState: { currentDocument },
}) => {
	if (!currentDocument) return null;
	return (
		<div className="flex flex-col justify-center bg-french-gray-lite items-center overflow-hidden h-full w-full p-3">
			<img className="object-contain" src={currentDocument.uri}/>
			<a href={currentDocument.uri} download={currentDocument.fileName} className="p-3 rounded-lg text-white bg-ultra-violet">
				Download
			</a>
		</div>
	)
}
SvgRenderer.fileTypes = ["svg", "image/svg+xml", "ico", "image/vnd.microsoft.icon"];
SvgRenderer.weight = 1;

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
ZipRenderer.fileTypes = ["zip", "application/zip", "7z", "application/x-7z-compressed"];
ZipRenderer.weight = 1;

export const FileRenderer: DocRenderer = ({
	mainState: { currentDocument },
}) => {
	if (!currentDocument) return null;
	return (
		<div className="flex flex-col justify-center bg-french-gray-lite items-center overflow-hidden p-6">
			<img className="object-contain" src="/file.svg"/>
			<a href={currentDocument.uri} download={currentDocument.fileName} className="p-3 rounded-lg text-white bg-ultra-violet">
				Download
			</a>
		</div>
	)
}
FileRenderer.fileTypes = ["tff", "font/tff", "rar", "application/vnd.rar", ];
FileRenderer.weight = 1;

