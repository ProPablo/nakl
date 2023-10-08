<script>
	import { page } from '$app/stores';
	import Header from '$lib/Header.svelte';
</script>

<div class="variant-glass-warning flex flex-col h-full w-full items-center justify-center">
  <h1 class="font-extrabold text-8xl">{$page.status}</h1>
  <h2 class="italic text-3xl"> {$page.error?.message}</h2>
  <a href="/" class="hover:variant-soft-surface button btn-lg variant-glass-surface rounded-lg my-6">Go home 🏠</a>
</div>