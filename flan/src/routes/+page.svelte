<script>

	import { AppBar, FileDropzone } from "@skeletonlabs/skeleton";

</script>
<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">hello</svelte:fragment>
	(title)
	<svelte:fragment slot="trail">(actions)</svelte:fragment>
</AppBar>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">hel</h1>
		<FileDropzone name="files" />
	</div>
</div>
