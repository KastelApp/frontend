<script>
	let client;
	let user;
	import { ready } from '$lib/stores.js';
	import { t } from '$lib/translations';
	import { initClient } from '$lib/client';
	let clientReady = false;
	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();

			//Set user
			user = client?.users?.getCurrentUser();

			console.log(user)
		}
	});
</script>

{#if clientReady}
	{$t('common.welcome', { name: user?.username })}
{/if}
