<script lang="ts">
	import { AppShell, FileDropzone } from '@skeletonlabs/skeleton';
	import type { DataConnection } from 'peerjs';
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	import { goto } from '$app/navigation';
	import Message from '$lib/Message.svelte';

	let sampleMessages: IMessage[] = [
		{
			sent: true,
			text: 'Hello',
			timestamp: Date.now()
		},
		{
			sent: false,
			text: 'Hello',
			timestamp: Date.now() + 1
		}
	];

	let conn: DataConnection;
	let messages: IMessage[] = sampleMessages;
	let currentMessage: string = '';

	function sendMessage() {
		messages.push({
			text: currentMessage,
			timestamp: Date.now(),
			sent: true
		});
		messages = messages;
		// Smoothly scroll to the bottom of the feed
		currentMessage = '';

		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);

		conn.send(currentMessage);
	}

	let elemChat: HTMLElement;

	// TODO: this doesnt work lole
	// https://www.skeleton.dev/elements/chat
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		// debugger;
		elemChat.scrollTo(0, elemChat.scrollHeight);
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function sendFile() {}

	onMount(() => {
		// if (!window.NAKL_PEER_CONNECTION) {
		//     console.log('No peer connection');
		//     goto('/');
		//     return;
		// }
		conn = window.NAKL_PEER_CONNECTION;
		console.log(conn);

		conn.on('data', (data) => {
			console.log('Received', data);
			if (typeof data === 'string') {
				const newMessage = {
					text: data,
					timestamp: Date.now(),
					sent: false
				};
				messages.push(newMessage);
				messages = messages;
			} else if (data instanceof Uint8Array) {
				console.log('We have a Uint8arr.');
				const newBlob = new Blob([data]);
				// addImage(newBlob, true);
			}
		});
	});
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
		<FileDropzone name="files">
			<svelte:fragment slot="lead"><i class="fa-solid fa-file-arrow-up text-4xl" /></svelte:fragment
			>
			<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
		</FileDropzone>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<form on:submit|preventDefault={sendMessage}>
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<button class="input-group-shim" on:click|preventDefault={sendFile}>+</button>
				<!-- TODO: handle differently for textinput -->
				<input
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
				/>
				<button class="variant-filled-primary">Send</button>
			</div>
		</form>
	</svelte:fragment>
</AppShell>
