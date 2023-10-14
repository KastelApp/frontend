<script lang="ts">
	import { browser } from '$app/environment';
	import { modals } from '$lib/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// example: Amazing Username
	export let placeholder = '';
	// hard placeholder is the default value
	export let hardPlaceholder = '';
	export let maxLength = 1024;
	export let minLength = 2;
	export let validationRegex: RegExp | null = null;
	// example: Username
	export let title = '';
	// example: 4-32 characters (this is on the right side)
	export let subText = '';
	export let errorMessage = '';
	export let error = false;
	export let parentId = '';
	export let id = '';

	const inputValue = writable(hardPlaceholder ?? '');

	onMount(async () => {
		if (!browser) return;

		await new Promise((resolve) => setTimeout(resolve, 100));

		const foundModal = $modals.find((modal) => modal.id === parentId);

		if (!foundModal) return;

		const foundtextWihSameId = foundModal.textInputOptions.find((text) => text.id === id);

		if (foundtextWihSameId) {
			console.warn(
				"[PANIC] Found text with same id, this should not happen, returning so we don't fill the same text twice"
			);

			return;
		}

		foundModal.textInputOptions.push({
			id,
			value: $inputValue
		});
	});

	inputValue.subscribe((value) => {
		if (!browser) return;

		const foundModal = $modals.find((modal) => modal.id === parentId);

		if (!foundModal) return;

		const foundValue = foundModal.textInputOptions.find((text) => text.id === id);

		if (!foundValue) return;

		foundValue.value = value;
	});
</script>

<div class="mb-16 h-16">
	<div>
		<textarea
			class="box-border block w-[400px] h-[86px] relative top-[75px] left-[46px] overflow-hidden font-sans text-sm leading-6 text-left text-white/80 bg-[#202432] rounded-[10px] border-none focus:ring-transparent resize-none"
			placeholder={placeholder ?? 'Input'}
			style={error ? 'border-width: 1px; border-color: #cb2424;' : ''}
			maxlength={maxLength}
			minlength={minLength}
			on:input={(value) => {
				// @ts-expect-error -- Too lazy to fix this;
				$inputValue = value.target.value;

				const [max, min, regex] = [
                    // @ts-expect-error -- Too lazy to fix this;
					value.target.value.length > maxLength,
                    // @ts-expect-error -- Too lazy to fix this;
					value.target.value.length < minLength,
                    // @ts-expect-error -- Too lazy to fix this;
					validationRegex && !new RegExp(validationRegex).test(value.target.value)
				];

				if (max || min || regex) {
					error = true;

					if (max) {
						errorMessage = 'Your Input is too long';
					} else if (min) {
						errorMessage = 'Your Input is too short';
					} else if (regex) {
						errorMessage = 'Invalid Input';
					} else {
						errorMessage = 'Unknown Issue, try again?';
					}
				} else {
					error = false;
				}
			}}
		/>

		<div class="flex justify-between">
			<div class="flex left-12 relative bottom-10">
				<p
					class="block relative font-sans leading-6 text-left"
					style="{error ? 'color: #cb2424;' : ''}; font-size: 14px; line-height: 24px"
				>
					{title ?? 'Unknown'}
				</p>
				{#if error}
					<p
						class="block relative font-sans text-sm leading-6 text-left text-[#cb2424] left-2"
						style="font-size: 12px; line-height: 20px; top: 2px;"
					>
						- {errorMessage ?? 'Unknown error'}
					</p>
				{/if}
				{#if subText}
					<p
						class="block relative font-sans leading-6 text-left text-white/50"
						style="font-size: 12px; line-height: 20px; top: 2px;"
					>
						{subText ?? 'Unknown'}
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
