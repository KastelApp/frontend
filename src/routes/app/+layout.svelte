<script>
	import Splash from '$lib/components/Splash.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft"><Sidebar /></svelte:fragment>
	<Splash />
	<slot />
</AppShell>
