<script lang="ts">
	import { goto } from '$app/navigation';
	import { peerId } from '$lib/stores';
	import QRCode from '$lib/QRCode.svelte';
	import { page } from '$app/stores';

	$: qrLink = `${$page.url.origin}/connect/${$peerId}`;

</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">SCAN</h1>
		<p class="h1">someone joins you</p>

		{#if $peerId}
			<code>Go to {qrLink}</code>
			<QRCode bind:link={qrLink} />
		{/if}
		<code>{$peerId}</code>
		<input class="input" type="text" placeholder="Input" />

		<button
			type="button"
			class="btn variant-filled"
			on:click={() => {
				goto('/scanner');
			}}
			>Open Scanner
		</button>

		<a type="button" class="btn variant-filled" href="/" data-sveltekit-reload>Refresh Peer </a>
	</div>
</div>
