<!-- Could you just use CheckBoxGroup with a single option? Yes but also no -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { modals } from '$lib/stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let title: string = '';
	export let str: string = '';
	export let img: boolean = false;

	/**
	 * Ignore this, its private
	 * @private
	 */
	export let parentId = '';

	const dispatch = createEventDispatcher();
</script>

<div class="mb-8">
	<div class="">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="box-border block w-[428px] h-[70px] relative left-9 overflow-hidden rounded-[10px] bg-[#202432] top-12 cursor-pointer unselectable"
			on:click={() =>
				dispatch('click', {
					id: parentId,
					title
				})
			}
		>
			<p class="relative left-[87px] font-sans text-lg leading-6 text-left text-white/80 top-6">
				{title}
			</p>
			<div class="relative left-[391px] top-1">
				<slot />
			</div>
			{#if img}
				<img src={str} alt="Big Button Png" class="w-[50px] h-[50px] relative bottom-7 left-4" />
			{:else if str}
				<p
					class="text-white/80 h1 rounded-full w-[50px] h-[50px] relative bottom-8 left-6 border-b-green-400"
				>
					{str}
				</p>
			{/if}
		</div>
	</div>
</div>
