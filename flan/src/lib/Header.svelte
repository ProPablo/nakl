<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { peerId } from '$lib/stores';
	import { page } from '$app/stores';
	import LogoWide from './LogoWide.svelte';
	import Logo from './Logo.svelte';
	import { fade } from 'svelte/transition';

	$: isRootPage = $page.url.pathname == '/';

	// import { onMount } from 'svelte';
	// let matches = window.matchMedia('(min-width: 768px)').matches;
	// onMount(() => {
	// 	window
	// 		.matchMedia('(min-width: 768px)')
	// 		.addEventListener('change', (e) => (matches = e.matches));
	// });
</script>

<!-- 
	find better way to conditionally render 
	ref https://learn.svelte.dev/tutorial/breaking-out-of-layouts 
-->
{#if isRootPage}
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		class="w-screen">
		<svelte:fragment slot="lead">{''}</svelte:fragment>
		<div class="flex flex-col items-center gap-y-3">

			<a type="button" href="/" data-sveltekit-reload>
				<Logo classes="md:hidden" width="100" height="100" />
				<LogoWide classes="hidden md:flex" width="250" height="100" />
			</a>
		</div>
		<svelte:fragment slot="trail" />
	</AppBar>
{:else}
	<AppBar
		gridColumns="grid-cols-[auto_1fr]"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		class="w-screen">
		<svelte:fragment slot="lead">
			<div class="flex flex-col items-center gap-y-3">

				<!-- <a in:fade|global={{ duration: 500 }} out:fade|global={{ duration: 500 }} href="/"> -->
				<a href="/">
					<Logo classes="md:hidden" width="100" height="100" />
					<LogoWide classes="hidden md:flex" width="250" height="100" />
				</a>
			</div>
		</svelte:fragment>
		<div
			class="flex flex-col">
			<strong class="text-center">Peer ID</strong>
			<p class="bg-slate-800 rounded-md text-center">{$peerId}</p>
		</div>
		<svelte:fragment slot="trail" />
	</AppBar>
{/if}
