<script>
	let client;
	let user;
	let guilds;
	import { ready } from '$lib/stores.js';
	import { t } from '$lib/translations';
	import { initClient } from '$lib/client';
	let clientReady = false;
	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
			user = client?.users?.getCurrentUser();
			guilds = client?.guilds?.getGuilds();
			console.log(guilds);
		}
	});
</script>

{#if clientReady}
	<div class="h-screen w-16 flex flex-col bg-white dark:bg-gray-900 shadow-lg mr-2">
		<div
			class="flex flex-col items-center justify-center rounded-full bg-red-400 dark:bg-red-600 hover:bg-red-500 dark:hover:bg-red-700 cursor-pointer m-2 relative"
		>
			<img src={user?.avatar || `/logo.png`} alt="Logo" />
			<div class="bg-green-600 rounded-full w-4 h-4 absolute bottom-0 right-0" />
		</div>
		<!--line-->
		<div class="bg-gray-300 dark:bg-gray-700 h-px w-full my-2" />

		<!-- {#each guilds as guild}
			<div
				class="flex flex-col items-center justify-center rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer m-2 relative"
			>
				<img src={guild?.icon || `/logo.png`} alt="Logo" />
				<div class="bg-green-600 rounded-full w-4 h-4 absolute bottom-0 right-0" />
			</div>
		{/each} -->
	</div>
{/if}
