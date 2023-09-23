<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { ready, token } from '$lib/stores.js';
	import { initClient } from '$lib/client';
	import { goto } from '$app/navigation';
	import { t } from '$lib/translations';
	import { browser } from '$app/environment';

	let clientReady = false;
	let client;
	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
		}
	});

	let quotes = $t('common.quotes').map((y) => y.quote);
	let quote1 = quotes[Math.floor(Math.random() * quotes.length)];
	let quote2 = quotes[Math.floor(Math.random() * quotes.length)];
	let active = 1;
	let show = true;
	let mounted = false;
	let showing = false;

	onMount(() => {
		if (!clientReady) {
			if (!$token) {
				if (browser) {
					goto('/login');
				} else {
					throw new Error('No token provided');
				}
			}
			client = initClient($token || '');
		} else {
		}

		client?.on('ready', () => {
			show = false;
		});
		client?.on('unready', () => {
			show = true;
			goto('/login');
		});
	});

	setInterval(() => {
		if (active == 1) {
			active = 2;
			quote1 = quotes[Math.floor(Math.random() * quotes.length)];
		} else {
			active = 1;
			quote2 = quotes[Math.floor(Math.random() * quotes.length)];
		}
	}, 3000);
	onMount(() => {
		mounted = true;

		setTimeout(() => {
			showing = true;
		}, 5000);
	});
</script>

{#if show}
	<div
		class="fixed inset-0 flex items-center justify-center w-full h-full splash"
		out:fade={{ duration: 200 }}
	>
		<div class="flex flex-col items-center">
			<img src="/logo.png" alt="The Kastel Logo" />
			<div class="quotecontainer">
				{#if active === 1}
					<div class="text-white text-2xl font-bold mt-4 text-center" out:fade in:fade>
						{quote1}
					</div>
				{:else if active === 2}
					<div class="text-white text-2xl font-bold mt-4 text-center" in:fade out:fade>
						{quote2}
					</div>
				{/if}
			</div>
			{#if mounted && showing}
				<div class="text-white text-xl mt-4 text-center"
				
				transition:fade={{ duration: 1000 }}
				>
					{$t('common.slowLoading.message')} <a
						href="https://youtu.be/dQw4w9WgXcQ"
						class="underline"
						target="_blank">{$t('common.slowLoading.here')}</a
					>.
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/*weird hacky fix to make the text fade in and out*/
	.quotecontainer {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}

	.quotecontainer > div {
		grid-row: 1;
		grid-column: 1;
	}

	.splash {
		background-image: url('/splash.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		background-color: #161922;
	}
</style>
