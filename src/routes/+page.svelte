<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';
	let checkoutAvailable = false;
	let isCheckoutProcessing = false;
	let checkoutError = '';
	const b1FullPrice = 590;
	const b1DepositPrice = b1FullPrice / 2;
	const b1DepositLabel = `A$${b1DepositPrice} deposit`;
	const b1FullPriceLabel = `A$${b1FullPrice} full price`;

	async function handlePreOrder(): Promise<void> {
		isCheckoutProcessing = true;
		checkoutError = '';

		try {
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: [{ id: 'b1', quantity: 1 }],
					customerEmail: '',
				}),
			});

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error('No checkout URL returned');
			}
		} catch (err) {
			console.error('Checkout error:', err);
			checkoutError =
				err instanceof Error
					? err.message
					: 'An error occurred during checkout';
			isCheckoutProcessing = false;
		}
	}

	let scroller: HTMLElement;
	let bgOuter: HTMLElement;
	let bgInner: HTMLElement;
	let heroDevice: HTMLElement;

	const featureCards = [
		{
			title: 'Next-Gen Display',
			description:
				'Experience crisp, vivid feedback on a 65K colour TFT LCD for the clearest, most informative boost data at a glance.',
			image: '/images/b1/displayproperties.jpeg',
			color: '#3b82f6',
			features: [
				'65,536 colour TFT LCD display',
				'Monitor real time engine vitals',
				'Crisp, vivid feedback at a glance',
			],
		},
		{
			title: 'Billet Alloy Brains',
			description:
				'Crafted from anodized billet alloy for durability and a premium look that stands up to real-world conditions.',
			image: '/images/b1/billet.jpeg',
			color: '#a855f7',
			features: [
				'CNC machined billet alloy construction',
				'Satin Black Anodised finish',
				'Built for real-world durability',
			],
		},
		{
			title: 'Epic Boost Range',
			description:
				'Handle anything from mild street setups to full race builds with precision control across the entire boost spectrum.',
			image: '/images/b1/solenoid.jpeg',
			color: '#10b981',
			features: [
				'Genuine MAC 3-port solenoid',
				'3 bar stainless MAP sensor',
				'Configurable for up to 100 psi sensors',
			],
		},
		{
			title: 'Total Flexibility',
			description:
				'Modular design and extensive I/O options let you tailor inputs, sensors, and on-screen data to your build.',
			image: '/images/b1/displayvalues.jpeg',
			color: '#f59e0b',
			features: [
				'AFR input adapts to any AFR meter — display Lambda or AFR',
				'MAP sensor input configurable to any voltage-output MAP sensor',
				'Top display: peak boost, duty, volt%, voltage, speed, RPM, solenoid %, max boost (lambda, AFR & knock with OPT box)',
			],
		},
		{
			title: 'Real Engine Protection',
			description:
				'Active engine protection using required modules, not sensors — multiple active warnings and cuts.',
			image: '/images/b1/wbcalibration.jpeg',
			color: '#f97316',
			features: [
				'AFR protection — requires opt modules',
				'Knock protection — requires opt modules',
				'Multiple active engine warnings and cuts',
			],
		},
	];

	const comparisonRows = [
		{ f: 'RRP', v: [439, 590, 725, 1195, 2000], type: 'numeric', max: 2000 },
		{ f: 'Speed dependence', v: [0, 1, 1, 1, 1], type: 'boolean' },
		{ f: 'RPM dependence', v: [0, 1, 1, 1, 1], type: 'boolean' },
		{ f: '2D mapping', v: [0, 1, 1, 1, 1], type: 'boolean' },
		{ f: 'Max Bar pressure', v: [3.45, 6.9, 3, 3, 6], type: 'numeric', max: 7 },
		{ f: 'Configurable MAP sensors', v: [0, 1, 0, 0, 1], type: 'boolean' },
		{ f: 'Memories', v: [6, 6, 2, 4, 4], type: 'numeric', max: 6 },
		{ f: 'Analogue AFR', v: [1, 1, 0, 0, 1], type: 'boolean' },
		{ f: 'Analogue knock', v: [0, 1, 0, 0, 1], type: 'boolean' },
		{ f: 'Alloy Billet Case', v: [1, 1, 0, 0, 1], type: 'boolean' },
		{ f: 'Mounting bracket', v: [0, 1, 1, 0, 1], type: 'boolean' },
		{ f: 'PC connection', v: [0, 0, 1, 1, 1], type: 'boolean' },
		{ f: 'Adjustable solenoid freq', v: [0, 1, 0, 0, 1], type: 'boolean' },
	];

	let priceParts: { x: number; w: number; color: string; label: string }[] = [];
	let maxBarParts: { x: number; w: number; color: string; label: string }[] =
		[];

	const _priceVals = [439, 590, 725, 1195, 2000];
	const _priceColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
	const _maxBarVals = [3.45, 6.9, 3, 3, 6];
	const _maxBarColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

	{
		const max = 2000;
		let x = 0;
		priceParts = _priceVals.map((v, i) => {
			const w = Math.max(4, Math.round((v / max) * 320));
			const p = {
				x,
				w,
				color: _priceColors[i],
				label:
					i === 0
						? 'GFB'
						: i === 1
							? 'B1'
							: i === 2
								? 'Greddy'
								: i === 3
									? 'HKS'
									: 'Plex',
			};
			x += w + 4;
			return p;
		});
	}

	{
		const max = 7;
		let x = 0;
		maxBarParts = _maxBarVals.map((v, i) => {
			const w = Math.max(4, Math.round((v / max) * 320));
			const p = {
				x,
				w,
				color: _maxBarColors[i],
				label:
					i === 0
						? 'GFB'
						: i === 1
							? 'B1'
							: i === 2
								? 'Greddy'
								: i === 3
									? 'HKS'
									: 'Plex',
			};
			x += w + 4;
			return p;
		});
	}

	let velocity = 0;
	let lastScrollY = 0;

	const sectionIds: string[] = [
		'hero',
		'features',
		'power',
		'specs',
		'tuning',
		'engineered',
		'comparison',
		'cta',
	];
	const sectionVisible: Record<string, boolean> = {};
	sectionIds.forEach((id) => (sectionVisible[id] = false));
	let active: string = 'hero';

	const sectionRefs: Record<string, HTMLElement | null> = {
		features: null,
		tuning: null,
		engineered: null,
		comparison: null,
		power: null,
		specs: null,
	};

	let featuresIndex = 0;
	let featuresTrack: HTMLElement | null = null;
	let scrollProgress = 0;

	function scrollToFeature(index: number) {
		if (!featuresTrack) return;
		const child = featuresTrack.children[index] as HTMLElement | undefined;
		if (child) {
			const maxScroll = featuresTrack.scrollWidth - featuresTrack.clientWidth;
			const scrollLeft =
				child.offsetLeft - (featuresTrack.clientWidth - child.clientWidth) / 2;
			featuresTrack.scrollTo({
				left: Math.min(Math.max(scrollLeft, 0), maxScroll),
				behavior: 'smooth',
			});
		}
	}

	function onFeaturesScroll() {
		if (!featuresTrack) return;
		const scrollLeft = featuresTrack.scrollLeft;
		const scrollWidth = featuresTrack.scrollWidth - featuresTrack.clientWidth;
		scrollProgress = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;

		const children = Array.from(featuresTrack.children) as HTMLElement[];
		const trackCenter = scrollLeft + featuresTrack.clientWidth / 2;
		let closestIndex = 0;
		let minDistance = Infinity;

		for (let i = 0; i < children.length; i++) {
			const card = children[i];
			const cardCenter = card.offsetLeft + card.clientWidth / 2;
			const distance = Math.abs(trackCenter - cardCenter);
			if (distance < minDistance) {
				minDistance = distance;
				closestIndex = i;
			}
		}

		if (closestIndex !== featuresIndex) {
			featuresIndex = closestIndex;
		}
	}

	function handleNavClick(id: string) {
		const node = document.getElementById(id);
		if (node && scroller && getComputedStyle(scroller).overflowY !== 'visible')
			scroller.scrollTo({
				top: (node as HTMLElement).offsetTop,
				behavior: 'smooth',
			});
		else node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	let parallaxRAF: number | null = null;
	function handleParallax() {
		if (!scroller || parallaxRAF) return;
		parallaxRAF = requestAnimationFrame(() => {
			parallaxRAF = null;
			const y = scroller!.scrollTop;
			velocity = y - lastScrollY;
			lastScrollY = y;
			const totalScrollable = scroller!.scrollHeight - scroller!.clientHeight;
			const progress =
				totalScrollable > 0 ? Math.min(Math.max(y / totalScrollable, 0), 1) : 0;
			const hueRotate = 0 + progress * 120;
			document.documentElement.style.setProperty('--huerot', hueRotate + 'deg');

			const mobileLayout = window.matchMedia('(max-width: 768px)').matches;
			if (bgOuter && !mobileLayout) {
				const scale = 1 + 0.15 * Math.sin(progress * Math.PI * 3);
				const rotate = progress * 90 + Math.sin(progress * 4) * 20;
				const tx = -10 + progress * 80 + Math.sin(progress * 2.5) * 15;
				const ty = 20 + progress * -100 + Math.cos(progress * 1.8) * 25;
				bgOuter.style.transform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rotate}deg) scale(${scale})`;
				bgOuter.style.opacity = String(
					0.6 + Math.sin(progress * Math.PI) * 0.25,
				);
			}

			if (bgInner && !mobileLayout) {
				const scaleI = 1.2 + 0.3 * Math.cos(progress * Math.PI * 2);
				const rotateI = -progress * 60 + Math.cos(progress * 3) * 15;
				const txi = 30 - progress * 60 + Math.cos(progress * 2.2) * 20;
				const tyi = 10 + progress * -80 + Math.sin(progress * 1.5) * 30;
				bgInner.style.transform = `translate3d(${txi}%, ${tyi}%, 0) rotate(${rotateI}deg) scale(${scaleI})`;
				bgInner.style.opacity = String(
					0.7 + Math.cos(progress * Math.PI) * 0.2,
				);
			}
			const optionsRoot = document.getElementById('options');
			if (optionsRoot) {
				const nodes = Array.from(
					optionsRoot.querySelectorAll('[data-parallax-line]'),
				) as HTMLElement[];
				const total = nodes.length || 1;
				const maxAmp = 140;
				const v = Math.max(Math.min(velocity, 900), -900);
				nodes.forEach((el, i) => {
					const p = i / (total - 1 || 1);
					const dir = i % 2 === 0 ? 1 : -1;
					const amp = maxAmp * p;
					const offset = v * 0.55 * (amp / maxAmp) * dir;
					el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
				});
			}
		});
	}
	function observe() {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						active = e.target.id;
						sectionVisible[e.target.id] = true;
					}
				}
			},
			{ threshold: [0.3, 0.7], root: scroller },
		);

		sectionIds.forEach((id) => {
			const node = document.getElementById(id);
			if (node) io.observe(node);
		});
	}
	async function refreshCheckoutAvailability() {
		try {
			const res = await fetch('/api/checkout-available');
			if (!res.ok) return;
			const payload = await res.json();
			if (typeof payload?.available === 'boolean') {
				checkoutAvailable = payload.available;
			}
		} catch {
			// Keep server-rendered or build-time value when the API is unreachable.
		}
	}

	onMount(() => {
		function setVH() {
			document.documentElement.style.setProperty(
				'--vh',
				`${window.innerHeight * 0.01}px`,
			);
		}
		setVH();
		window.addEventListener('resize', setVH);

		void refreshCheckoutAvailability();

		if (scroller) {
			scroller.scrollTop = 0;
			scroller.scrollTo({ top: 0, behavior: 'instant' });
			requestAnimationFrame(() => {
				if (scroller) scroller.scrollTop = 0;
			});
		}
		handleParallax();
		scroller?.addEventListener('scroll', handleParallax, { passive: true });
		observe();

		const scrollerRoot = scroller || null;
		const opts: IntersectionObserverInit = {
			root: scrollerRoot,
			threshold: 0.12,
		};
		const lineIO = new IntersectionObserver((entries) => {
			for (const e of entries) {
				const el = e.target as HTMLElement;
				if (e.isIntersecting) {
					const siblings = Array.from(
						el.parentElement?.querySelectorAll('[data-parallax-line]') || [],
					);
					const idx = siblings.indexOf(el);
					const delay = (idx >= 0 ? idx : 0) * 60;
					el.style.transitionDelay = `${delay}ms`;
					el.classList.add('in');
				}
			}
		}, opts);
		const rootForLines = scroller || document;
		const lines = Array.from(
			rootForLines.querySelectorAll('[data-parallax-line]'),
		) as HTMLElement[];
		lines.forEach((l) => lineIO.observe(l));

		const slidesNode = document.getElementById('comparison');
		let slidesIO: IntersectionObserver | null = null;
		if (slidesNode) {
			slidesIO = new IntersectionObserver(
				(entries) => {
					for (const e of entries) {
						if (e.isIntersecting) {
							const svgs = Array.from(
								slidesNode.querySelectorAll('svg'),
							) as SVGElement[];
							svgs.forEach((svg) => {
								const wRects = Array.from(
									svg.querySelectorAll<SVGRectElement>(
										'rect[data-target-width]',
									),
								) as SVGRectElement[];
								wRects.forEach((r) => {
									const target =
										Number(r.getAttribute('data-target-width')) || 0;
									r.setAttribute('width', String(Math.max(2, target)));
								});

								const hRects = Array.from(
									svg.querySelectorAll<SVGRectElement>(
										'rect[data-target-height]',
									),
								) as SVGRectElement[];
								hRects.forEach((r) => {
									const targetH =
										Number(r.getAttribute('data-target-height')) || 0;
									const baseY = Number(r.getAttribute('data-base-y')) || 0;
									const newY = Math.max(0, baseY - targetH);
									r.setAttribute('height', String(Math.max(2, targetH)));
									r.setAttribute('y', String(newY));
								});
							});
							slidesIO?.disconnect();
						}
					}
				},
				{ root: scroller, threshold: 0.2 },
			);
			slidesIO.observe(slidesNode);
		}

		return () => {
			window.removeEventListener('resize', setVH);
			scroller?.removeEventListener('scroll', handleParallax);
			lineIO.disconnect();
			if (slidesIO) slidesIO.disconnect();
		};
	});
</script>

<svelte:head>
	<meta
		name="description"
		content="Gizzmo B1 boost controller — precision boost control with 2D mapping, real-time display, and engine protection."
	/>
</svelte:head>

<div class="relative w-full vh-fix">
	<nav
		class="fixed top-1/2 right-[46px] -translate-y-1/2 z-[230]"
		aria-label="Section navigation"
	>
		<ul class="m-0 p-0 flex flex-col gap-[18px] list-none">
			{#each sectionIds as id}
				<li class="relative group">
					<button
						class="w-[18px] h-[18px] rounded-full border-2 grid place-items-center transition duration-300 focus:outline-none hover:bg-white/20"
						class:border-[#ffffff30]={active !== id}
						class:border-white={active === id}
						class:shadow-[0_0_0_4px_#ffffff10]={active === id}
						class:bg-[#ffffff20]={active === id}
						aria-label={id}
						on:click={() => handleNavClick(id)}
					>
						<span
							class="block w-[6px] h-[6px] rounded-full bg-white transition duration-300 opacity-55 group-hover:opacity-100"
							class:opacity-100={active === id}
						></span>
						<strong
							class="absolute left-[-8px] top-1/2 -translate-y-1/2 -translate-x-full bg-[#0a0d11] px-2 py-1 text-[0.65rem] tracking-wide border border-white/15 rounded opacity-0 group-hover:opacity-100 text-white font-semibold uppercase whitespace-nowrap transition duration-200"
							class:opacity-100={active === id}>{id}</strong
						>
					</button>
				</li>
			{/each}
		</ul>
	</nav>
	<div class="b1-bg" aria-hidden="true">
		<div class="b1-ellipse-outer" bind:this={bgOuter} style="top:78%;"></div>
		<div class="b1-ellipse-inner" bind:this={bgInner} style="top:82%;"></div>
	</div>
	<div
		class="b1-scroll relative h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth overscroll-contain"
		bind:this={scroller}
	>
		<section
			id="hero"
			class="relative h-screen w-full snap-start flex items-center px-12 lg:px-20 overflow-hidden"
		>
			<div
				class="max-w-7xl mx-auto w-full flex flex-col justify-center space-y-8"
			>
				<div class="text-left space-y-4 z-10 relative">
					<h2
						class="text-[clamp(80px,12vw,140px)] font-bold leading-none tracking-tight hero-title"
					>
						B1
					</h2>
					<p
						class="text-[clamp(32px,5vw,56px)] font-semibold leading-tight text-gray-100 hero-subtitle"
					>
						a new era for Gizzmo
					</p>
				</div>

				<div
					bind:this={heroDevice}
					class="w-full flex-1 hero-device flex items-center justify-center"
				>
					<div class="w-full h-full flex items-center justify-center">
						<img
							src="/images/b1/b1.png"
							alt="B1 Boost Controller"
							class="w-full h-full object-contain drop-shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
						/>
					</div>
				</div>

				<div class="flex gap-4 justify-end items-center hero-cta z-10 relative">
					{#if checkoutAvailable}
						<div class="flex items-center gap-4">
							<div class="text-right">
								<span class="block text-2xl font-bold text-white"
									>{b1DepositLabel}</span
								>
								<span
									class="block text-xs font-semibold uppercase tracking-[0.18em] text-white/45"
									>50% preorder deposit · {b1FullPriceLabel}</span
								>
							</div>
							<button
								on:click={handlePreOrder}
								disabled={isCheckoutProcessing}
								class="rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold tracking-wide px-7 py-3.5 text-base transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
								>{isCheckoutProcessing ? 'Processing…' : 'Pre Order'}</button
							>
						</div>
					{/if}
					<button
						on:click={() => handleNavClick('features')}
						class="rounded-full border-2 border-white/30 hover:border-white/60 text-white font-semibold tracking-wide px-7 py-3.5 text-base transition-all hover:scale-105"
						>Learn More</button
					>
				</div>
			</div>
		</section>

		<section
			id="features"
			data-section="features"
			bind:this={sectionRefs.features}
			class="min-h-screen w-full snap-start relative overflow-hidden flex items-center justify-center"
			class:animate-in={sectionVisible.features}
		>
			<div class="features-shell relative z-10 w-full h-full px-6">
				<div class="h-full flex flex-col">
					<div class="flex-1 flex flex-col justify-center">
						<h3
							class="feature-heading text-[clamp(32px,5vw,52px)] font-semibold text-white mb-8 tracking-tight text-left ml-6"
						>
							Get the highlights.
						</h3>
						<div class="carousel-frame relative w-full h-full overflow-hidden">
							<div
								bind:this={featuresTrack}
								class="flex items-center overflow-x-auto carousel-track snap-x snap-proximity"
								tabindex="0"
								role="listbox"
								aria-label="Feature cards"
								on:scroll={onFeaturesScroll}
								on:keydown={(e) => {
									const ke = e as KeyboardEvent;
									if (ke.key === 'ArrowLeft') {
										ke.preventDefault();
										const newIndex = Math.max(0, featuresIndex - 1);
										featuresIndex = newIndex;
										scrollToFeature(newIndex);
									} else if (ke.key === 'ArrowRight') {
										ke.preventDefault();
										const newIndex = Math.min(
											featureCards.length - 1,
											featuresIndex + 1,
										);
										featuresIndex = newIndex;
										scrollToFeature(newIndex);
									}
								}}
							>
								{#each featureCards as card, i}
									<div
										role="option"
										aria-selected={featuresIndex === i}
										class="feature-card flex-shrink-0 snap-start flex flex-col transition-all duration-500 border border-white/10 shadow-[22px_0_52px_-24px_rgba(0,0,0,0.68)] overflow-hidden relative"
									>
										<div class="absolute inset-0 w-full h-full bg-zinc-900">
											<img
												src={card.image}
												alt={card.title}
												class="w-full h-full object-cover"
											/>
										</div>

										<div
											class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90 pointer-events-none"
										></div>

										<div
											class="relative z-10 h-full p-8 md:p-10 flex flex-col justify-end"
										>
											<div class="space-y-5">
												<div>
													<h3
														class="text-[clamp(28px,4vw,42px)] font-semibold leading-tight text-white mb-3 drop-shadow-2xl"
													>
														{card.title}
													</h3>
													<p
														class="text-base md:text-lg text-white/92 leading-relaxed drop-shadow-lg"
													>
														{card.description}
													</p>
												</div>
												<div class="space-y-2.5">
													{#each card.features as feature}
														<div class="flex items-start gap-3">
															<div
																class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
																style="background-color: {card.color};"
															></div>
															<p
																class="text-sm md:text-base text-white/88 drop-shadow-md"
															>
																{feature}
															</p>
														</div>
													{/each}
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="py-8 flex items-center justify-center">
						<div
							class="feature-status flex items-center justify-center py-2.5 px-4 rounded-full gap-1"
						>
							{#each featureCards as _, i}
								<button
									type="button"
									aria-label={`Slide ${i + 1}`}
									aria-current={featuresIndex === i ? 'true' : undefined}
									class="feature-dot h-2 rounded-full transition-all duration-300"
									style={featuresIndex === i
										? 'width: 2rem; background: white;'
										: 'width: 0.5rem; background: rgba(156, 163, 175, 0.5);'}
									on:click={() => {
										featuresIndex = i;
										scrollToFeature(i);
									}}
								></button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</section>

		<section
			id="power"
			data-section="power"
			bind:this={sectionRefs.power}
			class="min-h-screen w-full snap-start relative py-32 px-8 flex items-center justify-center"
			class:animate-in={sectionVisible.power}
		>
			<div class="max-w-7xl mx-auto">
				<div class="text-center mb-20 stagger-fade-in">
					<h3
						class="text-[clamp(48px,7vw,80px)] font-bold text-white mb-6 tracking-tight"
					>
						Power under the hood.
					</h3>
					<p class="text-2xl text-white/60 font-medium max-w-3xl mx-auto">
						Precision-engineered components working in perfect harmony.
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:bg-zinc-900/70 hover:border-white/20 transition-all hover:scale-[1.02] transform stagger-fade-in"
					>
						<div class="text-5xl font-bold text-blue-400 mb-4">65K</div>
						<div class="text-xl font-semibold text-white mb-2">TFT Display</div>
						<div class="text-sm text-white/60">
							High-resolution color display with vivid, real-time data
							visualization
						</div>
					</div>

					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:bg-zinc-900/70 hover:border-white/20 transition-all hover:scale-[1.02] transform stagger-fade-in"
					>
						<div class="text-5xl font-bold text-purple-400 mb-4">100</div>
						<div class="text-xl font-semibold text-white mb-2">PSI Range</div>
						<div class="text-sm text-white/60">
							Up to 100 psi — requires 100 psi MAP sensor
						</div>
					</div>

					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:bg-zinc-900/70 hover:border-white/20 transition-all hover:scale-[1.02] transform stagger-fade-in"
					>
						<div class="text-5xl font-bold text-emerald-400 mb-4">6</div>
						<div class="text-xl font-semibold text-white mb-2">
							Independent Memories
						</div>
						<div class="text-sm text-white/60">
							Six independent memories for different driving conditions
						</div>
					</div>

					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:bg-zinc-900/70 hover:border-white/20 transition-all hover:scale-[1.02] transform stagger-fade-in"
					>
						<div class="text-5xl font-bold text-pink-400 mb-4">2D</div>
						<div class="text-xl font-semibold text-white mb-2">Map System</div>
						<div class="text-sm text-white/60">
							Boost offset against RPM, speed, voltage, or voltage%
						</div>
					</div>

					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:bg-zinc-900/70 hover:border-white/20 transition-all hover:scale-[1.02] transform stagger-fade-in"
					>
						<div class="text-5xl font-bold text-orange-400 mb-4">CNC</div>
						<div class="text-xl font-semibold text-white mb-2">
							Billet Alloy
						</div>
						<div class="text-sm text-white/60">
							Premium machined construction with anodized finish
						</div>
					</div>

					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:bg-zinc-900/70 hover:border-white/20 transition-all hover:scale-[1.02] transform stagger-fade-in"
					>
						<div class="text-5xl font-bold text-red-400 mb-4">AFR</div>
						<div class="text-xl font-semibold text-white mb-2">AFR & Knock</div>
						<div class="text-sm text-white/60">
							AFR & knock protection. Requires opt modules.
						</div>
					</div>
				</div>
			</div>
		</section>

		<section
			id="specs"
			data-section="specs"
			bind:this={sectionRefs.specs}
			class="min-h-screen w-full snap-start relative py-32 px-8 flex items-center justify-center"
			class:animate-in={sectionVisible.specs}
		>
			<div class="max-w-6xl mx-auto">
				<div class="text-center mb-20 stagger-fade-in">
					<h3
						class="text-[clamp(48px,7vw,80px)] font-bold text-white mb-6 tracking-tight"
					>
						Everything you need.
					</h3>
					<p class="text-2xl text-white/60 font-medium">
						Unbox. Install. Dominate.
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 stagger-fade-in"
					>
						<h4 class="text-3xl font-bold text-white mb-8">
							Included Hardware
						</h4>
						<ul class="space-y-4">
							<li class="flex items-start gap-4">
								<div
									class="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"
								></div>
								<div>
									<div class="text-lg font-semibold text-white">
										B1 Controller Unit
									</div>
									<div class="text-sm text-white/60">
										Main boost control module with TFT display
									</div>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<div
									class="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"
								></div>
								<div>
									<div class="text-lg font-semibold text-white">
										MAC Solenoid
									</div>
									<div class="text-sm text-white/60">
										High-performance 3-port boost control valve
									</div>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<div
									class="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"
								></div>
								<div>
									<div class="text-lg font-semibold text-white">MAP Sensor</div>
									<div class="text-sm text-white/60">
										4 bar manifold absolute pressure sensor
									</div>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<div
									class="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0"
								></div>
								<div>
									<div class="text-lg font-semibold text-white">
										Mounting Brackets
									</div>
									<div class="text-sm text-white/60">
										Universal fit mounting hardware
									</div>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<div
									class="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"
								></div>
								<div>
									<div class="text-lg font-semibold text-white">
										Wiring Harness
									</div>
									<div class="text-sm text-white/60">
										Only requires a minimum of 2 wires
									</div>
								</div>
							</li>
						</ul>
					</div>

					<div
						class="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 stagger-fade-in"
					>
						<h4 class="text-3xl font-bold text-white mb-8">Optional Modules</h4>
						<ul class="space-y-4">
							<li class="flex items-start gap-4">
								<div
									class="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"
								></div>
								<div>
									<div class="text-lg font-semibold text-white">
										Alternative MAP Sensor
									</div>
									<div class="text-sm text-white/60">
										100 psi range requires 100 psi MAP sensor
									</div>
								</div>
							</li>
							<li class="flex items-start gap-4">
								<div
									class="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"
								></div>
								<div>
									<div class="text-lg font-semibold text-white">
										Knock Detection Module
									</div>
									<div class="text-sm text-white/60">
										Real-time engine knock monitoring and protection
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<section
			id="tuning"
			data-section="tuning"
			bind:this={sectionRefs.tuning}
			class="h-screen w-full snap-start relative overflow-hidden flex items-center"
			class:animate-in={sectionVisible.tuning}
		>
			<div
				class="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
			>
				<div class="space-y-8 content-slide-left">
					<h3
						class="text-[clamp(48px,7vw,72px)] font-bold leading-tight text-white tracking-tight"
					>
						Speed & RPM<br />Based Tuning
					</h3>
					<p class="text-xl text-white/60 leading-relaxed font-medium">
						Configure boost by conditions. Intelligent performance adaptation.
						Real-time adjustments for maximum power.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-3 content-slide-right">
					<div
						class="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 hover:bg-zinc-900/80 hover:border-white/20 transition-all hover:scale-[1.02] transform"
					>
						<div class="text-3xl font-bold text-blue-400 mb-2">Speed</div>
						<div class="text-sm text-white/50 font-medium">MPH/KPH Based</div>
					</div>
					<div
						class="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 hover:bg-zinc-900/80 hover:border-white/20 transition-all hover:scale-[1.02] transform"
					>
						<div class="text-3xl font-bold text-purple-400 mb-2">RPM</div>
						<div class="text-sm text-white/50 font-medium">
							Engine Rev Based
						</div>
					</div>
					<div
						class="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 hover:bg-zinc-900/80 hover:border-white/20 transition-all hover:scale-[1.02] transform"
					>
						<div class="text-3xl font-bold text-amber-400 mb-2">Voltage</div>
						<div class="text-sm text-white/50 font-medium">Voltage Based</div>
					</div>
					<div
						class="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 hover:bg-zinc-900/80 hover:border-white/20 transition-all hover:scale-[1.02] transform"
					>
						<div class="text-3xl font-bold text-rose-400 mb-2">Volt %</div>
						<div class="text-sm text-white/50 font-medium">Voltage % Based</div>
					</div>
					<div
						class="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 col-span-2 hover:bg-zinc-900/80 hover:border-white/20 transition-all hover:scale-[1.02] transform"
					>
						<div class="text-3xl font-bold text-emerald-400 mb-2">
							2D Mapping
						</div>
						<div class="text-sm text-white/50 font-medium">
							Two axis boost table with up to 20 zones
						</div>
					</div>
				</div>
			</div>
		</section>

		<section
			id="engineered"
			data-section="engineered"
			bind:this={sectionRefs.engineered}
			class="h-screen w-full snap-start relative flex flex-col items-center justify-center overflow-hidden"
			class:animate-in={sectionVisible.engineered}
		>
			<div class="text-center mb-16 z-10 relative px-6">
				<h3
					class="text-[clamp(40px,6vw,64px)] font-bold text-white mb-5 tracking-tight"
				>
					Engineered for excellence.
				</h3>
				<p class="text-xl text-white/50 font-medium">
					Every detail matters. Every feature counts.
				</p>
			</div>
			<div class="relative w-full z-10 px-6 overflow-hidden">
				<div class="whitespace-nowrap animate-marquee track" aria-hidden="true">
					{#each ['65K TFT', 'Closed-loop', 'Billet Alloy', '6 Independent Memories', 'Analog AFR', 'Knock Detection', 'Speed-based Tuning', 'RPM Mapping', '2D Lookup', 'Wide Range MAP', 'Configurable Solenoid'] as item}
						<span
							class="inline-block px-10 py-5 text-[clamp(24px,3vw,36px)] font-bold text-white/80 tracking-tight"
							>{item}</span
						>
					{/each}
					{#each ['65K TFT', 'Closed-loop', 'Billet Alloy', '6 Independent Memories', 'Analog AFR', 'Knock Detection', 'Speed-based Tuning', 'RPM Mapping', '2D Lookup', 'Wide Range MAP', 'Configurable Solenoid'] as item}
						<span
							class="inline-block px-10 py-5 text-[clamp(24px,3vw,36px)] font-bold text-white/80 tracking-tight"
							>{item}</span
						>
					{/each}
				</div>
			</div>
		</section>

		<section
			id="comparison"
			data-section="comparison"
			bind:this={sectionRefs.comparison}
			class="min-h-screen w-full snap-start relative px-8 py-24 flex flex-col items-center justify-center"
			class:animate-in={sectionVisible.comparison}
		>
			<div class="relative w-full max-w-7xl mx-auto">
				<div class="text-center mb-12">
					<h3
						class="text-[clamp(40px,6vw,64px)] font-bold text-white mb-4 tracking-tight"
					>
						How B1 stacks up.
					</h3>
					<p class="text-xl text-white/50 font-medium">
						Compare features. See the difference.
					</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div
						class="comparison-table-panel bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 overflow-auto"
					>
						<h4 class="text-3xl font-semibold mb-6 text-white/90">
							Specs at a glance
						</h4>
						<table
							class="comparison-table w-full table-fixed text-left table-clean"
						>
							<colgroup>
								<col style="width: 35%;" />
								<col style="width: 13%;" />
								<col style="width: 13%;" />
								<col style="width: 13%;" />
								<col style="width: 13%;" />
								<col style="width: 13%;" />
							</colgroup>
							<thead>
								<tr class="text-sm text-white/70">
									<th class="px-3 py-3 text-left">Feature</th>
									<th class="px-2 py-3 text-center">GFB</th>
									<th class="px-2 py-3 text-center">B1</th>
									<th class="px-2 py-3 text-center">Greddy</th>
									<th class="px-2 py-3 text-center">HKS</th>
									<th class="px-2 py-3 text-center">Plex</th>
								</tr>
							</thead>
							<tbody>
								{#each comparisonRows as row}
									<tr
										class="border-t border-white/5 hover:bg-white/5 transition-colors"
									>
										<td
											class="px-3 py-4 align-middle text-white/90 font-semibold text-sm"
											>{row.f}</td
										>
										{#each row.v as cell}
											{#if row.type === 'boolean'}
												<td class="px-2 py-4 text-center">
													<div
														class={`h-10 flex items-center justify-center rounded-lg ${cell ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
													>
														{#if cell}
															<svg
																width="16"
																height="16"
																viewBox="0 0 24 24"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
																aria-hidden="true"
																><path
																	d="M20 6L9 17l-5-5"
																	stroke="currentColor"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																/></svg
															>
														{:else}
															<svg
																width="16"
																height="16"
																viewBox="0 0 24 24"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
																aria-hidden="true"
																><path
																	d="M18 6L6 18M6 6l12 12"
																	stroke="currentColor"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																/></svg
															>
														{/if}
													</div>
												</td>
											{:else}
												<td class="px-2 py-4 text-center">
													<div
														class="relative bg-neutral-800 rounded-lg h-10 overflow-hidden"
													>
														<div
															class="absolute inset-0"
															style={`width:${Math.round((Number(cell) / (row.max || Math.max(...row.v))) * 100)}%; background: linear-gradient(90deg,#10b981,#f59e0b);`}
															aria-hidden="true"
														></div>
														<div
															class="relative z-10 h-full flex items-center justify-center text-white font-bold text-sm"
														>
															{cell}
														</div>
													</div>
												</td>
											{/if}
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div
						class="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 space-y-8"
					>
						<div>
							<h5 class="text-xl font-semibold text-white mb-6">
								Price Comparison
							</h5>
							<div class="space-y-4">
								{#each _priceVals as pv, idx}
									<div>
										<div class="flex justify-between mb-2">
											<span class="text-sm font-medium text-white/70"
												>{idx === 0
													? 'GFB'
													: idx === 1
														? 'B1'
														: idx === 2
															? 'Greddy'
															: idx === 3
																? 'HKS'
																: 'Plex'}</span
											>
											<span class="text-sm font-bold text-white">${pv}</span>
										</div>
										<div class="h-8 bg-zinc-800 rounded-lg overflow-hidden">
											<div
												class="h-full rounded-lg transition-all duration-1000"
												style={`width: ${(pv / Math.max(..._priceVals)) * 100}%; background: ${_priceColors[idx]};`}
											></div>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<div>
							<h5 class="text-xl font-semibold text-white mb-6">
								Max Boost Pressure (Bar)
							</h5>
							<div class="space-y-4">
								{#each _maxBarVals as mv, idx}
									<div>
										<div class="flex justify-between mb-2">
											<span class="text-sm font-medium text-white/70"
												>{idx === 0
													? 'GFB'
													: idx === 1
														? 'B1'
														: idx === 2
															? 'Greddy'
															: idx === 3
																? 'HKS'
																: 'Plex'}</span
											>
											<span class="text-sm font-bold text-white">{mv} Bar</span>
										</div>
										<div class="h-8 bg-zinc-800 rounded-lg overflow-hidden">
											<div
												class="h-full bg-blue-500 rounded-lg transition-all duration-1000"
												style={`width: ${(mv / Math.max(..._maxBarVals)) * 100}%;`}
											></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section
			id="cta"
			data-section="cta"
			class="min-h-screen w-full snap-start relative py-32 px-8 flex items-center justify-center"
			class:animate-in={sectionVisible.cta}
		>
			<div class="max-w-4xl mx-auto text-center space-y-12">
				<div class="space-y-6 stagger-fade-in">
					<h3
						class="text-[clamp(56px,8vw,96px)] font-bold text-white tracking-tight"
					>
						So, are you convinced?
					</h3>
					<p class="text-2xl text-white/60 font-medium max-w-2xl mx-auto">
						Precision boost control, built for serious builds.
					</p>
				</div>

				<div
					class="flex flex-col sm:flex-row gap-6 justify-center items-center stagger-fade-in"
				>
					{#if checkoutAvailable}
						<button
							on:click={handlePreOrder}
							disabled={isCheckoutProcessing}
							class="rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold tracking-wide px-12 py-5 text-xl transition-all hover:scale-105 shadow-2xl shadow-blue-600/40"
						>
							{isCheckoutProcessing
								? 'Processing…'
								: `Pre Order B1 — ${b1DepositLabel}`}
						</button>
					{/if}
				</div>
				<p class="text-white/40 text-sm stagger-fade-in">
					Australia only. Available June 2026. 50% deposit today, balance due
					before dispatch.
				</p>
				{#if checkoutAvailable && checkoutError}
					<p class="text-red-400 text-center text-sm">{checkoutError}</p>
				{/if}

				<div
					class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 stagger-fade-in"
				>
					<div class="space-y-2">
						<div class="text-4xl">✓</div>
						<div class="text-lg font-semibold text-white">2 Year Warranty</div>
					</div>
					<div class="space-y-2">
						<div class="text-4xl">✓</div>
						<div class="text-lg font-semibold text-white">Expert Support</div>
					</div>
					<div class="space-y-2">
						<div class="text-4xl">✓</div>
						<div class="text-lg font-semibold text-white">
							Easy Installation
						</div>
					</div>
				</div>
			</div>
		</section>

		<div class="w-full block pt-0 snap-end">
			<Footer />
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar utility (commented out to avoid unused-selector warning)
.scrollbar-none::-webkit-scrollbar{display:none}
*/
	/* Marquee animation */
	@keyframes marqueeOpts {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
	@keyframes marqueeScroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
	.animate-marquee {
		animation: marqueeScroll 18s linear infinite;
	}
	/* Marquee structural helpers kept minimal (can't fully express mask & drop-shadow via utilities nicely) */
	:global(.options-marquee) {
		position: absolute;
		top: 2vh;
		left: 0;
		width: 100%;
		overflow: hidden;
		height: 7vw;
		pointer-events: none;
	}
	:global(.options-marquee .layer) {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
	}
	:global(.options-marquee .track) {
		display: flex;
		width: max-content;
		animation: marqueeOpts 16s linear infinite;
		font-size: 4vw;
		font-weight: 600;
		letter-spacing: -1px;
		line-height: 1;
	}
	:global(.options-marquee .layer.base span) {
		color: #ffffff;
		opacity: 0.9;
	}
	:global(.options-marquee .layer.edges) {
		mask: linear-gradient(
			90deg,
			#000 0%,
			#000 14%,
			transparent 38%,
			transparent 62%,
			#000 86%,
			#000 100%
		);
		-webkit-mask: linear-gradient(
			90deg,
			#000 0%,
			#000 14%,
			transparent 38%,
			transparent 62%,
			#000 86%,
			#000 100%
		);
		filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.5));
	}
	:global(.options-marquee .layer.edges span) {
		color: #ff1515;
	}
	:global(.options-marquee span) {
		padding-right: 4vw;
		white-space: nowrap;
	}
	@media (max-width: 980px) {
		:global(.options-marquee .track) {
			font-size: 8vw;
			animation-duration: 20s;
		}
		:global(.options-marquee) {
			height: 12vw;
		}
	}
	.vh-fix {
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
	}

	/* Enhanced fluid background system - continuous across all sections */
	.b1-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
		background: radial-gradient(
			ellipse at 50% 50%,
			rgba(10, 13, 17, 0.98),
			rgba(0, 0, 0, 1)
		);
	}
	.b1-ellipse-outer {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 1800px;
		height: 1800px;
		translate: -50% -50%;
		background: conic-gradient(
			from 0deg,
			#5e81ac,
			#88c0d0,
			#a3be8c,
			#ebcb8b,
			#d08770,
			#bf616a,
			#5e81ac
		);
		filter: hue-rotate(var(--huerot, 0deg)) blur(180px) brightness(1.15)
			saturate(1.4);
		opacity: 0.6;
		mix-blend-mode: screen;
		transition:
			opacity 0.35s ease-out,
			filter 0.5s ease-out,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
		will-change: transform, opacity;
	}
	.b1-ellipse-inner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 1200px;
		height: 1200px;
		translate: -50% -50%;
		background: radial-gradient(
			circle at 50% 50%,
			rgba(136, 192, 208, 0.9),
			rgba(163, 190, 140, 0.7) 40%,
			rgba(94, 129, 172, 0) 70%
		);
		filter: hue-rotate(var(--huerot, 0deg)) blur(140px) brightness(1.2);
		opacity: 0.7;
		mix-blend-mode: screen;
		transition:
			opacity 0.35s ease-out,
			filter 0.5s ease-out,
			transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
		will-change: transform, opacity;
	}
	/* per-line reveal for options and other parallax lines (commented; used via JS)
[data-parallax-line]{
	opacity:0;
	transform:translateY(24px);
	transition:opacity .6s cubic-bezier(.22,.8,.32,1), transform .6s cubic-bezier(.22,.8,.32,1);
	will-change:opacity,transform;
}
[data-parallax-line].in{
	opacity:1;
	transform:translateY(0);
}
*/

	/* Slides & marquee styles (commented - kept for future use)
.marquee-vertical .mv-track{animation:mv-vert 6s linear infinite}
.mv-item{height:60px;display:flex;align-items:center;justify-content:flex-end;padding-right:8px}
@keyframes mv-vert{0%{transform:translateY(0)}25%{transform:translateY(-60px)}50%{transform:translateY(-120px)}75%{transform:translateY(-60px)}100%{transform:translateY(0)}}
*/

	/* options marquee kept (horizontal) */
	:global(.options-marquee .track) {
		display: flex;
		gap: 2rem;
	}

	/* slides container helper (fallback) (commented)
.mv-track,.options-marquee .track{will-change:transform}
*/

	/* svg bars animation: animate width from 0 to data-target-width*px on mount via JS */
	/* hide default scrollbar for tracks */
	.no-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	:global(svg rect) {
		transition: width 900ms cubic-bezier(0.22, 0.8, 0.32, 1);
	}
	.snap-center {
		scroll-snap-align: center;
	}

	/* Improved carousel scrolling */
	.carousel-track {
		scrollbar-width: none;
		-ms-overflow-style: none;
		overscroll-behavior-x: contain;
		-webkit-overflow-scrolling: touch;
		scroll-behavior: smooth;
		gap: 1rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
		scroll-padding-left: 1.5rem;
		scroll-padding-right: 1.5rem;
	}

	.carousel-track::-webkit-scrollbar {
		display: none;
	}

	/* Gentle snap points - left aligned */
	.carousel-track > * {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.feature-card {
		width: clamp(480px, 56vw, 720px);
		height: clamp(360px, 50vh, 540px);
		border-radius: 1.5rem;
		background: rgba(18, 18, 20, 0.82);
	}

	.feature-status {
		background: rgba(115, 115, 115, 0.3);
		backdrop-filter: blur(12px);
	}

	.feature-dot {
		border: 0;
		cursor: pointer;
		padding: 0;
	}

	.hero-device-mobile {
		animation: fadeInUp 0.8s ease-out 0.6s forwards;
		opacity: 0;
	}

	/* subtle marquee edges */
	:global(.options-marquee .layer.edges) {
		opacity: 0.95;
	}

	/* slide dots (commented)
.absolute button.w-3.h-3{width:12px;height:12px;border-radius:9999px;border:none;opacity:0.9}
*/

	/* big feature ticker (horizontal) (commented)
.feature-ticker{white-space:nowrap;display:flex;gap:2rem;animation:tick-left 18s linear infinite}
@keyframes tick-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
*/

	/* Hero animations */
	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(40px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero-title {
		animation: fadeInUp 1s ease-out 0.3s forwards;
		opacity: 0;
	}

	.hero-subtitle {
		animation: fadeInUp 1s ease-out 0.5s forwards;
		opacity: 0;
	}

	.hero-cta {
		animation: fadeInUp 1s ease-out 0.7s forwards;
		opacity: 0;
	}

	.hero-device {
		animation: fadeInUp 1.2s ease-out 0.9s forwards;
		opacity: 0;
	}

	/* Stagger fade in for grid items */
	.stagger-fade-in {
		animation: fadeInUp 0.8s ease-out forwards;
		opacity: 0;
	}

	.stagger-fade-in:nth-child(1) {
		animation-delay: 0.1s;
	}
	.stagger-fade-in:nth-child(2) {
		animation-delay: 0.2s;
	}
	.stagger-fade-in:nth-child(3) {
		animation-delay: 0.3s;
	}
	.stagger-fade-in:nth-child(4) {
		animation-delay: 0.4s;
	}
	.stagger-fade-in:nth-child(5) {
		animation-delay: 0.5s;
	}
	.stagger-fade-in:nth-child(6) {
		animation-delay: 0.6s;
	}
	.stagger-fade-in:nth-child(7) {
		animation-delay: 0.7s;
	}

	/* Scroll-triggered animations (Apple-style) */
	section[data-section] {
		opacity: 0;
		transition: opacity 800ms cubic-bezier(0.22, 0.8, 0.32, 1);
	}

	section[data-section].animate-in {
		opacity: 1;
	}

	.content-slide-left {
		opacity: 0;
		transform: translateX(-40px);
		transition:
			opacity 900ms cubic-bezier(0.22, 0.8, 0.32, 1),
			transform 900ms cubic-bezier(0.22, 0.8, 0.32, 1);
	}

	section.animate-in .content-slide-left {
		opacity: 1;
		transform: translateX(0);
	}

	.content-slide-right {
		opacity: 0;
		transform: translateX(40px);
		transition:
			opacity 900ms cubic-bezier(0.22, 0.8, 0.32, 1) 200ms,
			transform 900ms cubic-bezier(0.22, 0.8, 0.32, 1) 200ms;
	}

	section.animate-in .content-slide-right {
		opacity: 1;
		transform: translateX(0);
	}

	.content-fade-up {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 800ms cubic-bezier(0.22, 0.8, 0.32, 1) 100ms,
			transform 800ms cubic-bezier(0.22, 0.8, 0.32, 1) 100ms;
	}

	section.animate-in .content-fade-up {
		opacity: 1;
		transform: translateY(0);
	}

	/* Image parallax subtle zoom */
	img {
		transition: transform 800ms cubic-bezier(0.22, 0.8, 0.32, 1);
	}

	section.animate-in img {
		transform: scale(1);
	}

	/* Comparison table polish - enhanced for larger size */
	.table-clean thead th {
		position: sticky;
		top: 0;
		background: rgba(10, 12, 14, 0.9);
		backdrop-filter: blur(12px);
		z-index: 2;
		font-weight: 600;
	}
	.table-clean tbody tr:nth-child(odd) {
		background: rgba(255, 255, 255, 0.03);
	}
	.table-clean tbody tr:hover {
		background: rgba(255, 255, 255, 0.05);
	}
	.bar-item {
		transition: all 700ms cubic-bezier(0.22, 0.8, 0.32, 1);
	}
	:global(.bar-item span) {
		font-weight: 700;
		font-size: 12px;
	}

	/* Mobile: ensure sections visible even before JS, reduce GPU load */
	@media (max-width: 768px) {
		nav.fixed.top-1\/2 {
			display: none;
		}

		.vh-fix {
			height: auto;
			min-height: 100svh;
		}
		.b1-scroll {
			height: auto;
			overflow-y: visible;
			scroll-snap-type: none;
			overscroll-behavior: auto;
		}
		#hero {
			min-height: 100svh;
			height: auto;
			padding-top: 5rem;
			padding-bottom: 2rem;
		}
		#features,
		#power,
		#specs,
		#comparison,
		#cta {
			min-height: auto;
			padding-top: 5rem;
			padding-bottom: 5rem;
			scroll-snap-align: none;
		}
		#tuning,
		#engineered {
			min-height: auto;
			height: auto;
			padding-top: 5rem;
			padding-bottom: 5rem;
			scroll-snap-align: none;
		}
		.b1-bg {
			background:
				radial-gradient(
					circle at 50% 0%,
					rgba(60, 66, 78, 0.28),
					transparent 42%
				),
				#030303;
		}
		.b1-ellipse-outer,
		.b1-ellipse-inner {
			display: none;
		}
		section[data-section] {
			opacity: 1 !important;
		}
		section[data-section].animate-in {
			opacity: 1 !important;
		}
		.hero-title,
		.hero-subtitle,
		.hero-cta,
		.hero-device {
			opacity: 1 !important;
			animation: none !important;
		}
		.stagger-fade-in {
			opacity: 1 !important;
			animation: none !important;
		}
		.content-slide-left,
		.content-slide-right,
		.content-fade-up {
			opacity: 1 !important;
			transform: none !important;
		}
		.carousel-track {
			gap: 0.875rem;
			padding-left: 1rem;
			padding-right: 1rem;
			scroll-padding-left: 1rem;
			scroll-padding-right: 1rem;
			width: 100vw;
			margin-left: calc(50% - 50vw);
		}
		.feature-card {
			width: calc(100vw - 2rem);
			height: 25rem;
			border-radius: 1.125rem;
		}
		.features-shell {
			padding-left: 0 !important;
			padding-right: 0 !important;
		}
		.feature-heading {
			margin-left: 0 !important;
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		.carousel-frame {
			overflow: visible;
		}
		#hero {
			padding-left: 1.5rem !important;
			padding-right: 1.5rem !important;
		}
		#comparison {
			padding-left: 0 !important;
			padding-right: 0 !important;
		}
		#comparison > div {
			max-width: none !important;
		}
		#comparison .text-center {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		.comparison-table-panel {
			width: 100vw;
			margin-left: calc(50% - 50vw);
			margin-right: calc(50% - 50vw);
			border-left: 0;
			border-right: 0;
			border-radius: 0;
			padding-left: 1rem;
			padding-right: 1rem;
			-webkit-overflow-scrolling: touch;
		}
		.comparison-table {
			min-width: 44rem;
		}
		.comparison-table th,
		.comparison-table td {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}
		.comparison-table th:first-child,
		.comparison-table td:first-child {
			padding-left: 0.75rem;
		}
		/* Reduce backdrop-filter on mobile (heavy GPU cost) */
		.backdrop-blur-xl,
		.backdrop-blur,
		[class*='backdrop-blur'] {
			backdrop-filter: none !important;
			-webkit-backdrop-filter: none !important;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-marquee {
			animation: none !important;
		}
		.hero-title,
		.hero-subtitle,
		.hero-cta,
		.hero-device {
			opacity: 1 !important;
			animation: none !important;
		}
		.stagger-fade-in {
			opacity: 1 !important;
			animation: none !important;
		}
		section[data-section] {
			opacity: 1 !important;
			transition: none !important;
		}
		.content-slide-left,
		.content-slide-right,
		.content-fade-up {
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
		}
		.carousel-track {
			scroll-behavior: auto;
		}
	}
</style>
