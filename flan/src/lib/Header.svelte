<script>
	import { AppBar } from '@skeletonlabs/skeleton';
	import LogoW from './LogoW.svelte';
	import { peerId } from '$lib/stores';
	import { page } from '$app/stores';
	$: {console.log($page)};
	$: isRootPage = $page.url.pathname == '/' || $page.url.pathname == '/scanner';
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
		class="w-screen"
	>
		<svelte:fragment slot="lead">{''}</svelte:fragment>
		<div class="flex flex-col items-center gap-y-3">
			<a href="/">
				<LogoW width="250" height="100" />
			</a>
		</div>
		<svelte:fragment slot="trail" />
	</AppBar>
{:else}
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		class="w-screen"
	>
		<svelte:fragment slot="lead">
			<div class="flex flex-col items-center gap-y-3">
				<a href="/">
					<LogoW width="250" height="100" />
				</a>
			</div>
		</svelte:fragment>
		<code class="bg-slate-800 rounded-md p-1">{$peerId}</code>
		<svelte:fragment slot="trail" />
	</AppBar>
{/if}
