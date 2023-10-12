import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { getCurrentHash, getCurrentBranch } from './gitCommit';


export default defineConfig(async () => {
	const hash = await getCurrentHash();
	const branch = await getCurrentBranch();

	return {
		plugins: [sveltekit()],
		define: {
			__GIT_COMMIT__: JSON.stringify(hash),
			__BUILD_CHANNEL__: JSON.stringify(branch === 'stable' ? 'Stable' : branch === 'development' ? 'Canary' : 'Development')
		}
	};
});
