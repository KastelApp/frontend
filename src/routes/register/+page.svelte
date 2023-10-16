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

    // eslint-disable-next-line no-unused-vars
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

    // eslint-disable-next-line no-unused-vars
    function onSubmit(e) {
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const confirmPassword = e.target[3].value;
        const terms = e.target[4].checked;

        if (password !== confirmPassword) {
            error = {
                message: 'Passwords do not match',
                shown: true
            };
            return;
        }

        if (!terms) {
            error = {
                message: 'You must accept the terms and conditions',
                shown: true
            };
            return;
        }

        client.registerAccount({email, password, username, resetClient: true}).then((data) => {
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
        });

    }
</script>

<div class="inset-0 flex items-center justify-center w-full splash">
    <br/>
    <section out:fade={{ duration: 200 }}>
        <div class="mt-5 mb-5 flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <p class="mb-5 font-sans text-6xl font-bold text-left text-white/[0.92]">
                Register for Kastel!
            </p>
            <div class="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-[#2d3748]">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    {#if error.shown}
                        <div class="bg-red-500 text-white p-2 rounded-lg">
                            {error.message}
                        </div>
                    {/if}
                    <form class="space-y-4 md:space-y-6" on:submit|preventDefault={onSubmit}>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                   for="username">{$t('common.username')}</label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   id="username" name="username"
                                   required
                                   type="text">
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                   for="email">{$t('common.email')}</label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   id="email" name="email"
                                   required
                                   type="email">
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                   for="password">{$t('common.password')}</label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   id="password" name="password" placeholder="••••••••"
                                   required
                                   type="password">
                        </div>
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                   for="confirm-password">{$t('common.confirmPass')}</label>
                            <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   id="confirm-password" name="confirm-password" placeholder="••••••••"
                                   required
                                   type="password">
                        </div>
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input aria-describedby="terms"
                                       class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                       id="terms"
                                       required
                                       type="checkbox">
                            </div>
                            <div class="ml-3 text-sm">
                                <label class="font-light text-gray-500 dark:text-gray-300" for="terms">I accept the <a
                                        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                        href="/terms">Terms and Conditions</a></label>
                            </div>
                        </div>
                        <button class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                type="submit">
                            Create an account
                        </button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <a
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                href="/login">Login
                            here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
    <br/><br/>
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