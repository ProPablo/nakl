<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import file from './svgs/file.png';

	export let inputFile: File | null = null;

	function handleFileChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			// It is only select 1 for now, enable support later
			inputFile = files[0];
		}
	}
	let inputName = 'nakl_file_input';

	function handleRemoveFile(): void {
		//Get the file input element using name and document.getElement and clear it
		let fileElems = document.getElementsByName(inputName) as NodeListOf<HTMLInputElement>;
		// This will remove the file from all inputs with this name
		for (let i = 0; i < fileElems.length; i++) {
			fileElems[i].value = '';
		}

		inputFile = null;
	}
</script>

<FileDropzone multiple={false} name={inputName} on:change={handleFileChange}>
	<svelte:fragment slot="lead">
		{#if inputFile}
			{#if inputFile.type.includes('image/')}
				<div class="grid grid-rows-[1fr_auto]">
					<img
						class="w-full object-contain rounded-lg"
						src={URL.createObjectURL(inputFile)}
						alt="Selected file" />

					<button class="btn variant-filled-secondary z-10" on:click={handleRemoveFile}>
						Remove file
					</button>
				</div>
			{:else}
				<img
					class="w-full object-contain rounded-lg"
					src={file}
					alt="Selected file" />
			{/if}
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
</FileDropzone>
