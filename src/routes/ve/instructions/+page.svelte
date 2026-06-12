<script lang="ts">
	import { base } from '$app/paths';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

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

	let { data }: { data: PageData } = $props();

	const symbolBase = '/ve/SWC-Symbol-RedNEW/';
	const renderSrc = '/ve/VE-Cosmetic%20design.1263.jpg';
	const manualSrc = '/ve/FP9355_User_Installation_Manual_A5-24072023.pdf';
	const manualHref = `${base}${manualSrc}`;
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
	let assetCount = $derived(data.assets.length);

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

		<div class="climate-interface" aria-label="Interactive VE climate control">
			<button
				type="button"
				class="side-button recirc-button"
				class:active={activeScreen.recirc}
				aria-label="Toggle recirculation"
				onclick={() => (activeScreen.recirc = !activeScreen.recirc)}
			>
				<img
					src={`${symbolBase}SymbolsEtc/Formatted/RecircSymbol.bmp`}
					alt=""
				/>
			</button>

			<button
				type="button"
				class="side-button fresh-button"
				class:active={!activeScreen.recirc}
				aria-label="Toggle fresh air"
				onclick={() => (activeScreen.recirc = !activeScreen.recirc)}
			>
				<img src={`${symbolBase}SymbolsEtc/Formatted/FreshSymbol.bmp`} alt="" />
			</button>

			<button
				type="button"
				class="dial left-dial"
				aria-label="Fan speed"
				onclick={() => changeFan(1)}
			></button>

			<div class="lcd-panel" aria-live="polite">
				<div class="lcd-title">{activeScreen.title}</div>
				<div class="lcd-layout">
					<div class="lcd-column">
						<img
							class="lcd-icon"
							src={`${symbolBase}${activeScreen.ac ? 'AC-SymbolsNEW.bmp' : 'AC-OFF-SymbolsNEW.bmp'}`}
							alt=""
						/>
						<span>{activeScreen.ac ? 'AC' : 'AC Off'}</span>
					</div>
					<div class="lcd-core">
						<div class="temperature-orb">
							<span>Auto</span>
							<strong>{activeScreen.temperature}</strong>
							<small>°C</small>
						</div>
						<img class="fan-frame" src={fanFrames[activeScreen.fan]} alt="" />
					</div>
					<div class="lcd-column">
						<img
							class="lcd-icon"
							src={`${symbolBase}SymbolsEtc/Formatted/${activeScreen.front ? 'Front_Demist_ON.bmp' : 'Front_Demist_OFF.bmp'}`}
							alt=""
						/>
						<img
							class="lcd-icon"
							src={`${symbolBase}SymbolsEtc/Formatted/${activeScreen.rear ? 'Rear_Demist_ON.bmp' : 'Rear_Demist_OFF.bmp'}`}
							alt=""
						/>
					</div>
				</div>
				<div class="status-strip">
					<span>Fan {activeScreen.fan}</span>
					<span>{activeScreen.recirc ? 'Recirc' : 'Fresh'}</span>
					<span
						>{activeScreen.front || activeScreen.rear
							? 'Demist'
							: 'Cabin'}</span
					>
				</div>
			</div>

			<button
				type="button"
				class="dial right-dial"
				aria-label="Temperature"
				onclick={() => changeTemperature(1)}
			></button>

			<button
				type="button"
				class="side-button front-button"
				class:active={activeScreen.front}
				aria-label="Toggle front demist"
				onclick={() => (activeScreen.front = !activeScreen.front)}
			>
				<img
					src={`${symbolBase}SymbolsEtc/Formatted/Front_Demist_ON.bmp`}
					alt=""
				/>
			</button>

			<button
				type="button"
				class="side-button rear-button"
				class:active={activeScreen.rear}
				aria-label="Toggle rear demist"
				onclick={() => (activeScreen.rear = !activeScreen.rear)}
			>
				<img
					src={`${symbolBase}SymbolsEtc/Formatted/Rear_Demist_ON.bmp`}
					alt=""
				/>
			</button>
		</div>

		<nav class="screen-nav" aria-label="VE screen presets">
			{#each screens as screen, index (screen.id)}
				<button
					type="button"
					class:active={index === activeIndex}
					onclick={() => chooseScreen(index)}
				>
					{screen.label}
				</button>
			{/each}
		</nav>

		<button
			type="button"
			class="manual-link"
			onclick={() => {
				window.location.href = manualHref;
			}}>Manual</button
		>
		<div class="asset-count">{assetCount} source assets</div>
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
		width: min(100vw, calc(100svh * 2438 / 1371));
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

	.climate-interface {
		position: absolute;
		left: 14.2%;
		top: 36.2%;
		display: grid;
		grid-template-columns: 8.2% 23.4% 31.8% 23.4% 8.2%;
		grid-template-rows: 1fr 1fr;
		align-items: center;
		gap: 0.7%;
		width: 72%;
		height: 35.8%;
		z-index: 2;
		outline: none;
	}

	.climate-interface {
		border: 0;
		background: transparent;
		padding: 0;
	}

	.climate-interface button {
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	.dial {
		position: relative;
		grid-row: 1 / 3;
		width: 100%;
		aspect-ratio: 1;
	}

	.left-dial {
		grid-column: 2;
	}

	.right-dial {
		grid-column: 4;
	}

	.lcd-panel {
		position: relative;
		grid-column: 3;
		grid-row: 1 / 3;
		display: grid;
		grid-template-rows: auto 1fr auto;
		box-sizing: border-box;
		width: 100%;
		height: 55%;
		padding: 3.2% 4.6%;
		border: 1px solid rgba(104, 250, 255, 0.44);
		border-radius: 0.28rem;
		background:
			linear-gradient(90deg, rgba(11, 32, 38, 0.86), rgba(24, 60, 64, 0.72)),
			#071215;
		box-shadow:
			0 0 1rem rgba(45, 255, 249, 0.28),
			inset 0 0 1.2rem rgba(45, 255, 249, 0.18);
		text-transform: uppercase;
	}

	.lcd-title {
		color: #9afcff;
		font:
			700 clamp(0.42rem, 1.1vw, 0.92rem) Eurostile,
			Bank Gothic,
			sans-serif;
		letter-spacing: 0;
		text-align: center;
		text-shadow: 0 0 0.8rem rgba(65, 255, 246, 0.85);
	}

	.lcd-layout {
		display: grid;
		grid-template-columns: 1fr 1.8fr 1fr;
		align-items: center;
		min-height: 0;
	}

	.lcd-column {
		display: grid;
		justify-items: center;
		gap: 0.16rem;
		color: #85f8ff;
		font:
			700 clamp(0.32rem, 0.74vw, 0.62rem) Helvetica,
			sans-serif;
	}

	.lcd-icon {
		width: min(42%, 2rem);
		image-rendering: pixelated;
		filter: drop-shadow(0 0 0.4rem rgba(53, 255, 250, 0.9));
	}

	.lcd-core {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 0;
	}

	.fan-frame {
		position: absolute;
		width: 78%;
		opacity: 0.72;
		image-rendering: pixelated;
		filter: drop-shadow(0 0 0.45rem rgba(18, 255, 248, 0.58));
	}

	.temperature-orb {
		position: relative;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 43%;
		aspect-ratio: 1;
		border: 0.22rem solid rgba(220, 225, 222, 0.84);
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
			700 clamp(0.28rem, 0.62vw, 0.52rem) Helvetica,
			sans-serif;
	}

	.temperature-orb strong {
		font:
			900 clamp(1rem, 3vw, 2.8rem) Impact,
			sans-serif;
		line-height: 0.78;
		letter-spacing: 0;
	}

	.temperature-orb small {
		position: absolute;
		right: 19%;
		top: 32%;
		font:
			800 clamp(0.26rem, 0.62vw, 0.54rem) Helvetica,
			sans-serif;
	}

	.status-strip {
		display: flex;
		justify-content: space-between;
		gap: 0.2rem;
		color: #e8ffff;
		font:
			700 clamp(0.27rem, 0.67vw, 0.56rem) Helvetica,
			sans-serif;
		text-shadow: 0 0 0.6rem rgba(83, 255, 255, 0.72);
	}

	.side-button {
		display: grid;
		place-items: center;
		width: 100%;
		aspect-ratio: 1.1;
		border-radius: 0.56rem;
		background: rgba(0, 0, 0, 0.24);
		box-shadow: inset 0 0 0.8rem rgba(0, 0, 0, 0.6);
		opacity: 0.54;
		transition:
			opacity 0.2s ease,
			filter 0.2s ease;
	}

	.side-button.active {
		opacity: 1;
		filter: drop-shadow(0 0 0.42rem rgba(70, 255, 248, 0.94));
	}

	.side-button img {
		max-width: 46%;
		max-height: 54%;
		image-rendering: pixelated;
	}

	.recirc-button {
		grid-column: 1;
		grid-row: 1;
	}

	.fresh-button {
		grid-column: 1;
		grid-row: 2;
	}

	.front-button {
		grid-column: 5;
		grid-row: 1;
	}

	.rear-button {
		grid-column: 5;
		grid-row: 2;
	}

	.screen-nav {
		position: absolute;
		left: 50%;
		bottom: 4.8%;
		z-index: 3;
		display: flex;
		gap: 0.4rem;
		transform: translateX(-50%);
	}

	.screen-nav button,
	.manual-link,
	.asset-count {
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 999px;
		background: rgba(11, 12, 12, 0.66);
		color: #f6ffff;
		backdrop-filter: blur(8px);
		font:
			700 clamp(0.58rem, 1vw, 0.78rem) Helvetica,
			sans-serif;
		text-decoration: none;
	}

	.screen-nav button,
	.manual-link {
		padding: 0.5rem 0.78rem;
		cursor: pointer;
	}

	.screen-nav button.active {
		border-color: rgba(90, 255, 247, 0.82);
		background: rgba(11, 45, 48, 0.82);
		box-shadow: 0 0 1rem rgba(60, 255, 248, 0.28);
	}

	.manual-link {
		position: absolute;
		right: 5%;
		bottom: 4.8%;
		z-index: 3;
	}

	.asset-count {
		position: absolute;
		left: 5%;
		bottom: 4.8%;
		z-index: 3;
		padding: 0.5rem 0.78rem;
	}

	@media (max-width: 760px) {
		.controller-stage {
			width: 150vw;
			transform: translateX(-10%);
		}

		.screen-nav {
			bottom: 2.4%;
			max-width: 64vw;
			overflow-x: auto;
			padding-bottom: 0.18rem;
		}

		.manual-link,
		.asset-count {
			display: none;
		}
	}
</style>
