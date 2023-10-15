<script lang="ts">
	import { goto } from '$app/navigation';
	import { advancedMode, peerId, popupMsg } from '$lib/stores';
	import QRCode from '$lib/QRCode.svelte';
	import { page } from '$app/stores';
	import { getToastStore, popup } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	$: qrLink = `${$page.url.origin}/connect/${$peerId}`;

	let connectInput: string;

	$: isConnectDisabled = connectInput === '';

	function copyID() {
		if (!$peerId) return;
		const toastMessage: ToastSettings = { message: 'Peer ID copied 🤝' };
		toastStore.trigger(toastMessage);
		navigator.clipboard.writeText($peerId);
	}

	function handleFormSubmit() {
		if (connectInput == $peerId) {
			const toastMessage: ToastSettings = {
				message: 'Cannot join yourself ⚠️ 👤',
				background: 'variant-filled-warning'
			};
			toastStore.trigger(toastMessage);
			return;
		}
		goto(`/connect/${connectInput}`);
	}
</script>

<div class="flex container mx-auto justify-center my-2 lg:pt-10">
	<div class="flex flex-col justify-center items-center space-y-5">
		<p class="text-3xl">Scan to Connect</p>
		{#if $peerId}
			{#if $advancedMode}
				<a
					href={qrLink}
					target="_blank"
					class="badge-glass rounded-lg p-2 hover:text-sky-500 text-center">
					Self-connect in new tab
				</a>
			{/if}
			<div class="flex flex-col items-center justify-center p-1">
				<QRCode bind:link={qrLink} />
			</div>
		{/if}

		<button
			use:popup={{
				event: 'hover',
				target: 'popupHover',
				placement: 'top'
			}}
			on:mouseover={() => {
				$popupMsg = 'Copy Peer ID';
			}}
			on:focus={() => {
				$popupMsg = 'Copy Peer ID';
			}}
			on:click={copyID}
			class="hover:scale-105 transition-transform">
			<code class="variant-glass-surface rounded-md p-1 px-2">ID: {$peerId}</code>
		</button>
		{#if $advancedMode}
			<form on:submit|preventDefault={handleFormSubmit} class="flex flex-row">
				<input
					class="input p-2 rounded-lg"
					type="text"
					placeholder="Insert peer ID here"
					bind:value={connectInput} />
				<button type="submit" disabled={isConnectDisabled} class="btn variant-filled rounded-lg">
					Join
				</button>
			</form>
			<div class="flex">
				<button on:click={() => goto('/scanner')} class="btn variant-filled rounded-lg">
					Open QR Scanner
				</button>
			</div>
		{/if}
	</div>
</div>
