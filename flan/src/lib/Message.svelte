<script lang="ts">
	import { MessageType, type IMessage } from './types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import CopyIcon from './Copy.svelte';
	import { fly } from 'svelte/transition';

	const toastStore = getToastStore();
	export let message: IMessage;
	let showCopy = false;

	function copyMsg() {
		if (!message.text) return;
		navigator.clipboard.writeText(message.text);
		const toastMessage: ToastSettings = {
			message: 'Copied message to clipboard 🤓',
			background: 'variant-filled-success'
		};
		toastStore.trigger(toastMessage);
	}
</script>

<div class="my-6">
	{#if message.sent}
		<div class="grid grid-cols-[2fr_8fr] gap-2 m-2">
			<div />
			<div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
				<header class="flex justify-between items-center">
					<p class="font-bold">You</p>
					<small class="opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</small>
				</header>
				{#if message.type === MessageType.Text}
					<p>{message.text}</p>
				{:else if message.type === MessageType.Image}
					<img src={message.payload?.src} alt="Sup" />
				{/if}
			</div>
		</div>
	{:else}
		<div
			on:mouseenter={() => {
				showCopy = true;
			}}
			on:mouseleave={() => {
				showCopy = false;
			}}
			class="grid grid-cols-[6fr_1fr] gap-2 mr-12 ml-3"
			aria-haspopup="true"
			role="button"
			tabindex={message.timestamp}
			>
			<div class="card p-4 variant-soft rounded-tl-none space-y-2">
				<header class="flex justify-between items-center">
					<p class="font-bold">Friend :)</p>
					<small class="opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</small>
				</header>

				{#if message.type === MessageType.Text}
					<p>{message.text}</p>
				{:else if message.type === MessageType.Image}
					<img src={message.payload?.src} alt="Sup" />
				{/if}
			</div>
			{#if showCopy}
				<button
					on:click={copyMsg}
					in:fly={{ x: 20, duration: 500 }}
					out:fly={{ x: 20, duration: 500 }}
					class="grid items-center justify-center rounded-lg variant-soft">
					<CopyIcon classes="btn-icon rounded-lg" height="30" width="30" />
				</button>
			{/if}
		</div>
	{/if}
</div>
