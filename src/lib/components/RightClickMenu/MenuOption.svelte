<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';

	export let isDisabled = false;
	export let text = '';
	export let error = false;
	export let mouseOnHover = false;

	const dispatch = createEventDispatcher();

	const handleClick = (e) => {
		e.preventDefault();

		if (isDisabled) return;

		dispatch('click', {
			x: e.clientX,
			y: e.clientY
		});
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -- not needed-->
<div
	class={`p-1.5 ${mouseOnHover ? 'cursor-pointer' : 'cursor-default'} text-sm flex items-center gap-1 hover:bg-[#192339] unselectable ${error ? 'text-red-500' : 'text-white'} ${isDisabled ? 'opacity-50' : ''}`}
	on:click={handleClick}
>
		{#if text}
			{text}
		{:else}
			<slot />
		{/if}
</div>
