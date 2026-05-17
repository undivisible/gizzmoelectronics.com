<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import '../app.css';
  import { page } from '$app/stores';
  import { handleScroll } from '$lib/stores/ui';

  const MOBILE_MQ = '(max-width: 900px)';

  const ROUTE_TITLES: Record<string, string> = {
    '/': 'B1 Boost Controller | Gizzmo Electronics',
    '/downloads': 'Downloads | Gizzmo Electronics',
    '/support': 'Support | Gizzmo Electronics',
    '/store': 'Store | Gizzmo Electronics',
    '/checkout/success': 'Order Confirmed | Gizzmo Electronics',
    '/checkout/cancel': 'Checkout Cancelled | Gizzmo Electronics',
  };

  $: pageTitle = ROUTE_TITLES[$page.url.pathname] ?? 'Gizzmo Electronics';
  $: isB1 = $page.url.pathname === '/';

  let revealChrome = false;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let isMobile = false;

  function showChrome() {
    clearTimeout(hideTimer);
    revealChrome = true;
  }

  function scheduleHide() {
    hideTimer = setTimeout(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.closest('.reveal-group')) {
        active.blur();
      }
      revealChrome = false;
    }, 320);
  }

  function toggleReveal() {
    clearTimeout(hideTimer);
    revealChrome = !revealChrome;
  }

  onMount(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const updateMobile = () => {
      isMobile = mq.matches;
    };
    updateMobile();
    mq.addEventListener('change', updateMobile);

    const onScroll = () => handleScroll(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      mq.removeEventListener('change', updateMobile);
      window.removeEventListener('scroll', onScroll);
    };
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <link rel="icon" type="image/x-icon" href="https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png" />
</svelte:head>

<div class="app bg-black text-white min-h-screen flex" data-reveal={revealChrome} data-b1={isB1}>
  {#if !isB1}
    <aside class="site-sidebar-persistent hidden md:flex flex-col justify-between w-60 shrink-0 p-6 sticky top-0 h-screen z-[260]">
      <div class="mb-6">
        <Header />
      </div>
      <nav class="flex flex-col gap-1 text-[11px] leading-relaxed" aria-label="Quick links">
        <a
          href="/"
          class="nav-link"
          class:nav-link-active={$page.url.pathname === '/'}>B1 Controller</a>
        <a
          href="/support"
          class="nav-link"
          class:nav-link-active={$page.url.pathname === '/support'}>Contact</a>
        <a
          href="/downloads"
          class="nav-link"
          class:nav-link-active={$page.url.pathname === '/downloads'}>Downloads</a>
      </nav>
    </aside>
  {/if}

  {#if isB1}
    <div
      class="edge-hotspot"
      role="presentation"
      tabindex={isMobile ? 0 : -1}
      on:mouseenter={showChrome}
      on:mousemove={showChrome}
      on:mouseleave={scheduleHide}
      on:click={() => isMobile && toggleReveal()}
      on:keydown={(e) => isMobile && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleReveal())}
    ></div>

    <div
      class="reveal-group"
      class:visible={revealChrome}
      role="navigation"
      aria-label="Site navigation"
      inert={!revealChrome}
      on:mouseleave={scheduleHide}
      on:mouseenter={showChrome}
    >
      <div class="reveal-brand">
        <Header />
      </div>
      <nav class="reveal-nav flex flex-col gap-1 text-[11px] leading-relaxed" aria-label="Quick links">
        <a
          href="/support"
          class="nav-link"
          class:nav-link-active={$page.url.pathname === '/support'}>Contact</a>
        <a
          href="/downloads"
          class="nav-link"
          class:nav-link-active={$page.url.pathname === '/downloads'}>Downloads</a>
        <a href="/" class="nav-link nav-link-active">B1 Controller</a>
      </nav>
    </div>
  {/if}

  <div class="flex-1 flex flex-col min-h-screen min-w-0">
    <main class:is-b1={isB1} class:shift-panel={revealChrome && isB1}>
      <slot />
    </main>
  </div>
</div>

<style>
  .app {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  main {
    position: relative;
    z-index: 10;
    flex: 1;
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    scroll-behavior: smooth;
    transition: transform 0.55s cubic-bezier(0.22, 0.8, 0.32, 1);
    background: black;
  }

  main.is-b1 {
    max-width: none;
    padding: 0;
    margin: 0;
  }

  main.shift-panel {
    transform: translateX(var(--reveal-width));
  }

  .nav-link {
    opacity: 0.7;
    border-radius: 0.375rem;
    padding: 0.25rem 0.5rem;
    transition:
      background 0.15s ease,
      opacity 0.15s ease,
      color 0.15s ease;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }

  .nav-link-active {
    opacity: 1;
  }

  .site-sidebar-persistent :global(header) {
    position: relative;
    padding: 0;
    z-index: auto;
  }

  :root {
    --reveal-width: 25rem;
  }

  .edge-hotspot {
    position: fixed;
    inset: 0 auto 0 0;
    width: 2.5rem;
    z-index: 250;
    cursor: ew-resize;
    background: transparent;
  }

  .reveal-group {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 240;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: var(--reveal-width);
    padding: 1.5rem;
    pointer-events: none;
    transform: translateX(calc(-1 * var(--reveal-width) + 8px));
    opacity: 0.35;
    transition:
      transform 0.55s cubic-bezier(0.22, 0.8, 0.32, 1),
      opacity 0.55s ease;
  }

  .reveal-group > * {
    pointer-events: auto;
  }

  .reveal-group.visible {
    transform: translateX(0);
    opacity: 1;
  }

  .reveal-group::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: -1.5rem;
    width: 1.5rem;
    pointer-events: none;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.55), transparent);
    opacity: 0.45;
  }

  .reveal-brand :global(header) {
    position: relative;
    padding: 0;
    z-index: auto;
  }

  .reveal-nav {
    margin-top: auto;
  }

  @media (max-width: 900px) {
    :root {
      --reveal-width: 13.75rem;
    }

    .reveal-group {
      width: var(--reveal-width);
    }

    main.shift-panel {
      transform: none;
    }

    .edge-hotspot {
      width: 1.25rem;
      cursor: pointer;
    }

    .reveal-group {
      transform: translateX(calc(-1 * var(--reveal-width) + 6px));
    }
  }

  :global(body) {
    background: #000;
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal-group,
    main {
      transition: none;
    }
  }
</style>
