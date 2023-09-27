<script lang="ts">
	import { goto } from '$app/navigation';
	import { advancedMode, peerId } from '$lib/stores';
	import QRCode from '$lib/QRCode.svelte';
	import { page } from '$app/stores';
	import { getToastStore, popup } from '@skeletonlabs/skeleton';
	import type { ToastSettings, PopupSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	$: qrLink = `${$page.url.origin}/connect/${$peerId}`;

	let connectInput: string;

	function copyID() {
		if (!$peerId) return;
		const toastMessage: ToastSettings = { message: 'Peer ID copied 🤝' };
		toastStore.trigger(toastMessage);
		navigator.clipboard.writeText($peerId);
	}
</script>

<div class="card p-4 variant-filled-secondary" data-popup="popupHover">
	<p>{qrLink}</p>
	<div class="arrow variant-filled-secondary" />
</div>

<div class="flex container mx-auto justify-center">
	<div class="flex flex-col justify-center items-center space-y-5 pt-10">
		<h2 class="text-2xl">Scan to connect</h2>
		{#if $peerId}
			{#if $advancedMode}
				<a href={qrLink} target="_blank" class="text-sky-400 text-center">
					Self-connect in new tab
				</a>
			{/if}
			<div class="flex flex-col items-center justify-center p-1">
				<QRCode bind:link={qrLink} />
			</div>
		{/if}

		<button on:click={copyID} class="hover:scale-105 transition-transform">
			<code class="bg-slate-300 rounded-md text-slate-800 p-1">ID: {$peerId}</code>
		</button>
		{#if $advancedMode}
			<form
				on:submit|preventDefault={() => {
					goto(`/connect/${connectInput}`);
				}}
				class="flex flex-row">
				<input
					class="input p-2 rounded-lg"
					type="text"
					placeholder="Insert peer ID here"
					bind:value={connectInput} />
				<button
					type="button"
					class="btn variant-filled rounded-lg"
					on:click={() => {
						goto(`/connect/${connectInput}`);
					}}>
					Join
				</button>
			</form>
			<div class="flex">
				<button on:click={() => goto('/scanner')} class="btn variant-filled rounded-lg">Open Scanner</button>
			</div>
		{/if}
	</div>
</div>
