<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import Peer, { CborPeer,  } from 'peerjs';
	// For some reason, imports of these types as types isnt working
	import type { PeerJSOption, DataConnection } from 'peerjs';
	import { PUBLIC_HOST, PUBLIC_PEERPATH, PUBLIC_PORT } from '$env/static/public';
	import { peerId } from '$lib/stores';
	import { sleep } from '$lib/util';
	import { goto } from '$app/navigation';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Header from '$lib/Header.svelte';

	let loadingPeer = true;

	const onPeerOpen = async (id: string) => {
		await sleep(1000);
		loadingPeer = false;
		// link = id; // change to actual link
		peerId.update(() => id);
	};

	function onPeerConnect(dataConnection: DataConnection): void {
		window.NAKL_PEER_CONNECTION = dataConnection;
		console.log('Peer connected', dataConnection);
		goto('/chat');
	}

	onMount(() => {
		$peerId = null;
		const peerOptions: PeerJSOption = {
			host: PUBLIC_HOST,
			port: parseInt(PUBLIC_PORT),
			path: PUBLIC_PEERPATH,
			// BLOCKED: Transtion when peer js branch merged
			debug: 3
		};
		let peer = new Peer(peerOptions);
		window.NAKL_PEER = peer;

		peer.on('open', onPeerOpen);
		peer.on('connection', onPeerConnect);
	});
</script>

<AppShell slotPageFooter="-z-10">
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>

	<div class="h-full">
		{#if loadingPeer}
			<div class="flex justify-center items-center h-full">
				<p class="variant-glass-secondary p-3 rounded-lg animate-pulse">Loading & connecting to peer...</p>
			</div>
		{:else}
			<slot />
		{/if}
	</div>

	<svelte:fragment slot="pageFooter">
	<div class="flex items-center justify-center p-1 relative badge-glass">
			<a href="https://github.com/ProPablo/nakl" class="hover:text-sky-400 transition-colors duration-150 cursor-pointer">
				kongi
			</a>
	</div>
	</svelte:fragment>
</AppShell>