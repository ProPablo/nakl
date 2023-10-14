<script lang="ts">
	import {
		AppBar,
		LightSwitch,
		SlideToggle,
		popup,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { peerId, advancedMode, popupMsg } from '$lib/stores';
	import { page } from '$app/stores';
	import LogoWide from './svgs/LogoWide.svelte';
	import Logo from './svgs/Logo.svelte';
	import Popup from './Popup.svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';

	$: isRootPage = $page.url.pathname == '/' || $page.url.pathname == '/about';
	$: isChatPage = $page.url.pathname == '/chat';

	const modalStore = getModalStore();

	const confirmModal: ModalSettings = {
		type: 'confirm',
		title: 'Leaving? 🥺',
		body: 'Are you sure you wish to leave the chat?',
		response: (r: boolean) => {
			if (r) goto('/');
		}
	};
</script>

<!-- 
	find better way to conditionally render 
	ref https://learn.svelte.dev/tutorial/breaking-out-of-layouts 
-->
<Popup />
{#if isRootPage}
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-self-center"
		slotLead="place-self-center"
		class="w-screen">
		<svelte:fragment slot="lead">
			<div
				use:popup={{
					event: 'hover',
					target: 'popupHover',
					placement: 'top'
				}}
				on:mouseover={() => ($popupMsg = 'Switch Theme')}
				on:focus={() => ($popupMsg = 'Switch Theme')}
				role="button"
				tabindex="0">
				<LightSwitch />
			</div>
		</svelte:fragment>
		<div class="flex flex-col items-center gap-y-3">
			<a type="button" href="/" data-sveltekit-reload>
				<Logo classes="md:hidden" width="100" height="100" />
				<LogoWide classes="hidden md:flex" width="250" height="100" />
			</a>
		</div>
		<svelte:fragment slot="trail">
			<div
				use:popup={{
					event: 'hover',
					target: 'popupHover',
					placement: 'top'
				}}
				on:mouseover={() => ($popupMsg = 'Toggle Advanced Mode')}
				on:focus={() => ($popupMsg = 'Toggle Advanced Mode')}
				role="button"
				tabindex="0">
				<SlideToggle name="advanced" bind:checked={$advancedMode}>Adv. Mode</SlideToggle>
			</div>
		</svelte:fragment>
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
				<button
					on:click={() => {
						if (!isChatPage) {
							goto('/');
							return;
						};
						modalStore.trigger(confirmModal)
					}}>
					<Logo classes="md:hidden" width="100" height="100" />
					<LogoWide classes="hidden md:flex" width="250" height="100" />
				</button>
			</div>
		</svelte:fragment>
		<div class="flex flex-col">
			<strong class="text-center">Peer ID</strong>
			<p class="badge-glass px-2 rounded-md text-center">{$peerId}</p>
		</div>
		<svelte:fragment slot="trail" />
	</AppBar>
{/if}
