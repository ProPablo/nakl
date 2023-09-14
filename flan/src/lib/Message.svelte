<script lang="ts">
	import { MessageType, type IMessage } from './types';

	export let message: IMessage;
</script>

{#if message.sent}
	<div class="grid grid-cols-[1fr_auto] gap-2 m-2">
		<div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
			<header class="flex justify-between items-center">
				<p class="font-bold">You</p>
				<small class="opacity-50">{message.timestamp}</small>
			</header>
			{#if message.type === MessageType.Text}
				<p>{message.text}</p>
			{:else if message.type === MessageType.Image}
				<img src={message.payload?.src} alt="Sup" />
			{/if}
		</div>
		<div />
	</div>
{:else}
	<div class="grid grid-cols-[auto_1fr] gap-2 m-2">
		<div />
		<div class="card p-4 variant-soft rounded-tl-none space-y-2">
			<header class="flex justify-between items-center">
				<p class="font-bold">Friend :)</p>
				<small class="opacity-50">{message.timestamp}</small>
			</header>
			{#if message.type === MessageType.Text}
				<p>{message.text}</p>
			{:else if message.type === MessageType.Image}
				<img src={message.payload?.src} alt="Sup" />
			{/if}
		</div>
	</div>
{/if}
