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
		// TODO: set the peer on a context instead
		const peerOptions: PeerJSOption = {
			host: PUBLIC_HOST,
			port: parseInt(PUBLIC_PORT),
			path: PUBLIC_PEERPATH,
			debug: 3
		};
		let peer = new Peer(peerOptions);
		window.NAKL_PEER = peer;

		peer.on('open', onPeerOpen);
		peer.on('connection', onPeerConnect);
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>

	<div class="justify-center">
		{#if loadingPeer}
			<p>Loading & connecting to peer...</p>
		{:else}
			<slot />
			<div>
				<code>{$peerId}</code>
			</div>
		{/if}
	</div>

	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
