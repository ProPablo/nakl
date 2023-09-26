<script lang="ts">
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

<input type="file" multiple={false} on:change={handleFileChange} class=" input-group-shim" />
Select File
<input />
