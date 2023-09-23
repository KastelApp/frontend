<script>
	import {
		collapsedChannels,
		currentChannel,
		currentGuild,
		lastChannelCache,
		ready
	} from '$lib/stores.js';
	import { initClient } from '$lib/client';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { SortChannels } from '$lib/utils/sortChannels';

	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	let clientReady = false;
	let guilds;

	let sortedChannelGroups;

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
			guilds = client.guilds.guilds.array();
		}
	});

	currentGuild.subscribe((guild) => {
		if (guild) {
			sortedChannelGroups = SortChannels(guild.channels);
		}
	});

	function getGuildName(name) {
		if (name.length > 12) {
			return name.slice(0, 12) + '...';
		} else {
			return name;
		}
	}

	function getChannelName(name) {
		if (name.length > 18) {
			return name.slice(0, 18) + '...';
		} else {
			return name;
		}
	}
</script>

{#if clientReady}
	<div
		class="flex flex-col bg-white dark:bg-[#171923] shadow-lg unselectable w-[191px] h-full"
		style="border-right: 2px solid #2D3748; border-left: 1px solid #2D3748;"
	>
		<div class="flex flex-col flex-grow relative">
			{#if $currentGuild}
				<div
					class="flex flex-row items-center justify-between px-8 cursor-pointer relative hover:bg-[#202331] transition ease-in-out duration-200"
					style="top: 0px; bottom: 8px; height: 44px;"
				>
					<div class="">
						<span class="text-lg font-medium text-white">{getGuildName($currentGuild.name)}</span>
					</div>
				</div>
				<hr class="border-t w-full my-[0px]" style="border-color: #2D3748; border-width: 1px;" />
				<div class="my-2" />
				{#each sortedChannelGroups as channel}
					<div>
						{#if !$collapsedChannels.includes(channel.parentId) || channel.id === $currentChannel.id}
							<div
								class="relative flex flex-row items-center justify-between py-1 cursor-pointer rounded-lg {channel.type !==
								'GuildCategory'
									? 'textBasedChannel'
									: ''}"
								style="left: 12px; width: 174px; {channel.id === $currentChannel.id
									? 'background-color: #2D3748;'
									: ''}"
								transition:fade={{ duration: 150 }}
								on:mouseup={(event) => {
									if (event.button !== 0) return;

									if (channel.type === 'GuildCategory') {
										if ($collapsedChannels.includes(channel.id)) {
											$collapsedChannels = $collapsedChannels.filter((id) => id !== channel.id);
										} else {
											$collapsedChannels = [...$collapsedChannels, channel.id];
										}

										return;
									}

									currentChannel.set(channel);

									$lastChannelCache[$currentGuild.id] = channel.id;

									goto(`/app/guilds/${$currentGuild.id}/channels/${channel.id}`);
								}}
							>
								<div class="flex flex-row items-center">
									{#if channel.type === 'GuildText'}
										<svg
											width="20px"
											height="20px"
											viewBox="0 0 0.72 0.72"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											><path
												d="m0.21 0.57 0.12 -0.42m0.06 0.42 0.12 -0.42m0.06 0.12H0.195m0.33 0.18H0.15"
												stroke="#ffff"
												stroke-width="0.06"
												stroke-linecap="round"
												stroke-linejoin="round"
											/></svg
										>
									{:else if channel.type === 'GuildVoice'}
										<svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M12 2c-4.4 0-8 3.6-8 8v4c0 4.4 3.6 8 8 8s8-3.6 8-8v-4c0-4.4-3.6-8-8-8zm6 12c0 3.3-2.7 6-6 6s-6-2.7-6-6v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4zm-4-4h-2v-4h2v4zm-4 0h-2v-4h2v4zm-3 4h-2v-4h2v4zm-1-6h-2v-4h2v4z"
											/>
										</svg>
									{:else if channel.type === 'GuildCategory'}
										<span
											class="text-sm text-white hover:text-gray-300 transition ease-in-out duration-200"
											>{getChannelName(channel.name)}</span
										>
										<svg
											width="16px"
											height="16px"
											viewBox="0 0 0.72 0.72"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style={$collapsedChannels.includes(channel.id)
												? 'transform: rotate(270deg);'
												: ''}
											class="transform rotate-270 transition-transform duration-250"
											><path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M0.381 0.441a0.03 0.03 0 0 1 -0.042 0l-0.15 -0.15a0.03 0.03 0 0 1 0.042 -0.042L0.36 0.378l0.129 -0.129a0.03 0.03 0 1 1 0.042 0.042l-0.15 0.15Z"
												fill="#fff"
											/></svg
										>
									{:else if channel.type === 'GuildNews'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18px"
											height="18px"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#fff"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M3 11l18-5v12L3 14v-3z" />
											<path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
										</svg>
									{/if}

									{#if channel.type !== 'GuildCategory'}
										<span class="mb-1 text-sm text-white relative left-1"
											>{getChannelName(channel.name)}</span
										>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}
