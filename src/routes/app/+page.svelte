<script>
	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	/**
	 * @type {import('@kastelll/wrapper').BaseUser}
	 */
	let user;

	import { currentGuild, ready } from '$lib/stores.js';
	import { t } from '$lib/translations';
	import { initClient } from '$lib/client';

	let clientReady;

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();

			//Set user
			user = client?.users?.getCurrentUser();
		}
	});

</script>

{#if clientReady}
<div>

	{$t('common.welcome', { name: user?.username })}
</div>
{/if}
