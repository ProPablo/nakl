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

	<div class="h-full">
		{#if loadingPeer}
			<div class="flex flex-col items-center h-full gap-3 pt-10">
				<p class="badge-glass p-3 rounded-lg animate-pulse">Loading & connecting to peer...</p>
				<div class="placeholder animate-pulse rounded-lg pb-[315px] w-[315px]" />
				<p class="placeholder p-3 rounded-lg animate-pulse w-1/4" />
			</div>
		{:else}
			<slot />
		{/if}
	</div>

	<svelte:fragment slot="footer">
		<div class="flex gap-3 items-center justify-center p-1 relative badge-glass">
			<a href="https://github.com/ProPablo/nakl" class="z-1 cursor-pointer hover:scale-105">
				<GitHub height="28" width="28" fill="#5f588b" />
			</a>
			<a href="/about" class="z-1 cursor-pointer hover:scale-105">
				<Info height="35" width="35" fill="#5f588b" />
			</a>
		</div>
	</svelte:fragment>
</AppShell>
