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
	const renderSrc = '/ve/VE-Cosmetic%20design.1263.jpg';
	const centerBackdrop = `${symbolBase}SymbolsEtc/Formatted/highBackground.bmp`;
	const fanFrames = Array.from(
		{ length: 18 },
		(_, index) => `${symbolBase}Fan_Segments/formatted/${index}.bmp`,
	);
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
				<img class="screen-backdrop" src={centerBackdrop} alt="" />
				<div class="screen-title">{activeScreen.title}</div>
				<div class="screen-grid">
					<button
						type="button"
						class="screen-tile"
						class:active={!activeScreen.recirc}
						aria-label="Fresh air"
						onclick={() => (activeScreen.recirc = false)}
					>
						<img
							src={`${symbolBase}SymbolsEtc/Formatted/FreshSymbol.bmp`}
							alt=""
						/>
					</button>
					<button
						type="button"
						class="screen-tile"
						class:active={activeScreen.front}
						aria-label="Front demist"
						onclick={() => (activeScreen.front = !activeScreen.front)}
					>
						<img
							src={`${symbolBase}SymbolsEtc/Formatted/Front_Demist_ON.bmp`}
							alt=""
						/>
					</button>
					<button
						type="button"
						class="screen-tile"
						class:active={activeScreen.recirc}
						aria-label="Recirculation"
						onclick={() => (activeScreen.recirc = true)}
					>
						<img
							src={`${symbolBase}SymbolsEtc/Formatted/RecircSymbol.bmp`}
							alt=""
						/>
					</button>
					<div class="screen-core">
						<img class="fan-frame" src={fanFrames[activeScreen.fan]} alt="" />
						<button
							type="button"
							class="temperature-orb"
							aria-label="Temperature"
							onclick={() => changeTemperature(1)}
						>
							<span>Auto</span>
							<strong>{activeScreen.temperature}</strong>
							<small>°C</small>
						</button>
					</div>
					<button
						type="button"
						class="screen-tile"
						class:active={activeScreen.ac}
						aria-label="Air conditioning"
						onclick={() => (activeScreen.ac = !activeScreen.ac)}
					>
						<img
							src={`${symbolBase}${activeScreen.ac ? 'AC-SymbolsNEW.bmp' : 'AC-OFF-SymbolsNEW.bmp'}`}
							alt=""
						/>
					</button>
					<button
						type="button"
						class="screen-tile"
						class:active={activeScreen.rear}
						aria-label="Rear demist"
						onclick={() => (activeScreen.rear = !activeScreen.rear)}
					>
						<img
							src={`${symbolBase}SymbolsEtc/Formatted/Rear_Demist_ON.bmp`}
							alt=""
						/>
					</button>
					<button
						type="button"
						class="screen-tile fan-step"
						aria-label="Fan speed"
						onclick={() => changeFan(1)}
					>
						<span>Fan {activeScreen.fan}</span>
					</button>
					<div class="screen-status">{activeScreen.label}</div>
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
		left: 42.45%;
		top: 46.95%;
		width: 18.7%;
		height: 23.1%;
		z-index: 2;
		overflow: hidden;
		border-radius: 0.18rem;
		background: #020a0c;
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
		background: #031114;
		box-shadow:
			inset 0 0 0.7rem rgba(84, 255, 248, 0.18),
			0 0 0.9rem rgba(45, 255, 249, 0.22);
		overflow: hidden;
		text-transform: uppercase;
	}

	.screen-backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.38;
		image-rendering: pixelated;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.screen-title {
		position: absolute;
		left: 0;
		right: 0;
		top: 4.5%;
		z-index: 2;
		color: #9afcff;
		font:
			700 clamp(0.18rem, 0.58vw, 0.54rem) Eurostile,
			Bank Gothic,
			sans-serif;
		letter-spacing: 0;
		text-align: center;
		text-shadow: 0 0 0.8rem rgba(65, 255, 246, 0.85);
	}

	.screen-grid {
		position: absolute;
		inset: 17% 4.4% 5%;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr 1.52fr 1fr;
		grid-template-rows: 1fr 1fr 0.35fr;
		align-items: center;
		gap: 4%;
	}

	.screen-tile {
		position: relative;
		display: grid;
		place-items: center;
		justify-items: center;
		width: 100%;
		height: 100%;
		border-radius: 0.12rem;
		background: rgba(15, 74, 79, 0.46);
		box-shadow:
			inset 0 0 0.42rem rgba(70, 255, 248, 0.22),
			0 0 0.3rem rgba(13, 255, 247, 0.2);
		opacity: 0.58;
	}

	.screen-tile.active,
	.screen-tile.fan-step {
		opacity: 1;
	}

	.screen-tile img {
		max-width: 64%;
		max-height: 70%;
		image-rendering: pixelated;
		filter: drop-shadow(0 0 0.35rem rgba(53, 255, 250, 0.82));
	}

	.fan-step span,
	.screen-status {
		font:
			800 clamp(0.16rem, 0.47vw, 0.42rem) Helvetica,
			sans-serif;
		color: #dfffff;
		text-shadow: 0 0 0.45rem rgba(83, 255, 255, 0.72);
	}

	.screen-core {
		position: relative;
		grid-column: 2;
		grid-row: 1 / 3;
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.fan-frame {
		position: absolute;
		width: 96%;
		opacity: 0.72;
		image-rendering: pixelated;
		filter: drop-shadow(0 0 0.45rem rgba(18, 255, 248, 0.58));
	}

	.temperature-orb {
		position: relative;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 58%;
		aspect-ratio: 1;
		border: 0.12rem solid rgba(220, 225, 222, 0.84);
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
			inset 0 0 0.9rem rgba(255, 255, 255, 0.44),
			0 0 1.2rem rgba(255, 46, 31, 0.72);
		color: #fff;
		text-shadow: 0 0 0.44rem rgba(0, 0, 0, 0.8);
	}

	.temperature-orb span {
		font:
			700 clamp(0.14rem, 0.42vw, 0.38rem) Helvetica,
			sans-serif;
	}

	.temperature-orb strong {
		font:
			900 clamp(0.6rem, 1.52vw, 1.36rem) Impact,
			sans-serif;
		line-height: 0.78;
		letter-spacing: 0;
	}

	.temperature-orb small {
		position: absolute;
		right: 19%;
		top: 32%;
		font:
			800 clamp(0.14rem, 0.38vw, 0.34rem) Helvetica,
			sans-serif;
	}

	.screen-status {
		grid-column: 2;
		text-align: center;
	}

	@media (max-width: 760px) {
		.controller-stage {
			width: 150vw;
			transform: translateX(-10%);
		}
	}
</style>
