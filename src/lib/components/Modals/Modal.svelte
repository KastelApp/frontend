<script lang="ts">
	import { modals } from '$lib/stores';
	import { createEventDispatcher, onMount } from 'svelte';

	import type { Modal as ModalType } from '$lib/types/index';
	import { writable } from 'svelte/store';

	export let title: string = '';
	export let buttons: {
		text: string;
		color: string;
		onClick: (modal: ModalType) => void;
		action: 'close' | 'none' | 'submit';
	}[] = [];
	// this causes the modal to have a black background (like dim the background so you only really see the modal)
	export let blackout: boolean = true;
	export let titlePosition: 'left' | 'center' = 'left';
	export const parentId = `${
		Math.round(Math.random() * 5000 + Math.random() * Date.now()) + 500000
	}`;
	export let hasX: boolean = true;

	onMount(() => {
		$modals.push({
			id: parentId,
			checkboxeOptions: [],
			textInputOptions: []
		});
	});

	let modal: HTMLDivElement;

	const dispatch = createEventDispatcher();

	const firstClick = writable(0);

	function onPageClick(e: any) {
		if ($firstClick < 1) {
			$firstClick++;

			return;
		}
		if (e.target === modal || modal.contains(e.target)) return;
		dispatch('clickoutside', {
			id: parentId
		});
	}
</script>

<svelte:body on:click={onPageClick} />

{#if blackout}
	<div class="absolute inset-0 bg-black/50 z-[100]" />
{/if}

<div class="absolute" style="left: 35%; top: 15%">
	<div
		class="box-border block w-[500px] absolute rounded-[5px] bg-[#1b1723] z-[110] h-auto justify-center"
		bind:this={modal}
	>
		<p
			class="relative top-[18px] left-[18px] font-sans text-lg leading-6 text-white/60"
			style={titlePosition === 'center' ? 'text-align: center;' : 'text-align: left;'}
		>
			{title ?? 'Unknown'}
		</p>
		<!-- the x, top right corner with a rounded border -->
		<p class="absolute top-4 right-4">
			{#if hasX}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 cursor-pointer"
					fill="none"
					viewBox="0 0 24 24"
					stroke="white"
					on:click={() => {
						$modals = $modals.filter((x) => x.id !== parentId);

						dispatch('closed');
					}}
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{/if}
		</p>
		<slot {parentId} />
		<div class="flex justify-end gap-4 relative top-14 right-8">
			{#each buttons as button}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="box-border block w-[93px] h-8 relative overflow-hidden rounded-[5px] cursor-pointer unselectable"
					style={button.color ? `background-color: ${button.color};` : ''}
					on:click={() => {
						switch (button.action) {
							case 'submit': {
								button.onClick && button?.onClick($modals.find((modal) => modal.id === parentId));

								break;
							}

							case 'close': {
								button.onClick && button.onClick($modals.find((modal) => modal.id === parentId)); // in case for some reason you want to do something on close

								$modals = $modals.filter((x) => x.id !== parentId);

								dispatch('closed');
							}

							case 'none': {
								button.onClick && button.onClick($modals.find((modal) => modal.id === parentId));

								break;
							}
						}
					}}
				>
					<p
						class="whitespace-pre-wrap relative top-1 font-sans text-lg leading-6 text-center text-white"
					>
						{button.text}
					</p>
				</div>
			{/each}
		</div>
		<div class="h-16" />
	</div>
</div>
