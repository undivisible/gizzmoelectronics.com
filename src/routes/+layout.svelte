<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import '../app.css';
  import { page } from '$app/stores';
  import { sidebarOpen, handleScroll } from '$lib/stores/ui';

  // Route detection
  $: isB1 = $page.url.pathname.startsWith('/b1');

  // Left-edge reveal logic (B1 only)
  let revealChrome = false;
  let hideTimer: any;
  function showChrome(){
    if(!isB1) return;
    clearTimeout(hideTimer);
    revealChrome = true;
  }
  function scheduleHide(){
    if(!isB1) return;
    hideTimer = setTimeout(() => (revealChrome = false), 320);
  }

  // Observe scroll for potential future hero / footer toggles
  onMount(() => {
    const onScroll = () => handleScroll(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<svelte:head>
    <link rel="icon" type="image/x-icon" href="https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png">
</svelte:head>
  
<div class="app bg-black text-white min-h-screen flex" data-sidebar={$sidebarOpen} data-reveal={revealChrome}>
  {#if !isB1}
    <!-- Persistent sidebar for non-B1 pages -->
    <aside class="hidden md:flex flex-col justify-between w-60 shrink-0 p-6 sticky top-0 h-screen">
      <div class="mb-6">
        <Header />
      </div>
        <nav class="flex flex-col gap-1 text-[11px] leading-relaxed" aria-label="Quick links">
          <a href="/support"
             class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
             class:opacity-100={$page.url.pathname === '/support'}>Contact</a>

          <a href="/"
             class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
             class:opacity-100={$page.url.pathname === '/'}>Downloads</a>
        </nav>
    </aside>
  {/if}

  {#if isB1}
    <!-- Hotspot to trigger reveal -->
  <div class="b1-edge-hotspot" role="presentation" on:mouseenter={showChrome} on:mousemove={showChrome} on:mouseleave={scheduleHide}></div>
    <!-- Floating reveal group (no solid panel background) -->
    <div class="b1-reveal-group" class:visible={revealChrome} on:mouseleave={scheduleHide} on:mouseenter={showChrome} aria-hidden={!revealChrome}>
        <Header />
        <nav class="mt-auto flex flex-col gap-1 text-[11px] leading-relaxed" aria-label="Quick links">
          <a href="/support"
             class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
             class:opacity-100={$page.url.pathname === '/support'}>Contact</a>

          <a href="/"
             class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
             class:opacity-100={$page.url.pathname === '/'}>Downloads</a>

          <a href="/b1"
             class="rl opacity-70 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10 hover:opacity-100"
             class:opacity-100={$page.url.pathname.startsWith('/b1')}>B1 Controller</a>
        </nav>
    </div>
  {/if}

  <div class="flex-1 flex flex-col min-h-screen">
    <main class:is-b1={isB1} class:shift-panel={revealChrome && isB1}>
      <slot />
    </main>
  </div>
</div>
  
  <style>
  .app { position:relative; width:100%; overflow:hidden; }
  main { position:relative; z-index:10; flex:1; padding:4rem 2rem; max-width:1200px; margin:0 auto; width:100%; scroll-behavior:smooth; transition: transform .55s cubic-bezier(.22,.8,.32,1); background:black; }
  main.is-b1 { max-width:none; padding:0; margin:0; }
  main.shift-panel { transform:translateX(var(--reveal-width)); }
  @media (max-width:900px){ main.shift-panel { transform:none; } }


  /* B1 reveal (header + links only, no block background) */
  :root { --reveal-width: 400px; }
  .b1-edge-hotspot { position:fixed; inset:0 auto 0 0; width:40px; z-index:250; cursor:ew-resize; }
  .b1-reveal-group { position:fixed; inset:0 auto 0 0; width:var(--reveal-width); display:flex; flex-direction:column; gap:1.25rem; padding:1.5rem; z-index:240; pointer-events:none; }
  .b1-reveal-group > * { pointer-events:auto; }
  .b1-reveal-group { transform:translateX(calc(-1 * var(--reveal-width) + 8px)); transition:transform .55s cubic-bezier(.22,.8,.32,1), opacity .55s; opacity:.3; }
  .b1-reveal-group.visible { transform:translateX(0); opacity:1; }
  .b1-reveal-group:before { content:""; position:absolute; top:0; bottom:0; right:-24px; width:24px; pointer-events:none; background:linear-gradient(to right, rgba(0,0,0,.6), rgba(0,0,0,0)); opacity:.4; }
  @media (max-width:900px){
    .b1-edge-hotspot { width:20px; }
    .b1-reveal-group { width:220px; }
  }

  :global(body){ background:#000; }

  @media (prefers-reduced-motion:reduce){
    .b1-reveal-group, main { transition:none; }
  }
</style>