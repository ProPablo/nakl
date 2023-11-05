<script lang="ts">
	import Yourself from '$lib/svgs/Yourself.svelte';
	import Others from '$lib/svgs/Others.svelte';
	import YourselfAlt from '$lib/svgs/YourselfAlt.svelte';
	import { AppShell, modeCurrent } from '@skeletonlabs/skeleton';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	$: svgFill = $modeCurrent ? '#d3d0e2' : '#bbb7cd';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<div class="flex container mx-auto px-3 justify-center items-center my-6">
		<div class="flex flex-col justify-center items-center space-y-5 pt-10">
			<h1 class="text-5xl">About</h1>
			<p class="text-center">
				NAKL was originally made as a part of the
				<a
					href="https://uqcs.org/competitions/hackathon-2022/"
					class="text-sky-500 hover:text-sky-200 transition-colors">
					2022 UQCS Hackathon
				</a>
				with goal being to address the gap in the market for an AirDrop-like experience on other devices
				without needing to worry about device compatibility or privacy-concerns.
			</p>
			<div class="w-full card card-hover text-center p-4 space-y-3">
				<h2 class="text-2xl">Developed By</h2>
				<p>
					<strong>Anhad Ahuja:</strong>
					anhadrs@gmail.com
				</p>
				<p>
					<strong>Tyrone Nolasco:</strong>
					tyronewessnolasco@gmail.com
				</p>
			</div>
			<div class="w-full card card-hover text-center p-4 space-y-3">
				<h2 class="text-2xl">Use-Cases</h2>
				<div class="flex flex-col lg:flex-row gap-4">
					<div class="flex flex-col items-center gap-3">
						<strong>With Yourself</strong>
						<div class="flex flex-row gap-4">
							<Yourself
								width="100"
								height="100"
								phoneFill={svgFill}
								classes="bg-[#d3d0e2] dark:bg-[#bbb7cd] rounded-lg p-3 shadow-xl" />
							<YourselfAlt
								width="100"
								height="100"
								phoneFill={svgFill}
								classes="bg-[#d3d0e2] dark:bg-[#bbb7cd] rounded-lg p-3 shadow-xl" />
						</div>
						<p>
							If you need to transfer files or text between yourself on two different devices, you
							can either scan the QR code from another device you own or manually enter in the
							peerID (given that you're in advanced mode)
						</p>
					</div>
					<div class="flex flex-col items-center gap-3">
						<strong>With Others</strong>
						<Others
							width="100"
							height="100"
							phoneFill={svgFill}
							classes="bg-[#d3d0e2] dark:bg-[#bbb7cd] rounded-lg p-3 shadow-xl" />
						<p>
							If you need to transfer files or text between yourself and someone else, all you have
							to do is show them the QR code and get them to scan it
						</p>
					</div>
				</div>
			</div>
			<div class="w-full card card-hover text-left p-12">
				<h2 class="text-3xl text-center">FAQ</h2>
				<p class="leading-relaxed my-4">
					<strong>How secure is this?</strong>
					<br />
					This is a serverless P2P website, meaning that there is no persistent storage of data.
					<br />
					As soon as the connection is terminated and both users have left the chat webpage, the data
					sent via the P2P instance goes with it.
				</p>

				<p class="leading-relaxed my-4">
					<strong>How do I report an issue?</strong>
					<br />
					Visit our GitHub and raise an issue. We'd be happy to hear your feedback!
				</p>

				<p class="leading-relaxed my-4">
					<strong>How do I report inappropriate usage of the platform?</strong>
					<br />
					Use the contact card above and please send us through an email with as much information as
					you know.
				</p>
			</div>
			<div class="w-full card card-hover text-center p-4 space-y-3">
				<h2 class="text-2xl">Disclaimer</h2>
				<p>
					This website is intended for lawful file sharing only. We do not condone or support
					illegal content sharing. Users are responsible for the content they share and must comply
					with all relevant laws and regulations. We disclaim any responsibility for illegal content
					shared on this platform. Please report violations, and users engaging in illegal
					activities may face legal consequences. Use this website responsibly and in accordance
					with the law.
				</p>
			</div>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<Footer />
	</svelte:fragment>
</AppShell>
