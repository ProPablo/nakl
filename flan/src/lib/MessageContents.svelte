<script lang="ts">
	import { MessageType, type IMessage } from './types';
	import FileIcon from './svgs/File.svelte';
	export let message: IMessage;
</script>

{#if message.type === MessageType.Text}
	<p>{message.text}</p>
{:else if message.type === MessageType.Image}
	<div class="flex items-center justify-center">
		<img
			class="rounded-lg max-h-[60vh]"
			src={message.payload?.src}
			alt={message.payload?.name} />
	</div>
{:else if message.type === MessageType.File}
	<div class="flex items-center justify-center">
		<FileIcon width="50" height="50" />
		<code>{message.payload?.name}</code>
	</div>
{/if}
