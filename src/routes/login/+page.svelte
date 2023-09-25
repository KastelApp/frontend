<script>
	import {browser} from '$app/environment';
	import {initClient} from '$lib/client';
	import {fade} from 'svelte/transition';
	import {ready, token} from '$lib/stores.js';
	import {t} from '$lib/translations';
	import {goto} from '$app/navigation';

	/**
     * @type {import('@kastelll/wrapper').Client}
     */
    let client;

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
        <img alt="Logo" src="/logo.png"/>

        {#if error.shown}
            <div class="mb-2 bg-red-500 text-white p-2 rounded-lg">
                {error.message}
            </div>
            <br/>
        {/if}
        <input class="mb-4 input text-center" placeholder={$t('common.email')} type="email"/>
		<br/><br/>
        <input class="input text-center" placeholder={$t('common.password')} type="password"/>
        <button
                class="btn variant-filled-secondary w-full mt-5"
                on:click={async (e) => {
				const email = e.target.form[0].value;
				const password = e.target.form[1].value;

				if (!email || !password) {
					error = {
						message: 'Please fill in all fields',
						shown: true
					};

					return;
				} else

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

				const data = await client.loginAccount({ email, password, resetClient: true });

				if (data.success) {
					token.set(data.token);

					client.connect();

					goto('/app');

					return;
				}

				for (const [key, value] of Object.entries(data.errors)) {
					if (value) {
						error.message = `${error.message === 'N/A' ? '' : error.message}\n${key} is invalid`;
					}
				}

				if (error.message !== 'N/A') {
					error.shown = true;

				} else {
					error.message = 'Unknown error, please try again later';
					error.shown = true;
				}
			}}
                type="button"
        >
            {$t('common.signIn')}
		</button>

		<button
				class="btn variant-filled-tertiary w-full mt-5"
				on:click={async () => {
					goto('/new-account')
				}}>
			{$t('common.createAcc')}
		</button>

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
