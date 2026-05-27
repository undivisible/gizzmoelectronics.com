<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
	import { page } from '$app/stores';
	import { handleScroll } from '$lib/stores/ui';

	const MOBILE_MQ = '(max-width: 900px)';

	const ROUTE_TITLES: Record<string, string> = {
		'/': 'B1 Boost Controller | Gizzmo Electronics',
		'/b1/instructions': 'B1 Instructions | Gizzmo Electronics',
		'/downloads': 'Downloads | Gizzmo Electronics',
		'/support': 'Support | Gizzmo Electronics',
		'/store': 'Store | Gizzmo Electronics',
		'/checkout/success': 'Order Confirmed | Gizzmo Electronics',
		'/checkout/cancel': 'Checkout Cancelled | Gizzmo Electronics',
	};

	$: pageTitle = ROUTE_TITLES[$page.url.pathname] ?? 'Gizzmo Electronics';
	$: isB1 =
		$page.url.pathname === '/' ||
		$page.url.pathname.startsWith('/b1/instructions');

	let revealChrome = false;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let isMobile = false;

	function showChrome() {
		if (isMobile) return;
		clearTimeout(hideTimer);
		revealChrome = true;
	}

	function scheduleHide() {
		if (isMobile) return;
		hideTimer = setTimeout(() => {
			const active = document.activeElement;
			if (active instanceof HTMLElement && active.closest('.hover-nav')) {
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
			if (!mq.matches) revealChrome = false;
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
	<link
		rel="icon"
		type="image/x-icon"
		href="https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png"
	/>
</svelte:head>

<div
	class="app bg-black text-white min-h-screen flex"
	data-reveal={revealChrome}
	data-b1={isB1}
>
	{#if !isB1}
		<aside
			class="site-sidebar-persistent hidden md:flex flex-col justify-between w-60 shrink-0 p-6 sticky top-0 h-screen z-[260]"
		>
			<div class="mb-6">
				<Header />
			</div>
			<nav
				class="flex flex-col gap-1 text-[11px] leading-relaxed"
				aria-label="Quick links"
			>
				<a
					href="/"
					class="nav-link"
					class:nav-link-active={$page.url.pathname === '/'}>B1 Controller</a
				>
				<a
					href="/support"
					class="nav-link"
					class:nav-link-active={$page.url.pathname === '/support'}>Contact</a
				>
				<a
					href="/downloads"
					class="nav-link"
					class:nav-link-active={$page.url.pathname === '/downloads'}
					>Downloads</a
				>
			</nav>
		</aside>
	{/if}

	{#if isB1}
		<div
			class="hover-nav"
			class:open={revealChrome}
			role="presentation"
			on:mouseenter={showChrome}
			on:mouseleave={scheduleHide}
		>
			<button
				type="button"
				class="nav-tip"
				class:nav-tip-hidden={revealChrome}
				aria-label={revealChrome ? 'Navigation open' : 'Open navigation'}
				aria-expanded={revealChrome}
				on:click={toggleReveal}
			>
				<span class="nav-tip-chevron" aria-hidden="true">›</span>
				<span class="nav-tip-label">Menu</span>
			</button>

			<div
				class="reveal-group"
				class:visible={revealChrome}
				inert={!revealChrome}
			>
				<div class="reveal-brand">
					<Header />
				</div>
				<nav
					class="reveal-nav flex flex-col gap-1 text-[11px] leading-relaxed"
					aria-label="Quick links"
				>
					<a
						href="/support"
						class="nav-link"
						class:nav-link-active={$page.url.pathname === '/support'}>Contact</a
					>
					<a
						href="/downloads"
						class="nav-link"
						class:nav-link-active={$page.url.pathname === '/downloads'}
						>Downloads</a
					>
					<a
						href="/"
						class="nav-link"
						class:nav-link-active={$page.url.pathname === '/'}>B1 Controller</a
					>
				</nav>
			</div>
		</div>
	{/if}

	<div class="flex-1 flex flex-col min-h-screen min-w-0">
		<main
			class:is-b1={isB1}
			class:shift-panel={revealChrome && isB1 && !isMobile}
		>
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

	.app[data-b1='true'] {
		overflow: visible;
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
		background: transparent;
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
		--reveal-width: 16rem;
		--nav-peek: 0.75rem;
	}

	.hover-nav {
		position: fixed;
		inset: 0 auto 0 0;
		z-index: 250;
		display: flex;
		flex-direction: column;
		width: var(--nav-peek);
		padding: 1.5rem 0.75rem;
		background: transparent;
		overflow: visible;
		transition: width 0.55s cubic-bezier(0.22, 0.8, 0.32, 1);
	}

	.hover-nav.open {
		width: var(--reveal-width);
		padding: 1.5rem;
	}

	.nav-tip {
		position: absolute;
		left: 0;
		top: 50%;
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		width: 2rem;
		padding: 0.65rem 0.25rem;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-left: none;
		border-radius: 0 0.5rem 0.5rem 0;
		background: rgba(0, 0, 0, 0.35);
		color: white;
		cursor: pointer;
		transform: translateY(-50%);
		backdrop-filter: blur(6px);
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.nav-tip:hover {
		border-color: rgba(255, 255, 255, 0.35);
		background: rgba(0, 0, 0, 0.5);
	}

	.nav-tip-hidden {
		opacity: 0;
		pointer-events: none;
		transform: translate(-0.35rem, -50%);
	}

	.nav-tip-chevron {
		font-size: 1rem;
		line-height: 1;
		font-weight: 700;
	}

	.nav-tip-label {
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		writing-mode: vertical-rl;
		opacity: 0.85;
	}

	.reveal-group {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
		min-height: 100%;
		padding-left: 1.35rem;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.35s ease,
			visibility 0.35s ease;
	}

	.reveal-group.visible {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}

	.reveal-group :global(header) {
		position: relative;
		padding: 0;
		z-index: auto;
	}

	.reveal-nav {
		margin-top: auto;
	}

	@media (max-width: 900px) {
		:root {
			--reveal-width: 14rem;
		}

		.hover-nav {
			width: auto;
			min-width: var(--nav-peek);
			padding: 0;
			pointer-events: none;
		}

		.hover-nav.open {
			width: var(--reveal-width);
			padding: 1.25rem 1rem;
			pointer-events: auto;
		}

		.nav-tip {
			top: auto;
			bottom: 1.25rem;
			transform: none;
			flex-direction: row;
			width: auto;
			min-width: 2.75rem;
			padding: 0.55rem 0.75rem;
			border-left: 1px solid rgba(255, 255, 255, 0.18);
			pointer-events: auto;
		}

		.nav-tip-hidden {
			transform: translateX(-120%);
		}

		.nav-tip-label {
			writing-mode: horizontal-tb;
			letter-spacing: 0.08em;
		}

		.reveal-group {
			padding-left: 0;
		}
	}

	:global(body) {
		background: #000;
	}

	@media (prefers-reduced-motion: reduce) {
		.hover-nav,
		main,
		.nav-tip,
		.reveal-group {
			transition: none;
		}
	}
</style>
