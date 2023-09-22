<script>
	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	/**
	 * @type {import('@kastelll/wrapper').BaseUser}
	 */
	let user;

	import { currentChannel, currentGuild, ready } from '$lib/stores.js';
	import { t } from '$lib/translations';
	import { initClient } from '$lib/client';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let clientReady;
	export let guildId = $page.params.guildId;
	export let channelId = $page.params.channelId;

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();

			//Set user
			user = client?.users?.getCurrentUser();

			const foundGuild = client.guilds.get(guildId);

			if (!foundGuild) {
				console.log('guild no found redirect here');

				return;
			}

			const channel = foundGuild.channels.find((channel) => channel.id === channelId);

			if (!channel) {
				const FirstChannel = foundGuild.channels[0];

				if (FirstChannel) {
					goto(`/app/guilds/${guildId}/channels/${FirstChannel.id}`);

					currentGuild.set(foundGuild);
					currentChannel.set(FirstChannel);

					return;
				}

				goto(`/app/guilds/${guildId}`);

				return;
			}

			currentGuild.set(foundGuild);
		}
	});
</script>

{#if clientReady}{/if}
