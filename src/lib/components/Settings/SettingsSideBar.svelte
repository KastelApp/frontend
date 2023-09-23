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
					badges: []
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
            name: "General Settings",
            options: [
                {
                    name: "Appearance",
                    badges: []
                },
                {
                    name: "Accessibility",
                    badges: []
                },
                {
                    name: "Text & Language",
                    badges: []
                }
            ]
        },
        {
            name: null,
            options: [
                {
                    name: "Log Out",
                    badges: []
                }
            ]
        }
	];
</script>

{#if clientReady}
	<div
		class="w-[358px] flex flex-col bg-white dark:bg-[#101219] shadow-lg unselectable"
		style="border-right: 2px solid #2D3748;"
	/>
{/if}
