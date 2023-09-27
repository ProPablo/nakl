<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { peerId } from '$lib/stores';
	import {
		Html5QrcodeScanner,
		type QrcodeErrorCallback,
		type QrcodeSuccessCallback
	} from 'html5-qrcode';
	import { goto } from '$app/navigation';

	// const peer = getContext('peer');
	onMount(() => {
		const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
			if (decodedText == '') return;
			console.log(`Code matched = ${decodedText}`, decodedResult);
			const slug = decodedText.split('/').pop();
			goto(`/connect/${slug}`);
			// Navigate to slug page
			console.log('GO CHAT');
		};

		const onScanFailure: QrcodeErrorCallback = (error) => {
			// console.warn(`Code scan error = ${error}`);
		};

		let html5QrcodeScanner = new Html5QrcodeScanner(
			'scanner',
			{ fps: 100, qrbox: { width: 250, height: 250 } },
			/* verbose= */ false
		);
		html5QrcodeScanner.render(onScanSuccess, onScanFailure);
	});
</script>

<div class="flex container mx-auto justify-center items-center">
	<div class="flex flex-col justify-center items-center space-y-5 pt-10">
		<h1 class="text-5xl">JOIN</h1>
		<h2 class="text-2xl">you join someone</h2>
		<div id="scanner" class="w-[300px]" />
	</div>
</div>
