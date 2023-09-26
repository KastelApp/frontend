<script>
	import Modal from '$lib/components/Modals/Modal.svelte';
	import CheckBox from '$lib/components/Modals/Types/CheckBox.svelte';
	import CheckBoxGroup from '$lib/components/Modals/Types/CheckBoxGroup.svelte';
	import TextInput from '$lib/components/Modals/Types/TextInput.svelte';
	import { writable } from 'svelte/store';

	const writeableUsernameError = writable({
		error: false,
		message: ''
	});

	const isOpen = writable(false)

  function closeMenu() {
    $isOpen = false;
  }
</script>

{#if $isOpen}
	<Modal
		title="Change username"
		buttons={[
			{
				text: 'Cancel',
				color: '#2a2e3f'
			},
			{
				text: 'Save',
				color: '#2f0b5e',
				action: 'submit',
				onClick: (modal) => {
					console.log(modal);

					$writeableUsernameError.error = true;
					$writeableUsernameError.message = 'You are NOT cool funny man';
				}
			}
		]}
    on:clickoutside={closeMenu}
		blackout={true}
		let:parentId
	>
		<TextInput
			placeholder="Username Goes Here"
			title="Username"
			error={$writeableUsernameError.error}
			errorMessage={$writeableUsernameError.message}
			maxLength={5}
			minLength={2}
			id="username"
			{parentId}
		/>
		<TextInput
			inputType="email"
			placeholder="email@example.com"
			title="Email"
			error={true}
			errorMessage="Failed to get email"
			{parentId}
			id="email"
		/>
		<TextInput
			inputType="password"
			placeholder="*********************"
			title="Password"
			error={true}
			errorMessage="Password does not match."
			{parentId}
			id="password"
		/>
		<CheckBox
			title="Testing?"
			required={true}
			name="This is testing?"
			enabled={true}
			{parentId}
			id="test"
		/>
		<CheckBoxGroup
			title="What is your favorite animals?"
			required={true}
			options={[
				{
					name: 'Otters',
					enabled: true,
					id: 'otter'
				},
				{
					name: 'Cats',
					enabled: false,
					id: 'cats'
				},
				{
					name: 'Dogs',
					enabled: false,
					id: 'dogs'
				}
			]}
			{parentId}
		/>
	</Modal>
{/if}

<button class="bg-gray-600 rounded-lg w-16 h-8" on:click={() => {
  $isOpen = true
  console.log('OPEN')
}}>
  Hello
</button>