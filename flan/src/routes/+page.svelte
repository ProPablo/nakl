<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { AppBar, FileDropzone } from '@skeletonlabs/skeleton';
	import QRCode from '$lib/QRCode.svelte';
	import Logo from '$lib/Logo.svelte';
	let link = '';
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">{""}</svelte:fragment>
	<button class="hover:bg-slate-400 rounded-lg duration-500 transition-colors" on:click={() => goto("/")}>
		<Logo width=100 height=100/>
	</button>
	<svelte:fragment slot="trail"></svelte:fragment>
</AppBar>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">SCAN</h1>
		<p class="h1">someone joins you</p>
		<QRCode bind:link />
		<input class="input" type="text" placeholder="Input" bind:value={link} />
		<h1 class="h1">JOIN</h1>
		<p class="h1">you join someone</p>
	</div>
</div>
