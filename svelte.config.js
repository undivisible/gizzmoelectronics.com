import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib'
		},
		prerender: {
			handleHttpError: ({ message }) => {
				if (message.includes('404')) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
