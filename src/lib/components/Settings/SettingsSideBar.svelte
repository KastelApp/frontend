<script>
	import { ready, token } from '$lib/stores.js';
	import { initClient } from '$lib/client';
	import { each } from 'svelte/internal';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	let clientReady = false;

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();
		}
	});

	const options = [
		{
			name: 'Profile',
			options: [
				{
					name: 'My Profile',
					badges: [],
					selected: true
				},
				{
					name: 'Privacy & Safety',
					badges: []
				},
				{
					name: 'Sessions',
					badges: [
						{
							name: 'Beta',
							color: '#4F2D7C'
						}
					]
				}
			]
		},
		{
			name: 'General Settings',
			options: [
				{
					name: 'Appearance',
					badges: []
				},
				{
					name: 'Accessibility',
					badges: []
				},
				{
					name: 'Text & Language',
					badges: []
				}
			]
		},
		{
			name: 'Billing',
			options: [
				{
					name: 'Subscriptions',
					badges: [],
					onClick: () => {}
				},

				{
					name: 'Shards',
					badges: []
				},
				{
					name: 'Details & History',
					badges: []
				},
				{
					name: 'Invoices',
					badges: []
				}
			]
		},
		{
			name: null,
			options: [
				{
					name: 'Logout',
					badges: [],
					selected: false,
					onClick: () => {
						if (!browser) return;
						client.logout();
						client.setToken(null);
						token.set(null);
						goto('/login');
					}
				}
			]
		}
	];

	const buildInfo = {
		channel: __BUILD_CHANNEL__,
		commit: __GIT_COMMIT__
	};
</script>

{#if clientReady}
	<div class="relative border-r border-l-0 bg-[#171923] border-[#2d3748] w-[358px] unselectable">
		<div class="block w-48 h-[588px] relative left-[140px] top-[72px]">
			<div class="w-[175px] top-[11px] ">
				{#each options as option}
					<div class="top-[148px]">
						<hr
							class="border-t w-full my-[4px]"
							style="border-color: #2D3748; border-width: 1px;"
						/>
						{#if option.name}
							<p
								class="text-white/60"
								style="border-bottom: 2px solid #2d2f38; width: fit-content;"
							>
								{option.name}
							</p>
						{/if}
						{#each option.options as subOption}
							<!-- svelte-ignore a11y-click-events-have-key-events -- temp -->
							<div
								class="block w-[182px] h-[29px] relative left-0 rounded-[5px] cursor-pointer hover:bg-[#23252e] transition ease-in-out duration-200 mb-2"
								style={subOption.selected ? 'background-color: #36383e;' : ''}
								on:click={() => {
									if (subOption.onClick) {
										subOption.onClick();
									}
								}}
							>
								<p
									class="relative top-[4px] left-[7px] h-[11px] text-sm leading-6 text-left text-white/80"
								>
									{subOption.name}
								</p>
								{#each subOption.badges as badge}
									<div
										class="block w-[34px] h-[17px] relative left-[98px] rounded-[78px] bottom-1"
										style="background-color: {badge.color};"
									>
										<p
											class="relative top-[3px] left-[6px] w-5 h-[7px] text-[10px] leading-[10px] text-white/80"
										>
											{badge.name.toUpperCase()}
										</p>
									</div>
								{/each}
							</div>
						{/each}
					</div>
				{/each}

				<!-- build info -->
				<p class="relative left-2 top-2 text-[10px] leading-6 text-left text-white/60 selectable">
					{buildInfo.channel} ({buildInfo.commit})
				</p>
			</div>
		</div>
	</div>
{/if}
