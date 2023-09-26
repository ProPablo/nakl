<script lang="ts">
	import { goto } from '$app/navigation';
	import { peerId } from '$lib/stores';
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
	function copyQRLink() {
		if (!qrLink) return;
		const toastMessage: ToastSettings = { message: 'URL copied 🤝' };
		toastStore.trigger(toastMessage);
		navigator.clipboard.writeText(qrLink);
	}
	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};
</script>

<div class="card p-4 variant-filled-secondary" data-popup="popupHover">
	<p>{qrLink}</p>
	<div class="arrow variant-filled-secondary" />
</div>

<div class="flex container h-full mx-auto justify-center items-center">
	<div class="flex flex-col justify-center items-center space-y-5 pt-10">
		<h1 class="text-5xl">SCAN</h1>
		<h2 class="text-2xl">someone joins you</h2>
		{#if $peerId}
			<div use:popup={popupHover} on:click={copyQRLink} class="flex flex-col items-center justify-center p-1">
				<QRCode bind:link={qrLink} />
			</div>
			<!-- <a href={qrLink} class="text-sky-400 text-center">{qrLink}</a> -->
		{/if}
		<button on:click={copyID} class="hover:scale-105 transition-transform">
			<code class="bg-slate-300 rounded-md text-slate-800 p-1">{$peerId}</code>
		</button>

		<form
			on:submit|preventDefault={() => {
				goto(`/connect/${connectInput}`);
			}}
			class="flex flex-row">
			<input
				class="input p-2 rounded-lg"
				type="text"
				placeholder="Input"
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

		<div class="flex flex-row gap-x-3">
			<button
				type="button"
				class="btn variant-filled"
				on:click={() => {
					goto('/scanner');
				}}>
				Open Scanner
			</button>
		</div>
	</div>
</div>
