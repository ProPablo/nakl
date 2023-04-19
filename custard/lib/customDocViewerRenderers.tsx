import type { DocRenderer } from "@cyntler/react-doc-viewer"
import styles from '@/styles/Misc.module.css'

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
VideoRenderer.fileTypes = ["mp4", "video/mp4", "webm", "video/webm", "ogg", "video/ogg", "video/quicktime", "avi", "video/avi"];
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
			<img className="object-contain p-5" src={currentDocument.uri}/>
			{/* <a href={currentDocument.uri} download={currentDocument.fileName} className="p-3 rounded-lg font-link text-white bg-ultra-violet">
				Download
			</a> */}
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
		<div className="flex flex-col justify-center items-center bg-french-gray-lite overflow-hidden py-16">
			<img className="flex-1 object-contain h-10 w-10 items-center" src="/zip.svg"/>
			{/* <a href={currentDocument.uri} download={currentDocument.fileName} className="p-3 rounded-lg font-link text-white bg-ultra-violet">
				Download
			</a> */}
		</div>
	)
}
ZipRenderer.fileTypes = ["zip", "application/zip", "7z", "application/x-7z-compressed", "rar", "application/vnd.rar"];
ZipRenderer.weight = 1;

export const FileRenderer: DocRenderer = ({
	mainState: { currentDocument },
}) => {
	if (!currentDocument) return null;
	return (
		<div className={styles.renderIcon + "flex flex-col justify-center items-center bg-french-gray-lite overflow-hidden py-16"}>
			<img className="flex-1 object-contain h-10 w-10 items-center" src="/file.svg"/>
			{/* <a href={currentDocument.uri} download={currentDocument.fileName} className="p-3 rounded-lg font-link text-white bg-ultra-violet">
				Download
			</a> */}
		</div>
	)
}
FileRenderer.fileTypes = ["tff", "font/tff", "mhtml", "multipart/related", "md", "text/markdown"];
FileRenderer.weight = 1;

