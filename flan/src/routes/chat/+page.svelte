<script lang="ts">
	import { AppShell, FileDropzone, clipboard } from '@skeletonlabs/skeleton';
	import type { BufferedNotifyConnection } from 'peerjs';
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	import Message from '$lib/Message.svelte';
	import { type IMessage, MessageType, type MessageDTO, isDataDto } from '$lib/types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { Drawer, type ToastSettings } from '@skeletonlabs/skeleton';
	import FileInput from '$lib/FileInput.svelte';
	import { peerId } from '$lib/stores';
	import MobileFileInput from '$lib/MobileFileInput.svelte';
	import { goto } from '$app/navigation';
	import { dev } from '$app/environment';

	let messageRecievedCount = 0;

	const sampleMessages: IMessage[] = [
		{
			id: 200,
			sent: true,
			text: 'Hello',
			timestamp: Date.now(),
			type: MessageType.Text,
			progess: 1
		},
		{
			id: 201,
			sent: false,
			text: 'Hello',
			timestamp: Date.now() + 1,
			type: MessageType.Text,
			progess: 1
		}
	];

	let conn: BufferedNotifyConnection;
	const toastStore = getToastStore();
	let messages: IMessage[] = dev ? sampleMessages : [];
	let currentMessage: string = '';
	let inputFile: File | null = null;

	function sendMessage() {
		if (!currentMessage && !inputFile) {
			const toastMessage: ToastSettings = {
				message: 'No message to send 📧',
				background: 'variant-filled-error'
			};
			toastStore.trigger(toastMessage);
			return;
		}

		sendTextMessage();
		sendAttachment();
	}

	let elemChat: HTMLElement;
	let elemChatEnd: HTMLElement;

	// https://www.skeleton.dev/elements/chat
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		//This part was solved by chat gippity
		elemChatEnd.scrollIntoView({ behavior: 'smooth' });
	}

	function sendTextMessage() {
		if (currentMessage.length == 0) {
			return;
		}
		const nextId = conn.nextID;
		messages.push({
			id: nextId,
			text: currentMessage,
			timestamp: Date.now(),
			sent: true,
			type: MessageType.Text
		});
		messages = messages;

		conn.send(currentMessage);
		currentMessage = '';
	}

	function sendImage(inputFile: File, arr: ArrayBuffer) {
		const blob = new Blob([inputFile]);
		const nextId = conn.nextID;
		const newMessageModel: IMessage = {
			id: nextId,
			timestamp: Date.now(),
			type: MessageType.Image,
			sent: true,
			payload: {
				name: inputFile.name,
				src: URL.createObjectURL(blob)
			},
			progess: 0
		};
		messages.push(newMessageModel);
		messages = messages;

		const dataDto: MessageDTO = {
			type: MessageType.Image,
			timestamp: Date.now(),
			payload: {
				data: arr,
				type: inputFile.type,
				name: inputFile.name
			}
		};
		conn.send(dataDto);
	}
	function sendFile(inputFile: File, arr: ArrayBuffer) {
		const blob = new Blob([inputFile]);
		const nextId = conn.nextID;
		const newMessageModel: IMessage = {
			id: nextId,
			timestamp: Date.now(),
			type: MessageType.File,
			sent: true,
			payload: {
				name: inputFile.name,
				src: URL.createObjectURL(blob)
			},
			progess: 0
		};
		messages.push(newMessageModel);
		messages = messages;

		const dataDto: MessageDTO = {
			type: MessageType.File,
			timestamp: Date.now(),
			payload: {
				data: arr,
				type: inputFile.type,
				name: inputFile.name
			}
		};
		conn.send(dataDto);
	}

	//TODO: transport to a store and add these features there
	async function sendAttachment() {
		if (!inputFile) {
			return;
		}
		var arr = await inputFile.arrayBuffer();

		if (inputFile.type.includes('image/')) {
			sendImage(inputFile, arr);
		} else {
			debugger;
			sendFile(inputFile, arr);
		}
		inputFile = null;
	}

	function onConnClose(): void {
		console.log('Connection closed');
		const toastMessage: ToastSettings = {
			message: 'Session disconnected 😿',
			background: 'variant-filled-warning',
			autohide: false
		};
		toastStore.trigger(toastMessage);
	}

	async function handlePaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		if (clipboardData?.files.length == 0 || !clipboardData) {
			return;
		}
		event.preventDefault();
		inputFile = clipboardData.files[0];
	}

	$: isSendDeactived = currentMessage.length == 0 && inputFile == null;

	onMount(() => {
		if (!window.NAKL_PEER_CONNECTION) {
			console.log('No peer connection');
			const toastMessage: ToastSettings = {
				message: 'No peer ID, go home 😋',
				background: 'variant-filled-error'
			};
			toastStore.trigger(toastMessage);
			$peerId = null;
			if (!dev) goto('/');
			return;
		}
		conn = window.NAKL_PEER_CONNECTION as BufferedNotifyConnection;
		console.log(conn);

		conn.on('data', (data) => {
			console.log('Received', data);
			messageRecievedCount++;
			if (typeof data === 'string') {
				const newMessage: IMessage = {
					type: MessageType.Text,
					text: data,
					timestamp: Date.now(),
					sent: false
				};
				messages.push(newMessage);
				messages = messages;

				setTimeout(() => {
					scrollChatBottom('smooth');
				}, 0);
			} else if (data instanceof Uint8Array) {
				// This is a fallback that should happen
				console.log('We have a Uint8arr.');
				const newBlob = new Blob([data]);

				const newMessageModel: IMessage = {
					timestamp: Date.now(),
					type: MessageType.File,
					sent: true,
					payload: {
						name: 'Image.png', // TODO: get name from data
						src: URL.createObjectURL(newBlob)
					}
				};
				toastStore.trigger({
					message: 'Received file in an unorthodox way ❓',
					background: 'variant-filled-warning'
				});
				messages.push(newMessageModel);
				messages = messages;
			} else if (isDataDto(data)) {
				switch (data.type) {
					case MessageType.Text:
						const newMessage: IMessage = {
							type: MessageType.Text,
							text: data.text,
							timestamp: Date.now(),
							sent: false
						};
						messages.push(newMessage);
						break;

					case MessageType.File:
						if (!data.payload) return;
						const newBlob = new Blob([data.payload.data]);
						const newMessageModel: IMessage = {
							timestamp: Date.now(),
							type: MessageType.File,
							sent: false,
							payload: {
								src: URL.createObjectURL(newBlob),
								type: data.payload?.type,
								name: data.payload?.name
							}
						};
						messages.push(newMessageModel);
						break;
					case MessageType.Image:
						if (!data.payload) return;
						const newBlobImage = new Blob([data.payload?.data]);
						const newMessageModelImage: IMessage = {
							timestamp: Date.now(),
							type: MessageType.Image,
							sent: false,
							payload: {
								name: data.payload?.name,
								src: URL.createObjectURL(newBlobImage)
							}
						};
						messages.push(newMessageModelImage);
						break;
				}
				messages = messages;

				setTimeout(() => {
					scrollChatBottom('smooth');
				}, 0);
			}
		});

		conn.on('sentChunk', (chunk) => {
			// Get index from chunkId in messages and update progress
			const msgIndex = messages.findIndex((msg) => msg.id === chunk.id);
			console.log('Sent chunk', chunk);
			messages[msgIndex].progess = chunk.n / chunk.total;

			if (chunk.n == chunk.total - 1) {
				messages[msgIndex].progess = 1;
				// Smoothly scroll to the bottom of the feed
				setTimeout(() => {
					scrollChatBottom('smooth');
				}, 0);
				console.log('Sent last message chunk' + chunk);
			}
		});

		conn.on('close', onConnClose);

		return () => {
			conn.close();
			conn.off('data');
			conn.off('sentChunk');
		};
	});
</script>

<!-- In the future, this can be placed on the root level and the fileInput can be accessed with: -->
<!-- {#if $drawerStore.id === 'example-1'}
	const drawerSettings: DrawerSettings = {
	id: 'example-2',
	meta: { foo: 'bar', fizz: 'buzz', age: 40 }
	};
	drawerStore.open(drawerSettings);
	//https://www.skeleton.dev/utilities/drawers
-->
<Drawer height="h-[70%]">
	<FileInput bind:inputFile />
</Drawer>
<!-- Footer only shows up mobile, sidebarright only shows up normal -->
<AppShell slotSidebarRight="hidden lg:flex max-w-72 w-72">
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<div bind:this={elemChat} class="overflow-y-auto">
		{#if messages.length == 0}
			<div class="flex justify-center h-full items-center p-4">
				<p class="italic badge-glass rounded-lg p-2 variant-glass-tertiary">Connected successfully! Start chatting 💬</p>
			</div>
		{/if}
		{#each messages as message}
			<Message {message} />
		{/each}
		<div bind:this={elemChatEnd} />
	</div>

	<svelte:fragment slot="sidebarRight">
		<FileInput bind:inputFile />
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<form
			on:submit|preventDefault={sendMessage}
			class="input-group input-group-divider lg:grid-cols-[1fr_auto] grid-cols-[auto_1fr_auto] rounded-container-token">
			<MobileFileInput bind:inputFile />

			<!-- TODO: handle differently for textinput -->
			<input
				bind:value={currentMessage}
				on:paste={handlePaste}
				type="text"
				autocomplete="off"
				class="bg-transparent border-0 ring-0 p-3"
				name="prompt"
				id="prompt"
				placeholder="Write a message..." />
			<button
				disabled={isSendDeactived}
				type="submit"
				class="variant-filled-primary disabled:variant-filled-surface">
				Send
			</button>
		</form>
	</svelte:fragment>
</AppShell>
