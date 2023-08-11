<script>
	import { fade } from 'svelte/transition';
	import { ready } from '$lib/stores.js';
	import { t } from '$lib/translations';
	import { goto } from '$app/navigation';
	let clientReady = false;
	ready.subscribe((value) => {
		clientReady = value;
		if (value) {
			goto('/app');
		}
	});
</script>

<div
	class="fixed inset-0 flex items-center justify-center w-full h-full splash"
	out:fade={{ duration: 200 }}
>
	<form class="flex flex-col items-center">
		<img src="/logo.png" alt="Logo" />

		<input class="input text-center" type="text" placeholder={$t('common.token')} />
		<button
			type="button"
			class="btn variant-filled-success w-full mt-5"
			on:click={(e) => {
				console.log('submit');
				//set token cookie
				if (typeof document !== undefined)
					document.cookie = `token=${
						document.querySelector('input').value
					};path=/;max-age=31536000;`;
				else console.log('document is undefined');
				//TODO: fix this
				// goto('/app');
				location = '/app';
			}}
		>
			{$t('common.signIn')}</button
		>
	</form>
</div>

<style>
	.splash {
		background-image: url('/splash.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		background-color: #161922;
	}
</style>
