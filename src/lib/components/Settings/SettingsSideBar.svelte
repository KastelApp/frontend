<script>
	import { ready } from '$lib/stores.js';
	import { initClient } from '$lib/client';

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
							color: '#2A1644'
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
			name: null,
			options: [
				{
					name: 'Log Out',
					badges: [],
                    danger: true
				}
			]
		}
	];
</script>

{#if clientReady}
	<div
		class="w-[358px] bg-white dark:bg-[#101219] shadow-lg unselectable relative"
		style="border-right: 2px solid #2D3748;"
	>
		<div class="w-[208px] relative m-auto px-4 py-[72px]">
			{#each options as option}
				{#if option.name}
					<div class="flex flex-col">
						<div class="text-[#8e9297] text-sm font-semibold px-5 py-2">
							<p
								class="text-[#a2a3a7]"
								style="border-bottom: 2px solid #2d2f38; width: fit-content;"
							>
								{option.name}
							</p>
						</div>

						{#each option.options as subOption}
							<div class="flex flex-col">
								<div
									class="text-[#8e9297] text-sm font-semibold px-4 py-2 cursor-pointer hover:bg-[#23252e] transition ease-in-out duration-200 rounded-lg flex flex-row items-center gap-2"
									style={subOption.selected ? 'background-color: #36383e;' : ''}
								>
									<p>
										{subOption.name}
									</p>
									{#if subOption.badges.length > 0}
										<div class="flex flex-col">
											<div
												class="text-[#8e9297] text-sm font-semibold px-3 py-0 rounded-3xl shadow-lg"
												style="background-color: {subOption.badges[0].color};"
											>
												{subOption.badges[0].name}
											</div>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					{#each option.options as subOption}
						<div class="w-full">
							<div class="text-[#8e9297] text-sm font-semibold px-4 py-2 cursor-pointer {subOption.danger ? "danger" : ""} transition ease-in-out duration-200 rounded-lg flex flex-row items-center 2 w-full">
								<p>
									{subOption.name}
								</p>
								<div class="absolute right-[32px]">
									<svg
										width="13"
										height="13"
										viewBox="0 0 13 13"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M1.44445 13C1.04722 13 0.707057 12.8584 0.423946 12.5753C0.140834 12.2922 -0.000480255 11.9523 1.22618e-06 11.5556V1.44445C1.22618e-06 1.04722 0.141557 0.707057 0.424668 0.423946C0.707779 0.140834 1.0477 -0.000480255 1.44445 1.22618e-06H6.5V1.44445H1.44445V11.5556H6.5V13H1.44445ZM9.38889 10.1111L8.39583 9.06389L10.2375 7.22222H4.33333V5.77778H10.2375L8.39583 3.93611L9.38889 2.88889L13 6.5L9.38889 10.1111Z"
											fill="white"
											fill-opacity="0.6"
										/>
									</svg>
								</div>
							</div>
						</div>
					{/each}
				{/if}
				{#if options.indexOf(option) !== options.length - 1}
					<hr class="border-t w-full my-[4px]" style="border-color: #2D3748; border-width: 1px;" />
				{/if}
			{/each}
		</div>
	</div>
{/if}
