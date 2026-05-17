<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import '../app.css';
  import { page } from '$app/stores';
  import { sidebarOpen, handleScroll } from '$lib/stores/ui';

  $: isB1 = $page.url.pathname.startsWith('/b1');

  onMount(() => {
    const onScroll = () => handleScroll(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<svelte:head>
    <link rel="icon" type="image/x-icon" href="https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png">
</svelte:head>
  
<div class="app bg-black text-white min-h-screen flex" data-sidebar={$sidebarOpen}>
  <aside class="hidden md:flex flex-col justify-between w-60 shrink-0 p-6 sticky top-0 h-screen z-[260]">
    <div class="mb-6">
      <Header />
    </div>
    <nav class="flex flex-col gap-1 text-[11px] leading-relaxed" aria-label="Quick links">
      <a href="/b1"
         class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
         class:opacity-100={$page.url.pathname.startsWith('/b1')}>B1 Controller</a>
      <a href="/support"
         class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
         class:opacity-100={$page.url.pathname === '/support'}>Contact</a>
      <a href="/"
         class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
         class:opacity-100={$page.url.pathname === '/'}>Downloads</a>
    </nav>
  </aside>

  <div class="flex-1 flex flex-col min-h-screen min-w-0">
    <main class:is-b1={isB1}>
      <slot />
    </main>
  </div>
</div>
  
<style>
.app { position:relative; width:100%; overflow:hidden; }
main { position:relative; z-index:10; flex:1; padding:4rem 2rem; max-width:1200px; margin:0 auto; width:100%; scroll-behavior:smooth; background:black; }
main.is-b1 { max-width:none; padding:0; margin:0; }

:global(body){ background:#000; }
</style>
