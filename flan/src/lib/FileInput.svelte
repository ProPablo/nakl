<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';

	export let inputFile: File | null = null;

	function handleFileChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			// It is only select 1 for now, enable support later
			inputFile = files[0];
		}
	}

</script>

<FileDropzone multiple={false} name="files" on:change={handleFileChange}>
	<svelte:fragment slot="lead">
		<!-- <i class="fa-solid fa-file-arrow-up text-4xl" /> -->
		{#if inputFile}
			{#if inputFile.type.includes('image/')}
				<!-- Using tailwind classes make the image fit the width of the right bar-->
				<img
					class="w-full object-contain rounded-lg"
					src={URL.createObjectURL(inputFile)}
					alt="Selected file" />
			{/if}
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
</FileDropzone>
