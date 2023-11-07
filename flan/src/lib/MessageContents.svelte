<script lang="ts">
	import { MessageType, type IMessage } from './types';
	import FileIcon from './svgs/File.svelte';
	import {
		getModalStore,
		type ModalSettings,
	} from '@skeletonlabs/skeleton';
	interface SpoilerSubType {
		internal: string,
		isSpoiler: boolean,
		revealed: boolean,
	}

	const modalStore = getModalStore();
	const passwordRegex = /(?<inside>\|\|[^|]*\|\|)|(?<outside>[^|]+)/g;
	// -- TODO USE THIS FOR PWD REVEALING
	// let revealedIndices: number[] = [];
	export let message: IMessage;
	$: isLink = message.text?.startsWith('http');
	$: isPassword = message.text && !(message.text === '') && message.text.includes('||');

	let msgSplit: SpoilerSubType[];
	$: msgSplit = message.text ?  [...message.text.matchAll(passwordRegex)]
	.map(match => match.groups)
	.filter(groups => groups !== undefined)
	.map((groups) => {
		if (!groups) return {internal: "", isSpoiler: false, revealed: false};
		if (groups.inside) return { internal: groups.inside.replaceAll("||", ""), isSpoiler: true, revealed: false};
		return {internal: groups.outside, isSpoiler: false, revealed: false};
	}) : [];

	$: modal = {
		type: 'component',
		component: 'imageModal',
		meta: { image: message.payload?.src, name: message.payload?.name }
	} as ModalSettings;
</script>

{#if message.type === MessageType.Text}
	{#if isLink}
		<a href={message.text} target="_blank" class="break-all text-secondary-300">
			{message.text}
		</a>
	{:else if isPassword && msgSplit}
		<div class="flex flex-row">
			{#each msgSplit as subString}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				{#if subString.isSpoiler && !subString.revealed}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						on:click={() => {
							subString.revealed = true;
							
					}}
						class='break-keep variant-glass-primary rounded-lg text-transparent hover:cursor-pointer'>
						{subString.internal}
					</span>
					{:else}
						<span class="whitespace-pre-wrap">{subString.internal}</span>
				{/if}
			{/each}
		</div>
	{:else}
		<p class="break-all">
			{message.text}
		</p>
	{/if}
{:else if message.type === MessageType.Image}
	<div class="flex items-center justify-center">
		<button on:click={() => modalStore.trigger(modal)}>
			<!-- https://stackoverflow.com/questions/3413683/disabling-the-context-menu-on-long-taps-on-android -->
			<img
				on:contextmenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}}
				class="rounded-lg max-h-[60vh] hover:cursor-pointer"
				src={message.payload?.src}
				alt={message.payload?.name} />
		</button>
	</div>
{:else if message.type === MessageType.Audio}
	<div class="flex flex-col gap-3 items-center justify-center">
		<audio controls src={message.payload?.src} />
		<code>{message.payload?.name}</code>
	</div>
{:else if message.type === MessageType.Video}
	<div class="flex flex-col gap-3 items-center justify-center">
		<video controls src={message.payload?.src} class="rounded-lg">
			<track kind="captions" />
		</video>
		<code>{message.payload?.name}</code>
	</div>
{:else if message.type === MessageType.File}
	<div class="flex items-center justify-center">
		<FileIcon width="50" height="50" />
		<code>{message.payload?.name}</code>
	</div>
{/if}

<style>
	/* https://github.com/react-native-webview/react-native-webview/issues/1183 */
	img {
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		user-select: none;
	}
</style>
