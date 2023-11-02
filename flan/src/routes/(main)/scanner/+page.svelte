<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { peerId } from '$lib/stores';
	import {
		Html5QrcodeScanner,
		type QrcodeErrorCallback,
		type QrcodeSuccessCallback
	} from 'html5-qrcode';
	import { goto } from '$app/navigation';
	import { dev } from '$app/environment';

	// const peer = getContext('peer');
	onMount(() => {
		const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
			if (decodedText == '') return;
			console.log(`Code matched = ${decodedText}`, decodedResult, html5QrcodeScanner);
			const slug = decodedText.split('/').pop();
			goto(`/connect/${slug}`);
			// Navigate to slug page
			console.log('GO CHAT');
			html5QrcodeScanner.clear();
		};

		const onScanFailure: QrcodeErrorCallback = (error) => {
			// if (dev) console.warn(`Code scan error = ${error}`);
		};

		let html5QrcodeScanner = new Html5QrcodeScanner(
			'scanner',
			{ fps: 100, qrbox: { width: 500, height: 500 } },
			/* verbose= */ false
		);
		html5QrcodeScanner.render(onScanSuccess, onScanFailure);
		return () => {
			console.log('Stopping scanner');
			html5QrcodeScanner.clear();
		};
	});
</script>

<div class="flex container mx-auto justify-center items-center">
	<div class="flex flex-col justify-center items-center space-y-5 pt-10">
		<h1 class="text-5xl">JOIN</h1>
		<h2 class="text-2xl">you join someone</h2>
		<div id="scanner" class="lg:w-[700px]" />
	</div>
</div>
