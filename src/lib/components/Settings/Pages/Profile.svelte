<!-- NOTE: Be careful formatting this file, the text below ("Please note that deleting your account" etc) gets messed up -->
<script>
	import { ready, settingsOpen } from '$lib/stores.js';
	import { initClient } from '$lib/client';
	import { each, onDestroy, onMount } from 'svelte/internal';
	import { browser } from '$app/environment';

	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	let clientReady = false;
	let flags;

	const options = [
		{
			name: 'Global Nickname',
			value: 'Username'
		},
		{
			name: 'Username',
			value: 'ghost#0000'
		},
		{
			name: 'Email',
			value: 'email@example.com'
		},
		{
			name: 'Phone Number',
			value: '+1 123-456-7890'
		}
	];

	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			client = initClient();

			flags = client.user.flags.toArray();

			options[0].value = client.user.globalNickname || client.user.username;
			options[1].value = client.user.tag;
			options[2].value = client.user.email;
			options[3].value = client.user.phone || 'None';
		}
	});

	let hovering = false;
	let mounted = false;

	function handleMouseMove(event) {
		if (!browser) return;

		let found = document.getElementById('user-avatar');

		const x = event.clientX;
		const y = event.clientY;

		if (found) {
			const rect = found.getBoundingClientRect();
			const left = rect.left;
			const top = rect.top;
			const right = rect.right;
			const bottom = rect.bottom;

			if (x > left && x < right && y > top && y < bottom) {
				hovering = true;
			} else {
				hovering = false;
			}
		}
	}

	onMount(() => {
		console.log('mounted', mounted);

		if (mounted) return;

		document.removeEventListener('mousemove', handleMouseMove);
		document.addEventListener('mousemove', handleMouseMove);

		mounted = true;
	});
</script>

{#if clientReady}
	<svg
		class="block w-10 h-10 relative top-20 left-[1349px] hover:cursor-pointer hover:opacity-60 transform ease-in-out duration-200"
		width={40}
		height={40}
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		on:mousedown={(event) => {
			if (event.button === 0) {
				settingsOpen.set(false);
			}
		}}
	>
		<path
			d="M27.5038 26.6344C27.5756 26.7088 27.6326 26.797 27.6714 26.8941C27.7103 26.9912 27.7303 27.0953 27.7303 27.2004C27.7303 27.3056 27.7103 27.4096 27.6714 27.5068C27.6326 27.6039 27.5756 27.6921 27.5038 27.7664C27.432 27.8408 27.3467 27.8997 27.2529 27.94C27.1591 27.9802 27.0585 28.0009 26.9569 28.0009C26.8554 28.0009 26.7548 27.9802 26.661 27.94C26.5671 27.8997 26.4819 27.8408 26.4101 27.7664L20.0004 21.1314L13.5907 27.7664C13.4457 27.9166 13.249 28.0009 13.0439 28.0009C12.8388 28.0009 12.6421 27.9166 12.497 27.7664C12.352 27.6163 12.2705 27.4127 12.2705 27.2004C12.2705 26.9882 12.352 26.7846 12.497 26.6344L18.9077 20.0004L12.497 13.3664C12.352 13.2163 12.2705 13.0127 12.2705 12.8004C12.2705 12.5882 12.352 12.3846 12.497 12.2344C12.6421 12.0843 12.8388 12 13.0439 12C13.249 12 13.4457 12.0843 13.5907 12.2344L20.0004 18.8694L26.4101 12.2344C26.5551 12.0843 26.7518 12 26.9569 12C27.162 12 27.3588 12.0843 27.5038 12.2344C27.6488 12.3846 27.7303 12.5882 27.7303 12.8004C27.7303 13.0127 27.6488 13.2163 27.5038 13.3664L21.0932 20.0004L27.5038 26.6344Z"
			fill="white"
			fillOpacity={0.6}
		/>
		<rect
			x={1.5}
			y={1.5}
			width={37}
			height={37}
			rx={18.5}
			stroke="white"
			strokeOpacity={0.2}
			strokeWidth={3}
		/>
	</svg>
	<!-- outter box -->
	<div
		class="box-border block relative rounded-[40px] bg-[#171923] w-[986px] h-[687px] left-[200px] top-[96px]"
	>
		<!-- inner box -->
		<div
			class="box-border block relative rounded-[40px] bg-[#202432] w-[758px] h-[505px] left-[114px] top-[91px]"
		>
			<!-- This is where the Main PFP is, Global Nickname, Username#discrim & badges are (I've not done the badges part yet :3) -->
			<div
				class="box-border block relative border-t-0 border-r-0 border-b border-l-0 border-white/[0.15] w-[531px] h-[103px] top-[18px] left-[25px]"
			>
				<div
					class="flex flex-col items-center justify-center rounded-full bg-red-400 hover:bg-red-500 cursor-pointer m-2 relative w-[80px] unselectable"
					id="user-avatar"
				>
					<img src={client.user.avatar ?? `/logo.png`} alt="Logo" />
					<div class="bg-green-600 rounded-full w-5 h-5 absolute bottom-0 right-0 z-10" />
					{#if hovering}
						<div
							class="absolute bg-black/[0.50] w-full h-full rounded-full text-[#DEDEDE] text-center"
						>
							<div class="m-[14px]" />
							Change Avatar
						</div>
					{/if}
				</div>
				<p class="relative text-2xl leading-6 text-left text-white top-[-60px] left-[100px]">
					{client.user.globalNickname ?? client.user.username}
				</p>
				<p
					class="whitespace-pre-wrap relative text-base leading-6 text-left text-white/[0.75] top-[-50px] left-[100px]"
				>
					{client.user.tag}
				</p>
			</div>
			<div class="block relative left-[13px]">
				{#each options as option}
					<div class="block top-[50px] left-[11px] relative mb-6">
						<p
							class="text-white/60"
							style="border-bottom: 2px solid rgb(255 255 255 / 0.15); width: fit-content;"
						>
							{option.name}
						</p>
						<div class="block h-[29px] relative left-0 rounded-[5px] mb-2">
							<p class="relative top-[4px] h-[11px] text-sm leading-6 text-left text-white/80">
								{option.value}
							</p>
							<div
								class="box-border block w-[65px] h-6 rounded-[3px] bg-white/30 relative left-[480px] top-[-5px] cursor-pointer hover:bg-white/[0.15] transform transition-all duration-200"
							>
								<p
									class="whitespace-pre-wrap relative top-[3px] left-4 w-[34px] h-[19px] text-[13px] leading-4 text-center text-white"
								>
									Edit
								</p>
							</div>
						</div>
					</div>
				{/each}
				<div
					class="relative top-[400px] right-16 text-lg leading-6 text-left text-white/60 w-[900px]"
				>
					<p
						class="text-white/60 h2"
						style="border-bottom: 2px solid rgb(255 255 255 / 0.15); width: fit-content;"
					>
						Account Info & Security
					</p>
					<p
						class="text-white/60 h3 my-8"
						style="border-bottom: 2px solid rgb(255 255 255 / 0.15); width: fit-content;"
					>
						Account Status
					</p>
					<div>
						<p style="display: list-item; margin-left : 1em;">
							Disable Account: Temporarily locks your account. Contact support to unlock.
						</p>
						<p style="display: list-item; margin-left : 1em;">
							Delete Account: Removes all personal identifiers. You can choose to 'remove' all
							messages.
						</p>
					</div>
					<br />
					<br />
					<p class="whitespace-pre-wrap w-full">
						Please note that deleting your account may take 14-30 days to complete. If you opted to'remove' all messages<br />the process will begin during this period. Once finished, here's how your messages will be displayed:
					</p>
					<div
						class="box-border block relative rounded-[15px] bg-[#171923] w-[885px] h-[273px] top-[34px]"
					>
						<div>
							<p
								class="whitespace-pre-wrap relative top-5 left-[22px] text-lg leading-[22px] text-left text-white/80"
							>
								Before:
							</p>
							<div
								class="box-border block relative rounded-[15px] bg-[#202432] top-10 h-[59px] w-[764px] left-[15px]"
							>
								<p
									class="whitespace-pre-wrap relative top-1.5 left-[69px] text-sm leading-[22px] text-left text-[#f2f3f5]"
								>
									{client.user.username}
								</p>
								<img
									class="box-border flex flex-col justify-start items-start w-10 h-10 relative top-[-12px] left-[15px] rounded-full"
                                    src="{client.user.avatar ?? `/logo.png`}"
                                    alt="Avatar"
								/>
								<p
									class="whitespace-pre-wrap relative top-[-32px] left-[69px] text-base leading-[22px] text-left text-[#dbdee1]"
								>
									This is a very awesome message right here!
								</p>
								<p
									class="whitespace-pre-wrap relative top-[-74px] left-[135px] h-[15.56px] text-[10px] leading-[22px] text-left text-white/40"
								>
									Today at {new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
								</p>
							</div>
						</div>
						<div>
							<p
								class="whitespace-pre-wrap relative top-[40px] my-5 left-[22px] text-lg leading-[22px] text-left text-white/80"
							>
								After:
							</p>
                            <div
								class="box-border block relative rounded-[15px] bg-[#202432] top-10 h-[59px] w-[764px] left-[15px]"
							>
								<p
									class="whitespace-pre-wrap relative top-1.5 left-[69px] text-sm leading-[22px] text-left text-[#f2f3f5]"
								>
									Ghost User
								</p>
								<img
									class="box-border flex flex-col justify-start items-start w-10 h-10 relative top-[-12px] left-[15px] rounded-full"
                                    src="/logo.png"
                                    alt="Avatar"
								/>
								<p
									class="whitespace-pre-wrap relative top-[-32px] left-[69px] text-base leading-[22px] text-left text-[#dbdee1]"
								>
									[Removed By Account Deletion]
								</p>
								<p
									class="whitespace-pre-wrap relative top-[-74px] left-[145px] h-[15.56px] text-[10px] leading-[22px] text-left text-white/40"
								>
									Today at {new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
