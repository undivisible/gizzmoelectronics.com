import adapterNetlify from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Using Netlify adapter for deployment
    adapter: adapterNetlify({
      // if true, will create a Netlify Edge Function rather than using standard Node-based functions
      edge: false,
      
      // if true, will split your app into multiple functions
      // instead of creating a single one for the entire app.
      split: false
    })
  }
};

export default config;