<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, setContext } from 'svelte';
	import { AppBar, FileDropzone } from '@skeletonlabs/skeleton';
	import QRCode from '$lib/QRCode.svelte';
	
	import Peer, { type PeerJSOption } from 'peerjs';
	import { PUBLIC_HOST, PUBLIC_PEERPATH, PUBLIC_PORT } from '$env/static/public';

	let link = '';
	let peer;
	let loadingPeer = true;

	const onPeerOpen = (id: string) => {
		loadingPeer = false;
		link = id; // change to actual link
	};

	const onPeerConnect = () => {

	}

	onMount(() => {
		const peerOptions: PeerJSOption = {
			host: PUBLIC_HOST,
			port: parseInt(PUBLIC_PORT),
			path: PUBLIC_PEERPATH,
			debug: 3,
		};
		peer = new Peer(peerOptions);

		peer.on('open', onPeerOpen);
		peer.on('connection', onPeerConnect);
	});

	// setContext('peer', {
	// 	peer: peer
	// })
</script>



<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">SCAN</h1>
		<p class="h1">someone joins you</p>
		<QRCode bind:link />
		<code>{link}</code>
		<input class="input" type="text" placeholder="Input" />

		<button
			type="button"
			disabled={loadingPeer}
			class="btn variant-filled"
			on:click={() => {
				goto('/scanner');
			}}
		>Open Scanner</button>
	</div>
</div>
