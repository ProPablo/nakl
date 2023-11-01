<script lang="ts">
	import { FileDropzone, ProgressRadial } from '@skeletonlabs/skeleton';
	import FileIcon from './svgs/File.svelte';
	import Message from './Message.svelte';

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

	$: if (!inputFile) {
		//Get the file input element using name and document.getElement and clear it
		let fileElems = document.getElementsByName(inputName) as NodeListOf<HTMLInputElement>;
		// This will remove the file from all inputs with this name
		for (let i = 0; i < fileElems.length; i++) {
			fileElems[i].value = '';
		}
	}

	function handleRemoveFileButton(): void {
		inputFile = null;
	}
</script>

<FileDropzone multiple={false} name={inputName} on:change={handleFileChange}>
	<svelte:fragment slot="lead">
		{#if inputFile}
			{#if inputFile.type.includes('image/')}
				<div class="grid grid-rows-[1fr_auto] gap-4">
					<img
						class="w-full object-contain rounded-lg"
						src={URL.createObjectURL(inputFile)}
						alt="Selected file" />

					<button
						class="btn variant-filled-secondary z-10 rounded-lg"
						on:click={handleRemoveFileButton}>
						Remove image
					</button>
				</div>
			<!-- {:else if inputFile.type.includes('audio/')}
				<div class="flex flex-col gap-3">
					<audio controls src={URL.createObjectURL(inputFile)} />
					<code>{inputName}</code>
				</div> -->
			{:else}
				<div class="grid grid-rows-[1fr_auto] gap-4">
					<FileIcon height="100" width="100" classes="mx-auto" />
					<code class="break-all">{inputFile.name}</code>
					<button
						class="btn variant-filled-secondary z-10 rounded-lg"
						on:click={handleRemoveFileButton}>
						Remove file
					</button>
				</div>
			{/if}
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="meta">All files accepted</svelte:fragment>
</FileDropzone>
