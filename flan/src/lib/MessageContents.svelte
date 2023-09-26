<script lang="ts">
	import { MessageType, type IMessage } from './types';
	import fileIcon from './svgs/file.png';
	export let message: IMessage;
</script>

{#if message.type === MessageType.Text}
	<p>{message.text}</p>
{:else if message.type === MessageType.Image}
	<img class="rounded-lg" src={message.payload?.src} alt={message.payload?.name} />
{:else if message.type === MessageType.File}
	<img class="rounded-lg" src={fileIcon} alt={message.payload?.name} />
{/if}
