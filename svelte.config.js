import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Using Netlify adapter for deployment
    adapter: adapter({
      fallback: 'index.html',
      pages: 'build',
      assets: 'build',
      precompress: false,
      strict: true
    }),
    alias: {
      $lib: './src/lib'
    },
    prerender: {
      entries: ['/'],
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore all 404s
        if (message.includes('404')) return;
        // Otherwise fail the build
        throw new Error(message);
      }
    }
  }
};

export default config;