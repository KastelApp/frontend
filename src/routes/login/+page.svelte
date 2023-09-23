<script>
	import { browser } from '$app/environment';
	import { initClient } from '$lib/client';
	/**
	 * @type {import('@kastelll/wrapper').Client}
	 */
	let client;
	import { fade } from 'svelte/transition';
	import { ready, token } from '$lib/stores.js';
	import { t } from '$lib/translations';
	import { goto } from '$app/navigation';

	ready.subscribe((value) => {
		if ($token) {
			if (browser) {
				goto('/app');
			}
		} else {
			client = initClient();
		}
	});

	let error = {
		message: 'Invalid email or password',
		shown: false
	};
</script>

<div
	class="fixed inset-0 flex items-center justify-center w-full h-full splash"
	out:fade={{ duration: 200 }}
>
	<form class="flex flex-col items-center">
		<img src="/logo.png" alt="Logo" />

		{#if error.shown}
			<div class="bg-red-500 text-white p-2 rounded-lg">
				{error.message}
			</div>
			<br />
		{/if}
		<input class="input text-center" type="email" placeholder={$t('common.email')} />
		<br />
		<input class="input text-center" type="password" placeholder={$t('common.password')} />
		<button
			type="button"
			class="btn variant-filled-success w-full mt-5"
			on:click={async (e) => {
				const email = e.target.form[0].value;
				const password = e.target.form[1].value;

				if (!client.EmailRegex.test(email)) {
					error = {
						message: 'Invalid email',
						shown: true
					};

					return;
				} else if (!client.PasswordRegex.test(password)) {
					error = {
						message: 'Invalid password',
						shown: true
					};

					return;
				} else {
					error = {
						message: 'N/A',
						shown: false
					};
				}

				const data = await client.loginAccount({ email, password, resetClient: false });

				if (data.success) {
					const dataToken = data.token;

					token.set(dataToken);
				}

				for (const [key, value] of Object.entries(data.errors)) {
					if (value) {
						error.message = `${error.message === 'N/A' ? '' : error.message}\n${key} is invalid`;
					}
				}

				if (error.message !== 'N/A') {
					error.shown = true;
					return;
				} else {
					error.message = 'Unknown error, please try again later';
					error.shown = true;
				}
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
