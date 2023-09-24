<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
	import { settingsOpen } from '$lib/stores';
	// export let guildId = $page.params.guildId;
	// export let channelId = $page.params.channelId;

	// console.log($page)
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft">
		{#if !$settingsOpen}
			<ChannelSidebar />
		{/if}
	</svelte:fragment>
	<slot />
</AppShell>
