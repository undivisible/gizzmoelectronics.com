import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [sveltekit(), nodePolyfills({
		// To exclude specific polyfills, add them to this list
		// We exclude fs and path as they should only be used in server-side code
		exclude: ['fs', 'path'],
		// Whether to polyfill specific nodejs globals
		globals: {
			process: true,
			Buffer: true,
			global: true
		},
		// Whether to polyfill nodejs builtins
	})],
	server: {
		fs: {
			allow: ['static']
		}
	},
	build: {
		commonjsOptions: {
			transformMixedEsModules: true
		},
		// Improve compatibility with Netlify
		target: 'esnext',
		ssrEmitAssets: true
	},
	resolve: {
		// We no longer need these aliases since we've properly isolated server-only code
		// and excluded fs and path from polyfills
		alias: {}
	},
	// Optimize for Netlify deployment
	ssr: {
		// Prevent Node.js built-ins from being bundled in client-side code
		noExternal: ['@icons-pack/svelte-simple-icons', 'lucide-svelte']
	}
});
