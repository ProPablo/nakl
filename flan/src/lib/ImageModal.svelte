<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let parent: any;

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="flex items-center justify-center">
		<button
			on:click={parent.onClose}
			class="btn-icon variant-filled fixed top-4 right-4 z-50 font-bold shadow-xl">
			x
		</button>
		<img
			on:contextmenu={(e) => {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}}
			class="rounded-lg max-h-[80vh]"
			src={$modalStore[0].meta?.image}
			alt={$modalStore[0].meta?.name} />
	</div>
{/if}

<style>
	img {
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		user-select: none;
	}
</style>
