<script>

	import { AppBar } from "@skeletonlabs/skeleton";
	import Logo from "./Logo.svelte";

</script>
<AppBar
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	class="w-screen"
>
	<svelte:fragment slot="lead">{''}</svelte:fragment>
	<a class="hover:bg-slate-400 rounded-lg duration-500 transition-colors" href="/">
		<a href="/">
			<Logo width="100" height="100" />
		</a>
	</a>
	<svelte:fragment slot="trail" />
</AppBar>
