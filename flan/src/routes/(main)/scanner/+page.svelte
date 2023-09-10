<script lang="ts">
	import { onMount } from 'svelte';
	import { Html5QrcodeScanner, type QrcodeErrorCallback, type QrcodeSuccessCallback } from 'html5-qrcode';
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
<div>
	<div id="scanner" class="w-[600px]" />
</div>
