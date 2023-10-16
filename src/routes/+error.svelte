<script>
	import { t } from '$lib/translations';
	import { onMount } from 'svelte';
	import { blur, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Navbar from '$lib/components/Navbar.svelte';
	import { page } from '$app/stores';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<Navbar />
<div class="bg-black splash min-h-screen">
	{#if mounted}
		<div
			class="flex items-center text-center justify-center flex-col pt-7 homeHeader h-screen"
			out:fly={{ y: -100, duration: 1000, easing: cubicOut }}
		>
			<h1 class="text-7xl font-bold text-white" in:blur={{ duration: 500, delay: 50 }}>
				{$page.status}
			</h1>
			<p class="text-white text-3xl" in:fly={{ y: 50, duration: 1000, delay: 1000 }}>
				{$page.error.message}
			</p>
			<button
				class="mt-3 bg-white text-black p-3 rounded-lg pl-5 pr-5"
				in:fly={{ y: 50, duration: 1000, delay: 2200, easing: cubicOut }}
				on:click={() => {
					history.back();
				}}
			>
				{$t('common.back')}
			</button>
		</div>
	{/if}
</div>

<style>
	.splash {
		background-image: url('/splash.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		background-color: #161922;
	}
	.homeHeader {
		min-height: 50vh;
	}
</style>
