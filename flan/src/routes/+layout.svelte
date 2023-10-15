<script lang="ts">
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import {
		Modal,
		storeHighlightJs,
		Toast,
		type ModalComponent,
		type PopupSettings,
	} from '@skeletonlabs/skeleton';
	import ImageModal from '$lib/ImageModal.svelte';
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Initialise stores
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Popup from '$lib/Popup.svelte';
	initializeStores();

	onMount(() => {
		console.log('layout mounted', $page);
	});

	const modalComponentRegistry: Record<string, ModalComponent> = {
		imageModal: {
			ref: ImageModal,
		},
	};
</script>

<Toast />
<Modal components={modalComponentRegistry}/>
<Popup />
<slot />
