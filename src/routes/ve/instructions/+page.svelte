<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type ClimateMode = 'auto' | 'manual' | 'demist' | 'recirc';
	type ClimateScreen = {
		id: ClimateMode;
		label: string;
		title: string;
		temperature: number;
		fan: number;
		ac: boolean;
		recirc: boolean;
		front: boolean;
		rear: boolean;
	};

	const symbolBase = '/ve/SWC-Symbol-RedNEW/';
	const transparentSymbolBase = `${symbolBase}transparent/`;
	const renderSrc = '/ve/VE-Cosmetic%20design.1263.jpg';
	const screens: ClimateScreen[] = [
		{
			id: 'auto',
			label: 'Auto',
			title: 'Automatic climate',
			temperature: 31,
			fan: 10,
			ac: true,
			recirc: false,
			front: false,
			rear: true,
		},
		{
			id: 'manual',
			label: 'Manual',
			title: 'Manual fan',
			temperature: 23,
			fan: 14,
			ac: true,
			recirc: false,
			front: false,
			rear: false,
		},
		{
			id: 'demist',
			label: 'Demist',
			title: 'Screen clear',
			temperature: 27,
			fan: 16,
			ac: true,
			recirc: false,
			front: true,
			rear: true,
		},
		{
			id: 'recirc',
			label: 'Recirc',
			title: 'Cabin loop',
			temperature: 19,
			fan: 7,
			ac: false,
			recirc: true,
			front: false,
			rear: false,
		},
	];

	let activeIndex = $state(0);
	let booted = $state(false);
	let activeScreen = $derived(screens[activeIndex]);

	function chooseScreen(index: number) {
		activeIndex = (index + screens.length) % screens.length;
	}

	function nextScreen(direction: number) {
		chooseScreen(activeIndex + direction);
	}

	function changeTemperature(direction: number) {
		activeScreen.temperature = Math.max(
			16,
			Math.min(32, activeScreen.temperature + direction),
		);
	}

	function changeFan(direction: number) {
		activeScreen.fan = Math.max(0, Math.min(17, activeScreen.fan + direction));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			nextScreen(-1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextScreen(1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			changeTemperature(1);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			changeTemperature(-1);
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			nextScreen(1);
		}
	}

	onMount(() => {
		const requestedScreen = new URLSearchParams(window.location.search).get(
			'screen',
		);
		if (requestedScreen) {
			const requestedIndex = screens.findIndex(
				(screen) => screen.id === requestedScreen,
			);
			if (requestedIndex >= 0) chooseScreen(requestedIndex);
		}

		requestAnimationFrame(() => {
			booted = true;
		});

		const fanTimer = setInterval(() => {
			if (screens[activeIndex]?.id === 'auto') {
				changeFan(1);
				if (screens[activeIndex].fan === 17) screens[activeIndex].fan = 8;
			}
		}, 1200);

		return () => clearInterval(fanTimer);
	});

	onDestroy(() => {
		booted = false;
	});
</script>

<svelte:head>
	<title>VE Instructions | Gizzmo Electronics</title>
	<meta
		name="description"
		content="Interactive VE climate interface guide using the original Gizzmo Electronics control artwork."
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<section class="ve-instructions" class:booted>
	<div class="controller-stage">
		<img class="product-render" src={renderSrc} alt="VE climate control unit" />

		<div class="controller-screen" aria-label="Interactive VE screen">
			<div class="screen-ui" aria-live="polite">
				<div class="screen-glow"></div>
				<div class="screen-grid">
					<button
						type="button"
						class="screen-tile fresh"
						class:active={!activeScreen.recirc}
						aria-label="Fresh air"
						onclick={() => (activeScreen.recirc = false)}
					>
						<img src={`${transparentSymbolBase}FreshSymbol.png`} alt="" />
					</button>
					<button
						type="button"
						class="screen-tile front"
						class:active={activeScreen.front}
						aria-label="Front demist"
						onclick={() => (activeScreen.front = !activeScreen.front)}
					>
						<img src={`${transparentSymbolBase}Front_Demist_ON.png`} alt="" />
					</button>
					<button
						type="button"
						class="screen-tile recirc"
						class:active={activeScreen.recirc}
						aria-label="Recirculation"
						onclick={() => (activeScreen.recirc = true)}
					>
						<img src={`${transparentSymbolBase}RecircSymbol.png`} alt="" />
					</button>
					<div class="screen-core">
						<div class="fan-ring" aria-hidden="true"></div>
						<button
							type="button"
							class="temperature-orb"
							aria-label="Temperature"
							onclick={() => changeTemperature(1)}
						>
							<span>Auto</span>
							<strong>{activeScreen.temperature}</strong>
							<small>o</small>
						</button>
					</div>
					<button
						type="button"
						class="screen-tile ac"
						class:active={activeScreen.ac}
						aria-label="Air conditioning"
						onclick={() => (activeScreen.ac = !activeScreen.ac)}
					>
						<img
							src={`${transparentSymbolBase}${activeScreen.ac ? 'AC-SymbolsNEW.png' : 'AC-OFF-SymbolsNEW.png'}`}
							alt=""
						/>
					</button>
					<button
						type="button"
						class="screen-tile rear"
						class:active={activeScreen.rear}
						aria-label="Rear demist"
						onclick={() => (activeScreen.rear = !activeScreen.rear)}
					>
						<img src={`${transparentSymbolBase}Rear_Demist_ON.png`} alt="" />
					</button>
					<button
						type="button"
						class="screen-tile fan-step"
						aria-label="Fan speed"
						onclick={() => changeFan(1)}
					>
						<span class="fan-symbol">✤</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.ve-instructions {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 100svh;
		overflow: hidden;
		background: #000;
		color: #f8fbff;
		opacity: 0;
		transform: scale(1.012);
		transition:
			opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.ve-instructions.booted {
		opacity: 1;
		transform: scale(1);
	}

	.controller-stage {
		position: relative;
		width: min(100%, calc(100svh * 2438 / 1371));
		aspect-ratio: 2438 / 1371;
		overflow: hidden;
		background: #000;
	}

	.controller-stage::before,
	.controller-stage::after {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 1;
		width: 10%;
		background: #000;
		content: '';
		pointer-events: none;
	}

	.controller-stage::before {
		left: 0;
	}

	.controller-stage::after {
		right: 0;
	}

	.product-render {
		position: absolute;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
		-webkit-user-drag: none;
	}

	.controller-screen {
		position: absolute;
		left: 37.25%;
		top: 43.55%;
		width: 25.9%;
		height: 24.8%;
		z-index: 2;
		overflow: hidden;
		border-radius: 0.12rem;
		background: transparent;
		box-shadow: none;
		outline: none;
	}

	.controller-screen button {
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	.screen-ui {
		position: relative;
		width: 100%;
		height: 100%;
		background: transparent;
		box-shadow: none;
		overflow: hidden;
		text-transform: uppercase;
	}

	.screen-glow {
		position: absolute;
		inset: 18% 24%;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(79, 255, 249, 0.13),
			rgba(7, 67, 70, 0.08) 48%,
			transparent 72%
		);
		filter: blur(0.28rem);
	}

	.screen-grid {
		position: absolute;
		inset: 6% 4%;
		z-index: 2;
	}

	.screen-tile {
		position: absolute;
		display: grid;
		place-items: center;
		width: 13.5%;
		height: 18%;
		border-radius: 0.04rem;
		background: transparent;
		box-shadow: none;
		opacity: 0.5;
	}

	.screen-tile.active,
	.screen-tile.fan-step {
		opacity: 1;
	}

	.screen-tile img {
		max-width: 100%;
		max-height: 100%;
		image-rendering: pixelated;
		filter: drop-shadow(0 0 0.18rem rgba(53, 255, 250, 0.72));
		mix-blend-mode: screen;
	}

	.screen-tile.fresh {
		left: 6.5%;
		top: 10%;
	}

	.screen-tile.front {
		right: 6.2%;
		top: 10%;
	}

	.screen-tile.recirc {
		left: 6.5%;
		bottom: 10%;
	}

	.screen-tile.ac {
		right: 6.2%;
		top: 41%;
	}

	.screen-tile.rear {
		right: 6.2%;
		bottom: 10%;
	}

	.screen-tile.fan-step {
		left: 6.5%;
		top: 41%;
	}

	.fan-symbol {
		color: #ebffff;
		font:
			900 clamp(0.52rem, 1.6vw, 1.28rem) Helvetica,
			sans-serif;
		line-height: 1;
		text-shadow: 0 0 0.4rem rgba(83, 255, 255, 0.8);
	}

	.screen-core {
		position: absolute;
		left: 31.2%;
		top: 14.5%;
		display: grid;
		place-items: center;
		width: 37.5%;
		height: 71%;
	}

	.fan-ring {
		position: absolute;
		width: 96%;
		aspect-ratio: 1;
		border-radius: 50%;
		opacity: 0.34;
		background:
			radial-gradient(
				circle,
				transparent 43%,
				rgba(0, 0, 0, 0.55) 44% 48%,
				transparent 49%
			),
			repeating-conic-gradient(
				from -6deg,
				rgba(212, 217, 213, 0.74) 0deg 5deg,
				rgba(23, 27, 27, 0.14) 5deg 13deg
			);
		filter: drop-shadow(0 0 0.18rem rgba(18, 255, 248, 0.22));
	}

	.temperature-orb {
		position: relative;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 56%;
		opacity: 0.42;
		aspect-ratio: 1;
		border: 0.1rem solid rgba(226, 230, 224, 0.88);
		border-radius: 50%;
		background:
			radial-gradient(
				circle at 50% 38%,
				#ffdad2 0 8%,
				#f44931 34%,
				#8d0705 72%
			),
			#b9100c;
		box-shadow:
			inset 0 0 0.64rem rgba(255, 255, 255, 0.44),
			0 0 0.74rem rgba(255, 46, 31, 0.72);
		color: #fff;
		text-shadow: 0 0 0.44rem rgba(0, 0, 0, 0.8);
	}

	.temperature-orb span {
		font:
			700 clamp(0.11rem, 0.34vw, 0.3rem) Helvetica,
			sans-serif;
	}

	.temperature-orb strong {
		font:
			900 clamp(0.5rem, 1.28vw, 1.14rem) Impact,
			sans-serif;
		line-height: 0.78;
		letter-spacing: 0;
	}

	.temperature-orb small {
		position: absolute;
		right: 19%;
		top: 32%;
		font:
			800 clamp(0.1rem, 0.28vw, 0.26rem) Helvetica,
			sans-serif;
	}

	@media (max-width: 760px) {
		.controller-stage {
			width: 150vw;
			transform: translateX(-10%);
		}
	}
</style>
