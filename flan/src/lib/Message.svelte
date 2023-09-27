<script lang="ts">
	import { MessageType, type IMessage } from './types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import CopyIcon from './svgs/Copy.svelte';
	import DownloadIcon from './svgs/Download.svelte';
	import { fly } from 'svelte/transition';
	import MessageContents from './MessageContents.svelte';

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

	$: displayPercent = message.progess ? (message.progess * 100.0).toFixed(2) : 1;
</script>

<div class="my-6">
	<!-- YOU -->
	{#if message.sent}
		<div class="grid grid-cols-[2fr_7fr] lg:grid-cols-[1fr_2fr] gap-2 m-2">
			<div />
			<div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
				<header class="flex justify-between items-center">
					<p class="font-bold">You 👤</p>
					<small class="opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</small>
				</header>
				<MessageContents {message} />
				{#if message.progess}
					{#if message.progess == 1}
						<div class="text-xs ml-auto italic text-right">Sent ✔</div>
					{:else}
						<div class="ml-auto">{displayPercent} %</div>
					{/if}
				{/if}
			</div>
		</div>
	{:else}
		<!-- Curor here is all pointer because of the roll -->
		<!-- FRIEND :) -->
		<div
			on:mouseenter={() => {
				showCopy = true;
			}}
			on:mouseleave={() => {
				showCopy = false;
			}}
			class="grid grid-cols-[6fr_1fr] lg:grid-cols-[4fr_1fr_1fr] gap-2 mr-12 lg:mr-0 ml-2"
			aria-haspopup="true"
			role="button"
			tabindex={message.timestamp}>
			<div class="card p-4 variant-soft rounded-tl-none space-y-2">
				<header class="flex justify-between items-center">
					<p class="font-bold">Friend 😸</p>
					<small class="opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</small>
				</header>

				<MessageContents {message} />
			</div>
			{#if showCopy}
				{#if message.type === MessageType.Text}
					<!-- The global animation directive is needed here to make the animation happen because of the nested if loops-->
					<button
						on:click={copyMsg}
						in:fly|global={{ x: 20, duration: 500 }}
						out:fly|global={{ x: 20, duration: 500 }}
						class="grid items-center justify-center rounded-lg variant-soft">
						<CopyIcon classes="btn-icon rounded-lg" height="40" width="40" />
					</button>
				{:else if message.payload && 'name' in message.payload}
					<a
						href={message.payload?.src}
						download={message.payload?.name}
						in:fly|global={{ x: 20, duration: 500 }}
						out:fly|global={{ x: 20, duration: 500 }}
						class="grid items-center justify-center rounded-lg variant-soft">
						<DownloadIcon classes="btn-icon rounded-lg" height="40" width="40" />
					</a>
				{/if}
			{/if}
		</div>
	{/if}
</div>
