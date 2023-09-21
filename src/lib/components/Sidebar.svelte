<script>
	import { draggable } from '$lib/dragable.js';
	import Menu from '$lib/components/RightClickMenu/Menu.svelte';
	import MenuOption from '$lib/components/RightClickMenu/MenuOption.svelte';
	import { ready } from '$lib/stores.js';
	import { initClient } from '$lib/client';
	import { getTopOffset } from '$lib/utils/getTopOffset';
	import { getGuildName } from '$lib/utils/getGuildName';

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
	let clientReady = false;
	let selectedGuild = {
		guildId: null,
		displaying: false,
		moving: false,
		x: 0,
		y: 0,
		canLeave: true
	};
	let selectMenu = {
		x: 0,
		y: 0,
		show: false,
		canLeave: true
	}

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
			user = client?.users?.getCurrentUser();
			guilds = client.guilds.guilds.array();
		}
	});

	function handleDragStart(event) {
		selectedGuild.moving = true;
	}

	function handleDragEnd(event) {
		selectedGuild.moving = false;
	}

	function handleDragMove(event) {
		console.log(event.detail);
	}

	function TEMPRANDOMPINGFROM0TO9() {
		return Math.floor(Math.random() * 10);
	}

	async function onRightClick(e) {
		if (selectMenu.show) {
			selectMenu.show = false;
			await new Promise((res) => setTimeout(res, 100));
		}

		selectMenu.x = e.clientX;
		selectMenu.y = e.clientY;
		selectMenu.show = true;
		selectedGuild.displaying = false;
	}

	function closeMenu() {
		selectMenu.show = false;
	}
</script>

{#if selectMenu.show}
	<Menu x={selectMenu.x} y={selectMenu.y} on:click={closeMenu} on:clickoutside={closeMenu}>
		<hr class="w-full my-1" />
		<MenuOption on:click={() => console.log('Mark Read')} text="Mark Read" />
		<MenuOption on:click={console.log} text="Settings" />
		<hr class="border-t border-[#0003] w-full my-1" />
		<MenuOption error={true} isDisabled={selectMenu.canLeave} on:click={console.log} text="Leave Guild" />
		<hr class="w-full my-1" />
	</Menu>
{/if}

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
			<div
				use:draggable
				on:dragstart={handleDragStart}
				on:dragmove={handleDragMove}
				on:dragend={handleDragEnd}
			>
				{#if selectedGuild.displaying && selectedGuild.guildId === guild.id}
					<div
						class="bg-gray-900 text-white rounded-lg p-2 absolute"
						style="left: 75px; top: {getTopOffset(guilds, guild.id)}px;"
					>
						{guild.name}
					</div>
				{/if}
				<div
					class="flex flex-col items-center justify-center rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer m-2 relative"
					on:mouseover={() => {
						selectedGuild = {
							guildId: guild.id,
							displaying: true,
						};

						selectMenu.canLeave = guild.owner
					}}
					on:focus={() => {
						selectedGuild = {
							guildId: guild.id,
							displaying: true
						};
					}}
					on:mouseleave={() => {
						selectedGuild = {
							guildId: null,
							displaying: false
						};
					}}
					on:mousedown={(event) => {
						// if left click
						if (event.button === 0) {
							client.guilds.setCurrentGuild(guild.id);
						}
					}}
					on:contextmenu|preventDefault={onRightClick}
				>
					{#if guild.icon}
						<img src={guild.icon || `/logo.png`} alt="Logo" />
					{:else}
						<div class="text-white text-2xl font-bold mt-4 text-center relative" style="top: -8px;">
							<p style="font-size: {getGuildName(guild.name).length > 1 ? '14' : '24'}px;">
								{getGuildName(guild.name)}
							</p>
						</div>
					{/if}
					<div class="bg-[#992828] rounded-full w-4 h-4 absolute bottom-0 right-0">
						<p class="text-white text-xs font-bold text-center relative" style="top: -1px;">
							{TEMPRANDOMPINGFROM0TO9()}
						</p>
					</div>
				</div>
				{#if guild.id === client.guilds.currentGuild?.id}
					<div
						class="bg-[#c4cdda] text-white rounded-lg absolute w-1 h-[40px]"
						style="top: {getTopOffset(guilds, guild.id)}px; left: 0px;"
					/>
				{/if}
				<!-- Emulates if there was an unread notification -->
				{#if guild.id !== client.guilds.currentGuild?.id}
					<div
						class="bg-[#c4cdda] text-white rounded-lg absolute w-1 h-[15px]"
						style="top: {getTopOffset(guilds, guild.id) + 12}px; left: 0px;"
					/>
				{/if}
			</div>
		{/each}
	</div>
{/if}
