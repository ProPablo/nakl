<script lang="ts">
	import QRCode from 'qrcode';
	export let link: string = '';
	let QRCanvas: HTMLCanvasElement | null;
	$: {
		if (!QRCanvas) break $;
		QRCanvas.id = link;
	}

	$: {
		if (!QRCanvas) break $;
		QRCode.toCanvas(QRCanvas, link, (error) => {
			if (error) console.log(error);
			console.log('QR Code success!');
		});
	}
</script>

<canvas bind:this={QRCanvas} class="rounded-lg hover:scale-105 transition-transform"/>
