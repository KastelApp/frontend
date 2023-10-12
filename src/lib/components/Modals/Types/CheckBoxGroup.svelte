<script lang="ts">
	import { browser } from '$app/environment';
	import { modals } from '$lib/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let options: {
		name: string;
		enabled: boolean;
		canBeTogged: boolean;
		id: string;
	}[] = [];

	export let title: string = '';
	export let required: boolean = false;
    export let parentId = "";

	const writeableOption = writable(options);

    onMount(async () => {
        if (!browser) return;
		
        await new Promise((resolve) => setTimeout(resolve, 100))

        const foundModal = $modals.find((modal) => modal.id === parentId);

        if (!foundModal) {
            console.warn('No Modal found :(');

            return;
        }

        for (const option of $writeableOption) {
            foundModal.checkboxeOptions.push({
                enabled: option.enabled,
                id: option.id
            })
        }
	});

    writeableOption.subscribe(async (value) => {
        if (!browser) return;

        const foundModal = $modals.find((modal) => modal.id === parentId);
        
        if (!foundModal) return;

        for (const val of value) {
            const foundCheckbox = foundModal.checkboxeOptions.find((checkbox) => checkbox.id === val.id);

            if (!foundCheckbox) return;

            foundCheckbox.enabled = val.enabled;
        }
    });
</script>

<div class="mb-8">
	<div>
		<div class="flex justify-between">
			<div class="flex left-12 relative top-12">
				<p
					class="block relative font-sans leading-6 text-left"
					style="font-size: 14px; line-height: 24px"
				>
					{title ?? 'Unknown'}
				</p>
				{#if required}
					<p
						class="block relative font-sans text-sm leading-6 text-left text-[#cb2424] left-2"
						style="font-size: 12px; line-height: 20px; top: 2px;"
					>
						*
					</p>
				{/if}
			</div>
		</div>
		<div class="top-16 relative gap-[44px] unselectable checkboxItems">
			{#each $writeableOption as option}
				<!-- svelte-ignore a11y-click-events-have-key-events -- nt rn -->
				<div
					class="flex relative left-12 cursor-pointer box checkboxItem"
					on:click={() => {
						const foundIndex = $writeableOption.findIndex((x) => x.id === option.id);
						if (foundIndex == -1) {
							console.warn('whar?');
						} else {
							$writeableOption[foundIndex].enabled = !$writeableOption[foundIndex].enabled;
						}
					}}
				>
					{#if option.enabled}
						<svg
							class="relative"
							width={30}
							height={29}
							viewBox="0 0 30 29"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M26.0416 0H3.95831C1.7753 0 0 1.71614 0 3.82639V25.1736C0 27.2858 1.7753 29 3.95831 29H26.0416C28.2265 29 30 27.2858 30 25.1736V3.82639C30.0093 1.75294 28.1995 0 26.0416 0ZM5.08234 13.5415L10.9745 19.1135L24.9426 5.8772L27.4999 8.47719L10.9745 24.1666L2.5 16.1075L5.08234 13.5415Z"
								fill="#208640"
							/>
							<path
								d="M10.9745 19.1135L5.08234 13.5415L2.5 16.1075L10.9745 24.1666L27.4999 8.47719L24.9426 5.8772L10.9745 19.1135Z"
								fill="white"
							/>
						</svg>{:else if !option.enabled}
						<svg
							class="relative"
							width={30}
							height={29}
							viewBox="0 0 30 29"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M3.95833 0H26.0416C28.1995 0 30.0095 1.75294 30 3.82639V25.1736C30 27.2858 28.2266 29 26.0416 29H3.95833C1.77531 29 0 27.2858 0 25.1736V3.82639C0 1.71614 1.77531 0 3.95833 0ZM26.6666 3.22222V25.7778H3.33331V3.22222H26.6666Z"
								fill="#AFAFAF"
							/>
						</svg>
					{/if}
					<p
						class="whitespace-pre-wrap relative font-sans text-sm leading-6 text-center text-white/80 left-4 top-1"
					>
						{option.name}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>