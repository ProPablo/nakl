<script lang="ts">
	import { onMount } from 'svelte';
	import Peer, { CborPeer } from 'peerjs';
	// For some reason, imports of these types as types isnt working
	import type { PeerJSOption, DataConnection } from 'peerjs';
	import { PUBLIC_HOST, PUBLIC_PEERPATH, PUBLIC_PORT } from '$env/static/public';
	import { peerId } from '$lib/stores';
	import { sleep } from '$lib/util';
	import { goto } from '$app/navigation';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Header from '$lib/Header.svelte';
	import { dev } from '$app/environment';
	import GitHub from '$lib/svgs/GitHub.svelte';
	import Info from '$lib/svgs/Info.svelte';
	import Footer from '$lib/Footer.svelte';

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
			debug: dev ? 3 : 0
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

	{#if loadingPeer}
		<div class="flex flex-col items-center gap-3 pt-10">
			<p class="badge-glass p-3 rounded-lg animate-pulse">Loading & connecting to peer...</p>
			<div class="placeholder animate-pulse rounded-lg pb-[315px] w-[315px]" />
			<p class="placeholder p-3 rounded-lg animate-pulse w-1/4" />
		</div>
	{:else}
		<slot />
	{/if}

	<svelte:fragment slot="footer">
		<Footer/>
	</svelte:fragment>
</AppShell>
