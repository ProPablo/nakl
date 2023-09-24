<script lang="ts">
	import { AppShell, FileDropzone } from '@skeletonlabs/skeleton';
	import type { DataConnection } from 'peerjs';
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	import Message from '$lib/Message.svelte';
	import { type IMessage, MessageType } from '$lib/types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	let sampleMessages: IMessage[] = [
		{
			sent: true,
			text: 'Hello',
			timestamp: Date.now(),
			type: MessageType.Text
		},
		{
			sent: false,
			text: 'Hello',
			timestamp: Date.now() + 1,
			type: MessageType.Text
		}
	];

	const toastStore = getToastStore();
	let conn: DataConnection;
	let messages: IMessage[] = sampleMessages;
	let currentMessage: string = '';
	let inputFile: File | null = null;

	function sendMessage() {
		messages.push({
			text: currentMessage,
			timestamp: Date.now(),
			sent: true,
			type: MessageType.Text
		});
		messages = messages;
		// Smoothly scroll to the bottom of the feed

		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);

		conn.send(currentMessage);

		currentMessage = '';
	}

	let elemChat: HTMLElement;

	// TODO: this doesnt work lole
	// https://www.skeleton.dev/elements/chat
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		// debugger;
		elemChat.scrollTo(0, elemChat.scrollHeight);
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	async function sendFile() {
		if (!inputFile) {
			return;
		}
		var arr = await inputFile.arrayBuffer();
		const blob = new Blob([inputFile]);
		addImage(blob, true);
		conn.send(arr);
	}

	const addImage = (data: Blob, incoming: boolean) => {
		const newMessageModel: IMessage = {
			timestamp: Date.now(),
			type: MessageType.Image,
			sent: incoming,
			payload: {
				src: URL.createObjectURL(data)
			}
		};
		messages.push(newMessageModel);
		messages = messages;
	};

	onMount(() => {
		if (!window.NAKL_PEER_CONNECTION) {
			console.log('No peer connection');
			const toastMessage: ToastSettings = {
				message: 'No peer ID, go home 😋',
				background: 'variant-filled-error'
			};
			toastStore.trigger(toastMessage);
			// --- UNCOMMENT FOR PROD
			// goto('/');
			// return;
		}
		conn = window.NAKL_PEER_CONNECTION;
		console.log(conn);

		conn.on('data', (data) => {
			console.log('Received', data);
			if (typeof data === 'string') {
				const newMessage: IMessage = {
					type: MessageType.Text,
					text: data,
					timestamp: Date.now(),
					sent: false
				};
				messages.push(newMessage);
				messages = messages;
			} else if (data instanceof Uint8Array) {
				console.log('We have a Uint8arr.');
				const newBlob = new Blob([data]);
				addImage(newBlob, true);
			}
		});
	});

	function handleFileChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			inputFile = files[0];
		}
	}
</script>

<!-- Footer only shows up mobile, sidebarright only shows up normal -->
<AppShell slotSidebarRight="hidden lg:flex">
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<div bind:this={elemChat} class="overflow-y-auto">
		{#each messages as message}
			<Message {message} />
		{/each}
		<div>End Chat</div>
	</div>

	<svelte:fragment slot="sidebarRight">
		<FileDropzone name="files" on:change={handleFileChange}>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-file-arrow-up text-4xl" />
			</svelte:fragment>
			<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
		</FileDropzone>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<form
			on:submit|preventDefault={sendMessage}
			class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
			<!-- Using prevent default here on this button for some reason bugs out the rest of the form, TO COUNTER:
				Specify which button is just regular button and which is the relevant submit button
			-->
			<button class="input-group-shim" type="button" on:click|preventDefault={sendFile}>
				Send File
			</button>
			<!-- TODO: handle differently for textinput -->
			<input
				bind:value={currentMessage}
				type="text"
				class="bg-transparent border-0 ring-0"
				name="prompt"
				id="prompt"
				placeholder="Write a message..." />
			<button type="submit" class="variant-filled-primary">Send</button>
		</form>
	</svelte:fragment>
</AppShell>
