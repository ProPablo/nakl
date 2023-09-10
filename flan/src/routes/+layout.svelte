<script lang="ts">
	import Logo from '$lib/Logo.svelte';
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { AppBar, storeHighlightJs } from '@skeletonlabs/skeleton';
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<div class="h-full flex flex-col justify-center items-center">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end" class="w-screen">
		<svelte:fragment slot="lead">{''}</svelte:fragment>
		<a class="hover:bg-slate-400 rounded-lg duration-500 transition-colors" href="/">
			<Logo width="100" height="100" />
		</a>
		<svelte:fragment slot="trail" />
	</AppBar>
	<slot />
</div>
