<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import '../app.css';
  import { page } from '$app/stores';
  import { sidebarOpen, handleScroll, toggleSidebar } from '$lib/stores/ui';

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
  $: sidebarVisible = revealChrome || $sidebarOpen;

  let revealChrome = false;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let isMobile = false;

  function openSidebar() {
    clearTimeout(hideTimer);
    revealChrome = true;
    toggleSidebar(true);
  }

  function closeSidebar() {
    clearTimeout(hideTimer);
    revealChrome = false;
    toggleSidebar(false);
  }

  function toggleSidebarPanel() {
    if (sidebarVisible) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function showChrome() {
    if (isMobile) return;
    clearTimeout(hideTimer);
    revealChrome = true;
  }

  function scheduleHide() {
    if ($sidebarOpen || isMobile) return;
    hideTimer = setTimeout(() => {
      revealChrome = false;
    }, 320);
  }

  function handleNavClick() {
    if (isMobile) closeSidebar();
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
      document.body.style.overflow = '';
    };
  });

  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = isMobile && sidebarVisible ? 'hidden' : '';
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <link rel="icon" type="image/x-icon" href="https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png" />
</svelte:head>

<div
  class="app bg-black text-white min-h-screen flex"
  data-sidebar={$sidebarOpen}
  data-reveal={revealChrome}
  data-b1={isB1}
  class:sidebar-open={sidebarVisible}
>
  {#if sidebarVisible}
    <button
      type="button"
      class="sidebar-backdrop"
      aria-label="Close menu"
      on:click={closeSidebar}
    ></button>
  {/if}

  <button
    type="button"
    class="sidebar-tip"
    class:sidebar-tip-hidden={sidebarVisible}
    aria-label="Open menu"
    aria-expanded={sidebarVisible}
    on:click={toggleSidebarPanel}
  >
    <span class="sidebar-tip-chevron" aria-hidden="true">›</span>
    <span class="sidebar-tip-text">Menu</span>
  </button>

  <div
    class="sidebar-edge-hotspot"
    role="presentation"
    aria-hidden="true"
    on:mouseenter={showChrome}
    on:mousemove={showChrome}
    on:mouseleave={scheduleHide}
  ></div>

  <aside
    class="site-sidebar"
    class:visible={sidebarVisible}
    on:mouseleave={scheduleHide}
    on:mouseenter={showChrome}
    aria-hidden={!sidebarVisible}
  >
    <div class="sidebar-panel-header">
      <div class="sidebar-brand">
        <Header />
      </div>
      <button
        type="button"
        class="sidebar-close"
        aria-label="Close menu"
        on:click={closeSidebar}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <nav class="sidebar-nav" aria-label="Quick links">
      <a
        href="/"
        class="sidebar-link"
        class:sidebar-link-active={$page.url.pathname === '/'}
        on:click={handleNavClick}>B1 Controller</a>
      <a
        href="/support"
        class="sidebar-link"
        class:sidebar-link-active={$page.url.pathname === '/support'}
        on:click={handleNavClick}>Contact</a>
      <a
        href="/downloads"
        class="sidebar-link"
        class:sidebar-link-active={$page.url.pathname === '/downloads'}
        on:click={handleNavClick}>Downloads</a>
    </nav>
  </aside>

  <div class="flex-1 flex flex-col min-h-screen min-w-0">
    <main class:is-b1={isB1} class:shift-panel={sidebarVisible && !isMobile}>
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
    transform: translateX(var(--sidebar-width));
  }

  :root {
    --sidebar-width: 15rem;
    --sidebar-tip-width: 2.25rem;
  }

  .sidebar-backdrop {
    display: none;
  }

  .sidebar-tip {
    position: fixed;
    left: 0;
    top: 50%;
    z-index: 265;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    width: var(--sidebar-tip-width);
    padding: 0.85rem 0.35rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-left: none;
    border-radius: 0 0.65rem 0.65rem 0;
    background: rgba(10, 13, 17, 0.92);
    color: white;
    cursor: pointer;
    transform: translateY(-50%);
    backdrop-filter: blur(10px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.04),
      4px 0 24px rgba(0, 0, 0, 0.45);
    transition:
      opacity 0.25s ease,
      transform 0.25s ease,
      background 0.2s ease;
  }

  .sidebar-tip:hover {
    background: rgba(24, 28, 34, 0.98);
    border-color: rgba(255, 255, 255, 0.35);
  }

  .sidebar-tip-hidden {
    opacity: 0;
    pointer-events: none;
    transform: translate(-0.5rem, -50%);
  }

  .sidebar-tip-chevron {
    font-size: 1.1rem;
    line-height: 1;
    font-weight: 700;
  }

  .sidebar-tip-text {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    opacity: 0.85;
  }

  .sidebar-edge-hotspot {
    position: fixed;
    inset: 0 auto 0 0;
    width: 1.5rem;
    z-index: 255;
    cursor: ew-resize;
  }

  .site-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 270;
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width);
    padding: 1rem 1rem 1.5rem;
    background: rgba(10, 13, 17, 0.97);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(14px);
    transform: translateX(-100%);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      transform 0.5s cubic-bezier(0.22, 0.8, 0.32, 1),
      opacity 0.3s ease,
      visibility 0.5s;
  }

  .site-sidebar.visible {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .sidebar-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .sidebar-brand :global(header) {
    position: relative;
    padding: 0;
    z-index: auto;
  }

  .sidebar-close {
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    color: white;
    font-size: 1.35rem;
    line-height: 1;
    cursor: pointer;
  }

  .sidebar-close:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .sidebar-link {
    display: block;
    padding: 0.65rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.8125rem;
    line-height: 1.35;
    color: rgba(255, 255, 255, 0.72);
    transition: background 0.15s ease, color 0.15s ease;
  }

  .sidebar-link:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  .sidebar-link-active {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    :root {
      --sidebar-width: min(18rem, 88vw);
    }

    .sidebar-edge-hotspot {
      display: none;
    }

    main.shift-panel {
      transform: none;
    }

    .sidebar-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 260;
      border: none;
      padding: 0;
      margin: 0;
      background: rgba(0, 0, 0, 0.62);
      cursor: pointer;
    }

    .sidebar-tip {
      top: auto;
      bottom: 1.25rem;
      transform: none;
      width: auto;
      min-width: 3.25rem;
      flex-direction: row;
      padding: 0.65rem 0.85rem;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0 0.75rem 0.75rem 0;
      box-shadow: 4px 4px 24px rgba(0, 0, 0, 0.5);
    }

    .sidebar-tip-hidden {
      transform: translateX(-120%);
    }

    .sidebar-tip-text {
      writing-mode: horizontal-tb;
      text-orientation: mixed;
      letter-spacing: 0.08em;
    }

    .sidebar-link {
      padding: 0.85rem 0.9rem;
      font-size: 0.9375rem;
    }

    .site-sidebar {
      padding-top: max(1rem, env(safe-area-inset-top));
      padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
    }
  }

  :global(body) {
    background: #000;
  }

  @media (prefers-reduced-motion: reduce) {
    .site-sidebar,
    main,
    .sidebar-tip {
      transition: none;
    }
  }
</style>
