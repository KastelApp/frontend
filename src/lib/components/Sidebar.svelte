<script>
	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	/**
	 * @type {import('@kastelll/wrapper').User}
	 */
	let user;
	/**
	 * @type {import('@kastelll/wrapper').BaseGuild[]}
	 */
	let guilds;
	import { ready } from '$lib/stores.js';
	import { initClient } from '$lib/client';
	let clientReady = false;
	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
			user = client?.users?.getCurrentUser();
			guilds = client.guilds.guilds.array();
			console.log(guilds);
		}
	});

	let displayingGuildName = {
		guildId: null,
		displaying: false
	};

	function getTopOffset(guildId) {
		const index = guilds.indexOf(guilds.find((guild) => guild.id === guildId));
		const initialOffset = 93;
		const difference = 64;
		return initialOffset + index * difference;
	}

	function getGuildName(guildName) {
		let end = "";

		for (const word of guildName.split(" ")) {
			end += word[0];
		}

		return end;
	}
</script>

{#if clientReady}
	<div class="h-screen w-16 flex flex-col bg-white dark:bg-gray-900 shadow-lg mr-2 unselectable">
		<div
			class="flex flex-col items-center justify-center rounded-full bg-red-400 hover:bg-red-500 cursor-pointer m-2 relative"
		>
			<img src={user?.avatar || `/logo.png`} alt="Logo" />
			<div class="bg-green-600 rounded-full w-4 h-4 absolute bottom-0 right-0" />
		</div>
		<div class="bg-gray-300 dark:bg-gray-700 h-px w-full my-2" />

		{#each guilds as guild}
			<div>
				{#if displayingGuildName.displaying && displayingGuildName.guildId === guild.id}
					<div
						class="bg-gray-900 text-white rounded-lg p-2 absolute"
						style="left: 75px; top: {getTopOffset(guild.id)}px;"
					>
						{guild.name}
					</div>
				{/if}
				<div
					class="flex flex-col items-center justify-center rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer m-2 relative"
					on:mouseover={() => {
						displayingGuildName = {
							guildId: guild.id,
							displaying: true
						};
					}}
					on:focus={() => {
						displayingGuildName = {
							guildId: guild.id,
							displaying: true
						};
					}}
					on:mouseleave={() => {
						displayingGuildName = {
							guildId: null,
							displaying: false
						};
					}}
				>
					{#if guild.icon}
						<img src={guild.icon || `/logo.png`} alt="Logo" />
					{:else}
						<div class="text-white text-2xl font-bold mt-4 text-center relative" style="top: -8px;">
							{getGuildName(guild.name)}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
