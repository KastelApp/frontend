<script>
	import { t } from '$lib/translations';
</script>

<div class="fixed p-2 flex items-center justify-between w-full bg-black text-white rounded-lg z-50">
	<a href="/">
		<img src="/logo.png" alt="Logo" class="w-20" />
	</a>
	<div class="flex items-center justify-between gap-3 text-xl">
		<a href="https://github.com/kastelapp" class=""> GitHub </a>
		<a href="/tos">TOS</a>
		<a href="/docs">Docs</a>
	</div>
	<a href="/login" class="bg-white text-black p-2 pl-6 pr-6 rounded-full hover:bg-gray-200">
		{$t('common.signIn')}
	</a>
</div>
