import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
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
		ssrEmitAssets: true,
		// Ensure Node.js modules are not bundled for client
		rollupOptions: {
			external: ['fs', 'path', 'crypto', 'stream', 'util', 'os']
		}
	},
	resolve: {
		alias: {}
	},
	// Configure SSR for Netlify deployment
	ssr: {
		// Externalize Node.js built-ins for server-side rendering
		external: ['fs', 'path', 'crypto', 'stream', 'util', 'os'],
		// Don't externalize these packages - they should be bundled
		noExternal: ['@icons-pack/svelte-simple-icons', 'lucide-svelte']
	},
	// Define which modules should be treated as external in different contexts
	define: {
		// Ensure process.env is available in server context
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
	}
});
