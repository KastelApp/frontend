<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
	import { settingsOpen } from '$lib/stores';
	import MemberSideBar from '$lib/components/MemberSideBar.svelte';
	// export let guildId = $page.params.guildId;
	// export let channelId = $page.params.channelId;

	// console.log($page)
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft">
		{#if !$settingsOpen}
			<ChannelSidebar />
			<MemberSideBar />
		{/if}
	</svelte:fragment>
	<slot />
</AppShell>
