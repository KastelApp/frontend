<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
	// export let guildId = $page.params.guildId;
	// export let channelId = $page.params.channelId;

	// console.log($page)
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft"><ChannelSidebar /></svelte:fragment>
	<slot />
</AppShell>
