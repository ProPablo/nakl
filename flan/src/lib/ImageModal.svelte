<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { IMessage } from './types';
	const modalStore = getModalStore();
	const message: IMessage = $modalStore[0].meta?.message;
</script>

<div class="flex items-center justify-center">
	<img
		on:contextmenu={(e) => {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}}
		class="rounded-lg max-h-[80vh]"
		src={message.payload?.src}
		alt={message.payload?.name} />
</div>

<style>
	img {
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		user-select: none;
	}
</style>
