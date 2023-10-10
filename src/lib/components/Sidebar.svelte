<script>
	import { draggable } from '$lib/dragable.js';
	import Menu from '$lib/components/RightClickMenu/Menu.svelte';
	import MenuOption from '$lib/components/RightClickMenu/MenuOption.svelte';
	import {
		currentChannel,
		currentGuild,
		lastChannelCache,
		modals,
		ready,
		settingsOpen
	} from '$lib/stores.js';
	import { initClient } from '$lib/client';
	import { getGuildName } from '$lib/utils/getGuildName';
	import { fade } from 'svelte/transition';
	import { t } from '$lib/translations';
	import { goto } from '$app/navigation';
	import { ChannelTypes } from '@kastelll/wrapper';
	import Modal from './Modals/Modal.svelte';
	import TextInput from './Modals/Types/TextInput.svelte';
	import { writable } from 'svelte/store';
	import BigButton from './Modals/Types/Special/BigButton.svelte';
	import LongTextInput from './Modals/Types/LongTextInput.svelte';

	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	/**
	 * @type {import('@kastelll/wrapper').BaseUser}
	 */
	let user;
	/**
	 * @type {import('@kastelll/wrapper').BaseGuild[]}
	 */
	let guilds;
	let clientReady = false;
	const isOpen = writable(false);
	const typeofOpen = writable(0); // 0 = nothing, 1 = creating a new guild, 2 = joining a guild

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
		canLeave: true,
		guild: false
	};

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
		selectMenu.guild = false;
	}

	function onMouseOver(guild) {
		const target = document.getElementById(`guild-${guild.id}`);

		const rect = target.getBoundingClientRect();

		selectedGuild = {
			guildId: guild.id,
			displaying: true,
			x: rect.x,
			y: rect.y
		};
	}

	function onAddGuildMouseOver() {
		const target = document.getElementById(`add-guild`);

		const rect = target.getBoundingClientRect();

		selectedGuild = {
			guildId: null,
			displaying: true,
			x: rect.x,
			y: rect.y
		};
	}
</script>

{#if $isOpen}
	<Modal
		let:parentId
		title={$typeofOpen === 0
			? 'Create or Join a Guild'
			: $typeofOpen === 1
			? 'Create a Guild'
			: 'Join a Guild'}
		buttons={[
			...($typeofOpen === 0
				? [
						{
							text: 'Close',
							color: '#2a2e3f',
							action: 'close',
							onClick: () => {
								$isOpen = false;
							}
						}
				  ]
				: [
						{
							text: 'Back',
							color: '#2a2e3f',
							action: 'none',
							onClick: (mod) => {
								$typeofOpen = 0;

								const foundModal = $modals.find((modal) => modal.id === mod.id);

								if (!foundModal) return;

								foundModal.textInputOptions.forEach((input) => {
									input.value = '';
								});
							}
						},
						{
							text: $typeofOpen === 1 ? 'Create' : 'Join',
							color: '#2a2e3f',
							action: 'submit',
							onClick: (modal) => {
								console.log(modal);
							}
						}
				  ])
		]}
		blackout={true}
		on:closed={() => {
			$isOpen = false;
			$typeofOpen = 0;
		}}
	>
		{#if $typeofOpen === 0}
			<BigButton
				title={'Create a Guild'}
				str={'/logo.png'}
				img
				on:click={() => {
					$typeofOpen = 1;
				}}
			>
				<svg
					width={10}
					height={16}
					viewBox="0 0 10 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 14L6 8L0 2L2 -3.8147e-06L10 8L2 16L0 14Z"
						fill="white"
					/>
				</svg>
			</BigButton>
			<BigButton
				title={'Join a Guild'}
				str={'+'}
				on:click={() => {
					$typeofOpen = 2;
				}}
			>
				<svg
					width={10}
					height={16}
					viewBox="0 0 10 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 14L6 8L0 2L2 -3.8147e-06L10 8L2 16L0 14Z"
						fill="white"
					/>
				</svg>
			</BigButton>
		{:else if $typeofOpen === 1}
			<TextInput
				title="Name"
				inputType="text"
				id="create-name"
				{parentId}
				placeholder="Cool Kidz Hangout"
			/>
			<LongTextInput
				title="Description"
				inputType="text"
				id="create-description"
				{parentId}
				placeholder="A cool place for cool kids"
			/>
		{:else if $typeofOpen === 2}
			<TextInput
				title="Invite Code"
				inputType="text"
				id="joinguild"
				{parentId}
				placeholder="kastelapp.com/invites/xpFRJQUy"
				maxLength={100}
			/>
		{/if}
	</Modal>
{/if}

{#if selectMenu.show && selectMenu.guild}
	<Menu x={selectMenu.x} y={selectMenu.y} on:click={closeMenu} on:clickoutside={closeMenu}>
		<hr class="w-full my-1" style="display:none;" />
		<MenuOption
			on:click={() => console.log('Mark Read')}
			text={$t('common.selectMenus.guild.markAsRead')}
		/>
		<MenuOption on:click={console.log} text={$t('common.selectMenus.guild.settings')} />
		<hr class="border-t border-[#0003] w-full my-1" />
		<MenuOption
			error={true}
			isDisabled={selectMenu.canLeave}
			on:click={console.log}
			text={$t('common.selectMenus.guild.leave')}
		/>
		<hr class="w-full my-1" style="display:none;" />
	</Menu>
{/if}

{#if selectMenu.show && !selectMenu.guild}
	<Menu x={selectMenu.x} y={selectMenu.y} on:click={closeMenu} on:clickoutside={closeMenu}>
		<hr class="w-full my-1" style="display:none;" />
		<MenuOption
			on:click={() => {
				settingsOpen.set(true);
			}}
			text="Settings"
		/>
		<hr class="w-full my-1" />
	</Menu>
{/if}

{#if clientReady}
	<div class="w-16 flex flex-col bg-white dark:bg-[#101219] shadow-lg unselectable h-full">
		<div class="flex flex-col flex-grow relative dark:bg-[#101219]">
			<div
				on:contextmenu|preventDefault={(e) => {
					selectMenu.guild = false;
					onRightClick(e);
				}}
				on:mousedown={(event) => {
					if (event.button === 0) {
						client.guilds.setCurrentGuild(null);
						currentChannel.set(null);
						currentGuild.set(null);

						goto('/app');

						return;
					}
				}}
				class="flex flex-col items-center justify-center rounded-full bg-red-400 hover:bg-red-500 cursor-pointer m-2 relative"
			>
				<img src={user?.avatar || `/logo.png`} alt="Logo" />
				<div class="bg-green-600 rounded-full w-4 h-4 absolute bottom-0 right-0" />
			</div>
			<div class="bg-gray-300 dark:bg-gray-700 h-px w-full my-2" />

			{#each guilds as guild}
				{#if selectedGuild.displaying && selectedGuild.guildId === guild.id}
					<div
						transition:fade={{ duration: 150 }}
						class="bg-[#101219] text-white rounded-lg p-2 fixed left-[80px] z-50"
						style="top: {selectedGuild.y}px;"
					>
						{guild.name}
					</div>
				{/if}
				<div
					use:draggable
					on:dragstart={handleDragStart}
					on:dragmove={handleDragMove}
					on:dragend={handleDragEnd}
				>
					<div
						id={`guild-${guild.id}`}
						class="flex flex-col items-center justify-center rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer m-2 relative"
						on:mouseover={onMouseOver(guild)}
						on:focus={onMouseOver(guild)}
						on:mouseleave={() => {
							selectedGuild = {
								guildId: null,
								displaying: false
							};
						}}
						on:mouseup={(event) => {
							if (event.button === 0) {
								client.guilds.setCurrentGuild(guild.id);

								const ChannelCache = $lastChannelCache[guild.id];

								if (ChannelCache) {
									const foundChannel = guild.channels.find(
										(channel) => channel.id === ChannelCache
									);

									if (foundChannel) {
										goto(`/app/guilds/${guild.id}/channels/${foundChannel.id}`);

										currentGuild.set(guild);
										currentChannel.set(foundChannel);

										return;
									}
								}

								const FirstChannel = guild.channels.find(
									(channel) =>
										channel.type === 'GuildText' ||
										channel.type === 'GuildNews' ||
										channel.type === 'GuildNewMember' ||
										channel.type === 'GuildRules'
								);

								if (FirstChannel) {
									goto(`/app/guilds/${guild.id}/channels/${FirstChannel.id}`);

									currentGuild.set(guild);
									currentChannel.set(FirstChannel);
									$lastChannelCache[guild.id] = FirstChannel.id;

									return;
								}

								return;
							}
						}}
						on:contextmenu|preventDefault={async (e) => {
							selectMenu.canLeave = guild.owner;
							selectMenu.guild = true;

							onRightClick(e);
						}}
					>
						<div>
							{#if guild.icon}
								<img src={guild.icon || `/logo.png`} alt="Logo" />
							{:else}
								<div
									class="text-white text-2xl font-bold mt-4 text-center relative"
									style="top: -8px;"
								>
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

						{#if guild.id === $currentGuild?.id}
							<div
								transition:fade={{ duration: 250 }}
								class="bg-[#c4cdda] text-white rounded-lg absolute w-1 h-[40px] left-[-8px]"
							/>
						{/if}
						{#if guild.id !== client.guilds.currentGuild?.id}
							<div
								transition:fade={{ duration: 250 }}
								class="bg-[#c4cdda] text-white rounded-lg absolute w-1 h-[15px] bottom-[16px] left-[-8px]"
							/>
						{/if}
					</div>
				</div>
			{/each}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="flex flex-col items-center justify-center rounded-full bg-[#22AA98] hover:bg-[#1B887A] cursor-pointer m-2 relative"
				id="add-guild"
				on:mouseover={onAddGuildMouseOver}
				on:focus={onAddGuildMouseOver}
				on:mouseleave={() => {
					selectedGuild = {
						guildId: null,
						displaying: false
					};
				}}
				on:click={() => {
					$isOpen = true;
					console.log('owo?');
				}}
			>
				<div class="text-white text-2xl font-bold mt-4 text-center relative" style="top: -9px;">
					<p style="font-size: 24px;">+</p>
				</div>

				{#if selectedGuild.displaying && selectedGuild.guildId === null}
					<div
						transition:fade={{ duration: 150 }}
						class="bg-[#101219] text-white rounded-lg p-2 fixed left-[80px] z-50"
						style="top: {selectedGuild.y}px;"
					>
						Add Guild
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
