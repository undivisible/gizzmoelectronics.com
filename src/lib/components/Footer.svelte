<script lang="ts">
	import { page } from '$app/stores';

	// Function to check if a link is active
	function isActive(href: string): boolean {
		// For the home page, only match exact '/'
		if (href === '/') {
			return $page.url.pathname === '/';
		}
		// For other pages, check if the pathname starts with the href
		return $page.url.pathname.startsWith(href);
	}
</script>

<footer class="relative z-10 px-8 py-12 border-t border-white/10">
	<div
		class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
	>
		<div class="flex flex-col gap-4 min-w-[200px] text-base sm:text-lg">
			<h2 class="text-2xl sm:text-3xl font-bold tracking-tight m-0">
				Gizzmo Electronics
			</h2>
			<nav
				class="flex flex-col gap-1 sm:flex-row sm:flex-wrap"
				aria-label="Footer links"
			>
				<a
					href="/support"
					class="px-0 sm:px-2.5 py-1.5 rounded-md bg-white/0 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
					class:!text-white={isActive('/support')}
					class:font-semibold={isActive('/support')}>Contact</a
				>
				<a
					href="/"
					class="px-0 sm:px-2.5 py-1.5 rounded-md bg-white/0 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
					class:!text-white={isActive('/')}
					class:font-semibold={isActive('/')}>B1 Controller</a
				>
				<a
					href="/downloads"
					class="px-0 sm:px-2.5 py-1.5 rounded-md bg-white/0 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
					class:!text-white={isActive('/downloads')}
					class:font-semibold={isActive('/downloads')}>Downloads</a
				>
			</nav>
		</div>
	</div>
</footer>
