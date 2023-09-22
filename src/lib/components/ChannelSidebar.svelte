<script>
	import { currentGuild, ready } from '$lib/stores.js';
	import { initClient } from '$lib/client';

	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	/**
	 * @type {import('@kastelll/wrapper').BaseUser}
	 */
	let user;
	let guilds;
	let clientReady = false;

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
			user = client?.users?.getCurrentUser();
			guilds = client.guilds.guilds.array();
		}
	});
</script>

{#if clientReady}
	<div
		on:mousedown={() => {
			console.log($currentGuild.channels);
		}}
	>
		{#if $currentGuild}
			Name: {$currentGuild?.name ?? 'Unknown'}
			{#each $currentGuild?.channels as channel}
				<div>
					Channel: {channel?.name ?? 'Unknown'}
				</div>
			{/each}
		{/if}
	</div>
{/if}
