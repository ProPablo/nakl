<script lang="ts">
	import { MessageType, type IMessage } from './types';
	import FileIcon from './svgs/File.svelte';
	export let message: IMessage;
</script>

{#if message.type === MessageType.Text}
	<p>{message.text}</p>
{:else if message.type === MessageType.Image}
	<div class="flex items-center justify-center">
		<img class="rounded-lg max-h-[60vh]" src={message.payload?.src} alt={message.payload?.name} />
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
