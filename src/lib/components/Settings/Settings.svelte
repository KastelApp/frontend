<script>
	import { ready } from '$lib/stores.js';
	import { initClient } from '$lib/client';
	import SettingsSideBar from './SettingsSideBar.svelte';

	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	let clientReady = false;

    ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
		}
	});
</script>

{#if clientReady}
    <div class="absolute bg-[#202432] w-full h-full flex">
        <SettingsSideBar />
    </div>
{/if}