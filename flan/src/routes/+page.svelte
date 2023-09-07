<script lang="ts">
	import { Html5QrcodeScanner, type QrcodeErrorCallback, type QrcodeSuccessCallback } from 'html5-qrcode';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { AppBar, FileDropzone } from '@skeletonlabs/skeleton';
	import QRCode from '../components/QRCode.svelte';
	import Logo from '../lib/Logo.svelte';
	let link = '';
	let scanned = '';
	onMount(() => {
		const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
			if (decodedText == "") return
			console.log(`Code matched = ${decodedText}`, decodedResult);
			scanned = decodedText;
			console.log("GO CHAT");
		};

		const onScanFailure: QrcodeErrorCallback = (error) => {
			// console.warn(`Code scan error = ${error}`);
		}

		let html5QrcodeScanner = new Html5QrcodeScanner(
			'scanner',
			{ fps: 100, qrbox: { width: 250, height: 250 } },
			/* verbose= */ false
		);
		html5QrcodeScanner.render(onScanSuccess, onScanFailure);
	});
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
		<div id="scanner" class="w-[600px]" />
	</div>
</div>
