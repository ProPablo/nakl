<script lang="ts">
	import { goto } from '$app/navigation';
	import { peerId } from '$lib/stores';
	import QRCode from '$lib/QRCode.svelte';
	import { page } from '$app/stores';

	$: qrLink = `${$page.url.origin}/connect/${$peerId}`;

	let connectInput: string;

</script>

<div class="flex container h-full mx-auto justify-center items-center">
	<div class="flex flex-col justify-center items-center space-y-5 pt-10">
		<h1 class="h1">SCAN</h1>
		<p class="h1">someone joins you</p>
		{#if $peerId}
			<code>Go to <a href={qrLink} class="text-sky-400 text-center">{qrLink}</a></code>
			<QRCode bind:link={qrLink}/>
		{/if}
		<button on:click={() => {
			if (!$peerId) return;
			navigator.clipboard.writeText($peerId);
		}}>
			<code class="bg-slate-300 rounded-md text-slate-800 p-1 ">{$peerId}</code>
		</button>
		
		<form on:submit|preventDefault={() => {
			goto(`/connect/${connectInput}`);
		}} class="flex flex-row">
			<input class="input p-2 rounded-lg" type="text" placeholder="Input" bind:value={connectInput} />
			<button
				type="button"
				class="btn variant-filled rounded-lg"
				on:click={() => {
					goto(`/connect/${connectInput}`);
				}}
				>Connect
			</button>
		</form>

		<div class="flex flex-row gap-x-3">
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
</div>
