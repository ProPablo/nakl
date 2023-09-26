<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	export let inputFile: File | null = null;

	// Local
	let elemFileInput: HTMLElement;

	function handleFileChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			// It is only select 1 for now, enable support later
			inputFile = files[0];
		}
	}
	const drawerStore = getDrawerStore();

	function onButtonClick(): void {
		if (inputFile) {
			// Launch a drawer to show the file
			drawerStore.open({ position: 'bottom' });
			return;
		}
		elemFileInput.click();
	}

</script>

<!-- Based on -->
<!-- https://github.com/skeletonlabs/skeleton/blob/master/packages/skeleton/src/lib/components/FileButton/FileButton.svelte -->

<!-- Hidden here also makes it not count towards the grid -->
<!-- THe important is needed because for some reason, the form input-group classes take precedence -->
<button class={`lg:!hidden ${!!inputFile ? 'variant-filled-primary' : ''}`} type="button" on:click={onButtonClick}>
	<slot>Select a File</slot>
	<input
		class="hidden w-0 h-0"
		type="file"
		bind:this={elemFileInput}
		on:change={handleFileChange} />
</button>
