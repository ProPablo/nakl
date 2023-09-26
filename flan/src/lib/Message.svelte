<script lang="ts">
	import { MessageType, type IMessage } from './types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import CopyIcon from './Copy.svelte';
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

	// let flyAnim = { x: 20, duration: 500 };
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
				<MessageContents {message} />
				{#if message.progess}
					{#if message.progess == 1}
						<div class="ml-auto">Sent ✔</div>
					{:else}
						<div class="ml-auto">{message.progess * 100} %</div>
					{/if}
				{/if}
			</div>
		</div>
	{:else}
	<!-- Curor here is all pointer because of the roll -->
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
			tabindex={message.timestamp}>
			<div class="card p-4 variant-soft rounded-tl-none space-y-2">
				<header class="flex justify-between items-center">
					<p class="font-bold">Friend :)</p>
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
						<CopyIcon classes="btn-icon rounded-lg" height="30" width="30" />
					</button>
				{:else if message.payload && 'name' in message.payload}
					<a
						href={message.payload?.src}
						download={message.payload?.name}
						in:fly|global={{ x: 20, duration: 500 }}
						out:fly|global={{ x: 20, duration: 500 }}
						class="grid items-center justify-center rounded-lg variant-soft">
						<DownloadIcon classes="btn-icon rounded-lg" height="30" width="30" />
					</a>
				{/if}
			{/if}
		</div>
	{/if}
</div>
