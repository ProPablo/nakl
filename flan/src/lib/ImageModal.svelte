<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let parent: any;
	const modalStore = getModalStore();

	let isZoomed = false;
	let mouseX = 0;
	let mouseY = 0;

	function handleMouseMove(event: MouseEvent) {
		if (!isZoomed || !event) return;
		const target = event.target as HTMLElement;
		const rect = target.getBoundingClientRect();
		mouseX = (event.clientX - rect.left) / rect.width;
		mouseY = (event.clientY - rect.top) / rect.height;
	}
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-4 items-center justify-center">
		<button
			on:click={parent.onClose}
			class="btn-icon variant-filled fixed top-4 right-4 z-50 font-bold shadow-xl">
			x
		</button>
		<button on:click={() => (isZoomed = !isZoomed)}>
			<img
				on:mousemove={handleMouseMove}
				on:contextmenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}}
				style="transform-origin: {mouseX * 100}% {mouseY * 100}%;"
				class={`rounded-lg max-h-[80vh] transition-transform transform-gpu cursor-${
					isZoomed ? 'zoom-out' : 'zoom-in'
				}
				${isZoomed && 'scale-125'}`}
				src={$modalStore[0].meta?.image}
				alt={$modalStore[0].meta?.name} />
		</button>
		{#if !isZoomed}
			<p class="badge-glass p-3 rounded-lg">Click Image to Zoom</p>
		{/if}
	</div>
{/if}

<style>
	img {
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		user-select: none;
	}
</style>
