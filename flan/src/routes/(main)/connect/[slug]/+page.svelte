<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { sleep } from '$lib/util';
	let connectID = $page.params.slug;

	let connecting = true;
	const toastStore = getToastStore();

	async function onConnOpen() {
		connecting = false;
		console.log('Connection open');
		// await sleep(10000);
		goto('/chat');
	}

	onMount(() => {
		//Peer exists for sure, we can do logic here to connect to Peer B
		console.log('connect mounted', $page);
		const conn = window.NAKL_PEER?.connect(connectID, { serialization: 'notify'});
		// const conn = window.NAKL_PEER?.connect(connectID);
		if (!conn) {
			const toastMessage: ToastSettings = {
				message: 'Could not instantiate connection ⚠ 🤝',
				background: 'variant-filled-error'
			};
			toastStore.trigger(toastMessage);
			console.error('Connection failed');
			return;
		};
		window.NAKL_PEER_CONNECTION = conn;
		conn.on('open', onConnOpen);
	});
</script>

<div class="flex h-full justify-center items-center">
	<p class="variant-glass-secondary p-3 rounded-lg animate-pulse text-center mx-4">
		Welcome gamer, trying to connect to: {connectID}
	</p>
</div>
