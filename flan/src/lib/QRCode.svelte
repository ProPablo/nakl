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
		QRCode.toCanvas(QRCanvas, link, {scale: 6}, (error) => {
			if (error) console.log(error);
		});
	}
</script>

<canvas bind:this={QRCanvas} class="rounded-lg -z-10" />
