<script>
	import { initClient } from '$lib/client';
	import { currentGuild, ready } from '$lib/stores';

	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
    let clientReady = false;

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();

            console.log($currentGuild)
		}
	});
</script>

{#if clientReady}

{/if}