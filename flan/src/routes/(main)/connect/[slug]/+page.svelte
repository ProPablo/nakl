<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let connectID = $page.params.slug;


	let connecting = true;

	function onConnOpen(): void {
		connecting = false;
		console.log('Connection open');
		goto('/chat');
	}

	onMount(() => {
		//Peer exists for sure, we can do logic here to connect to Peer B
		console.log('connect mounted', $page);
		const conn = window.NAKL_PEER?.connect(connectID);
		// TODO handle connection error
		if (!conn) return;
		window.NAKL_PEER_CONNECTION = conn;
		conn.on('open', onConnOpen);
	});


</script>

<div>
	Welcome gamer, trying to connect to: {connectID}
</div>
