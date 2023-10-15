<script lang="ts">
	import { popupMsg, isDesktop } from '$lib/stores';
</script>

{#if $isDesktop}
	<div class="z-50 card p-4 variant-filled-secondary" data-popup="popupHover">
		<p class="text-center">{$popupMsg}</p>
		<div class="arrow variant-filled-secondary" />
	</div>
{/if}
