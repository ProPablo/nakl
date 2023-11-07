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
		<div class="grid grid-rows-[1fr_auto] gap-4">
			{#if inputFile}
			<code class="break-all">{inputFile.name}</code>
				{#if inputFile.type.includes('image/')}
					<img
						class="z-10 w-full object-contain rounded-lg"
						src={URL.createObjectURL(inputFile)}
						alt="Selected file" />
				{:else if inputFile.type.includes('audio/')}
					<audio controls class="z-10 w-full h-12" src={URL.createObjectURL(inputFile)} />
				{:else if inputFile.type.includes('video/')}
					<video controls class="z-10 w-full rounded-lg" src={URL.createObjectURL(inputFile)}>
						<track kind="captions" />
					</video>
				{:else}
					<FileIcon height="100" width="100" classes="mx-auto" />
				{/if}
				<button
					class="btn variant-filled-secondary z-10 rounded-lg"
					on:click={handleRemoveFileButton}>
					Remove file
				</button>
			{/if}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="meta">All files accepted</svelte:fragment>
</FileDropzone>
