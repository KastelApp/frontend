<script>
	import Splash from '$lib/components/Splash.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { settingsOpen } from '$lib/stores';
	import Settings from '$lib/components/Settings/Settings.svelte';
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft">
		{#if $settingsOpen}
			<Settings />
		{:else}
			<Sidebar />
		{/if}
	</svelte:fragment>
	<Splash />
	<slot />
</AppShell>
