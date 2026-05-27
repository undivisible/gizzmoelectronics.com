<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { InstructionAsset } from '$lib/data/b1InstructionAssets';

	let { data }: { data: PageData } = $props();

	type ScreenMode = 'live' | 'menu' | 'map' | 'status';
	type ControllerScreen = {
		id: string;
		label: string;
		title: string;
		value: string;
		unit: string;
		status: string;
		accent: string;
		image: string;
		mode: ScreenMode;
		lines: string[];
	};

	let assets: InstructionAsset[] = $derived(data.assets);

	function assetUrl(relativePath: string): string {
		return (
			assets.find((asset) => asset.relativePath === relativePath)?.url ??
			'/images/b1/instructions/logo.jpg'
		);
	}

	const menuItems = [
		{
			label: 'Map',
			screen: 'map',
			image: 'TheRest/map119.bmp',
			accent: '#70dcff',
		},
		{
			label: 'Sol',
			screen: 'solenoid',
			image: 'TheRest/Main Menu Images/Sol.bmp',
			accent: '#f8d36b',
		},
		{
			label: 'Input',
			screen: 'inputs',
			image: 'TheRest/Main Menu Images/InputConfig.bmp',
			accent: '#5ee6d2',
		},
		{
			label: 'Display',
			screen: 'display',
			image: 'TheRest/Main Menu Images/displaysetting.bmp',
			accent: '#c58bff',
		},
		{
			label: 'Safety',
			screen: 'safety',
			image: 'TheRest/Main Menu Images/safety.bmp',
			accent: '#ff7d5c',
		},
		{
			label: 'Log',
			screen: 'datalog',
			image: 'TheRest/Datalog.bmp',
			accent: '#ff9dd1',
		},
	];

	let screens: ControllerScreen[] = $derived([
		{
			id: 'live',
			label: 'Live',
			title: 'Boost',
			value: '18.6',
			unit: 'PSI',
			status: 'MEM 3',
			accent: '#3bb7ff',
			image: assetUrl('Bars/Base.bmp'),
			mode: 'live',
			lines: ['DUTY 42%', 'RPM TRIM ON', 'PEAK 22.4'],
		},
		{
			id: 'menu',
			label: 'Menu',
			title: 'Main Menu',
			value: '',
			unit: '',
			status: 'PUSH TO SELECT',
			accent: '#ffffff',
			image: assetUrl('TheRest/gears1.png'),
			mode: 'menu',
			lines: ['Rotate to move', 'Press knob to enter', 'Tap a screen icon'],
		},
		{
			id: 'map',
			label: 'Map',
			title: '2D Map',
			value: '119',
			unit: 'KPA',
			status: 'HIGH LOAD',
			accent: '#70dcff',
			image: assetUrl('TheRest/map119HIGH.bmp'),
			mode: 'map',
			lines: ['RPM axis active', 'Speed axis active', 'Interpolation enabled'],
		},
		{
			id: 'solenoid',
			label: 'Sol',
			title: 'Solenoid',
			value: '42',
			unit: '%',
			status: '31 HZ',
			accent: '#f8d36b',
			image: assetUrl('TheRest/HiResSol.png'),
			mode: 'status',
			lines: ['MAC 3-port output', 'Duty limit 90%', 'Output test ready'],
		},
		{
			id: 'inputs',
			label: 'Input',
			title: 'Input Config',
			value: '6.9',
			unit: 'BAR',
			status: 'MAP SENSOR',
			accent: '#5ee6d2',
			image: assetUrl('TheRest/Main Menu Images/InputConfig2.bmp'),
			mode: 'status',
			lines: ['AFR petrol stoic', 'Aux volts enabled', 'Knock module optional'],
		},
		{
			id: 'display',
			label: 'Display',
			title: 'Display',
			value: '65K',
			unit: 'TFT',
			status: 'DIM 48%',
			accent: '#c58bff',
			image: assetUrl('TheRest/Main Menu Images/displaysetting.bmp'),
			mode: 'status',
			lines: ['Top value boost', 'Bottom value duty', 'Night mode ready'],
		},
		{
			id: 'safety',
			label: 'Safety',
			title: 'Safety',
			value: 'ON',
			unit: '',
			status: 'AFR / KNOCK',
			accent: '#ff7d5c',
			image: assetUrl('TheRest/NewResetLARGE.bmp'),
			mode: 'status',
			lines: ['AFR cut enabled', 'Knock warning enabled', 'Hold to reset'],
		},
		{
			id: 'datalog',
			label: 'Log',
			title: 'Datalog',
			value: '20',
			unit: 'HZ',
			status: 'READY',
			accent: '#ff9dd1',
			image: assetUrl('TheRest/Datalog.bmp'),
			mode: 'status',
			lines: [
				'Boost, RPM, duty',
				'AFR and knock optional',
				'Clear with long press',
			],
		},
	]);

	let activeIndex = $state(0);
	let knobAngle = $state(18);
	let booted = $state(false);
	let activeScreen = $derived(screens[activeIndex]);
	let currentLine = $derived(activeScreen.lines.join('   ·   '));
	let stripAssets = $derived(
		assets
			.filter((asset) =>
				[
					'TheRest/Splash2.bmp',
					'Bars/Base.bmp',
					'TheRest/map119HIGH.bmp',
					'TheRest/HiResSol.png',
					'TheRest/Main Menu Images/InputConfig.bmp',
					'TheRest/Main Menu Images/displaysetting.bmp',
					'TheRest/Main Menu Images/safety.bmp',
					'TheRest/Datalog.bmp',
				].includes(asset.relativePath),
			)
			.slice(0, 8),
	);

	function indexFor(id: string): number {
		return Math.max(
			0,
			screens.findIndex((screen) => screen.id === id),
		);
	}

	function chooseScreen(index: number) {
		activeIndex = index;
		knobAngle = index * 39 + 18;
	}

	function chooseScreenId(id: string) {
		chooseScreen(indexFor(id));
	}

	function rotateKnob(direction: number) {
		chooseScreen((activeIndex + direction + screens.length) % screens.length);
		knobAngle += direction * 24;
	}

	function pressKnob() {
		if (activeScreen.id === 'live') {
			chooseScreenId('menu');
		} else if (activeScreen.id === 'menu') {
			chooseScreenId(menuItems[0].screen);
		} else {
			chooseScreenId('menu');
		}
		knobAngle += 18;
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		rotateKnob(event.deltaY > 0 ? 1 : -1);
	}

	onMount(() => {
		requestAnimationFrame(() => {
			booted = true;
		});
	});
</script>

<svelte:head>
	<title>B1 Instructions | Gizzmo Electronics</title>
	<meta
		name="description"
		content="A full-screen interactive B1 boost controller instruction simulator based on the supplied controller UI images."
	/>
</svelte:head>

<section class="b1-instructions" class:booted>
	<div class="instruction-bg" aria-hidden="true">
		<div></div>
		<div></div>
	</div>

	<div class="stage-copy">
		<p>B1 Instructions</p>
		<h1>Run it like the real controller.</h1>
	</div>

	<div class="controller-wrap">
		<div class="controller-shell" aria-label="Interactive B1 controller">
			<img
				class="controller-image"
				src="/images/b1/b1.png"
				alt="B1 controller"
			/>

			<div
				class="controller-screen"
				role="button"
				tabindex="0"
				aria-label="Controller screen. Press to change screen."
				onclick={pressKnob}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						pressKnob();
					}
				}}
			>
				<div class="screen-ui" style={`--accent:${activeScreen.accent}`}>
					<div class="screen-header">
						<span>{activeScreen.title}</span>
						<span>{activeScreen.status}</span>
					</div>

					{#if activeScreen.mode === 'menu'}
						<div class="controller-menu">
							{#each menuItems as item (item.label)}
								<button
									type="button"
									style={`--tile:${item.accent}`}
									onclick={(event) => {
										event.stopPropagation();
										chooseScreenId(item.screen);
									}}
								>
									<img src={assetUrl(item.image)} alt="" />
									<span>{item.label}</span>
								</button>
							{/each}
						</div>
					{:else if activeScreen.mode === 'map'}
						<div class="map-screen">
							<img src={activeScreen.image} alt="" />
							<div>
								<strong>{activeScreen.value}</strong>
								<em>{activeScreen.unit}</em>
							</div>
						</div>
					{:else}
						<div class="metric-screen">
							<div class="metric-asset">
								<img src={activeScreen.image} alt="" />
							</div>
							<div class="metric-value">
								<strong>{activeScreen.value}</strong>
								<em>{activeScreen.unit}</em>
							</div>
						</div>
					{/if}

					<div class="screen-footer">
						<span>{currentLine}</span>
					</div>
				</div>
			</div>

			<button
				type="button"
				class="knob"
				aria-label="B1 rotary knob"
				onclick={pressKnob}
				onwheel={handleWheel}
			>
				<span style={`transform:rotate(${knobAngle}deg)`}></span>
			</button>

			<div class="screen-hotspots" aria-label="Direct screen controls">
				{#each screens as screen, index (screen.id)}
					<button
						type="button"
						class:active={activeIndex === index}
						style={`--accent:${screen.accent}`}
						onclick={() => chooseScreen(index)}
					>
						{screen.label}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="control-rail">
		<button type="button" onclick={() => rotateKnob(-1)}>Prev</button>
		<button type="button" class="press" onclick={pressKnob}>Press</button>
		<button type="button" onclick={() => rotateKnob(1)}>Next</button>
	</div>

	<div class="image-strip" aria-label="B1 source UI images">
		{#each stripAssets as asset (asset.relativePath)}
			<img src={asset.url} alt={asset.name} />
		{/each}
	</div>
</section>

<style>
	.b1-instructions {
		position: relative;
		min-height: 100vh;
		width: 100%;
		overflow: hidden;
		background: #000;
		color: #fff;
		opacity: 0;
		transform: scale(1.025);
		transition:
			opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.b1-instructions.booted {
		opacity: 1;
		transform: scale(1);
	}

	.instruction-bg {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.instruction-bg div {
		position: absolute;
		width: 64vw;
		aspect-ratio: 1;
		border: 1px solid rgba(110, 198, 255, 0.22);
		border-radius: 50%;
		filter: blur(0.4px);
		opacity: 0.48;
	}

	.instruction-bg div:first-child {
		right: -24vw;
		top: -26vw;
		box-shadow:
			inset 0 0 90px rgba(59, 130, 246, 0.16),
			0 0 110px rgba(59, 130, 246, 0.11);
	}

	.instruction-bg div:last-child {
		left: -32vw;
		bottom: -36vw;
		box-shadow:
			inset 0 0 100px rgba(16, 185, 129, 0.12),
			0 0 130px rgba(59, 130, 246, 0.09);
	}

	.stage-copy {
		position: absolute;
		z-index: 6;
		left: clamp(1.2rem, 4vw, 4rem);
		top: clamp(1.2rem, 6vh, 4.5rem);
		max-width: min(34rem, 48vw);
		pointer-events: none;
	}

	.stage-copy p {
		margin: 0 0 0.7rem;
		color: #7dd3fc;
		font-size: 0.72rem;
		font-weight: 850;
		text-transform: uppercase;
	}

	.stage-copy h1 {
		margin: 0;
		font-size: clamp(3.25rem, 8.4vw, 9rem);
		font-weight: 950;
		line-height: 0.84;
		letter-spacing: 0;
	}

	.controller-wrap {
		position: relative;
		z-index: 4;
		display: grid;
		place-items: center;
		min-height: 100vh;
		padding: 15vh 4vw 12vh;
	}

	.controller-shell {
		position: relative;
		width: min(88vw, 1120px);
		aspect-ratio: 1016 / 460;
		transform: translateY(7vh);
	}

	.controller-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 38px 90px rgba(0, 0, 0, 0.85))
			drop-shadow(0 0 34px rgba(37, 99, 235, 0.16));
	}

	.controller-screen {
		position: absolute;
		left: 8.1%;
		top: 14.4%;
		z-index: 4;
		width: 54.2%;
		height: 63.4%;
		border: 0;
		border-radius: 22px;
		background: transparent;
		padding: 0;
		cursor: pointer;
		overflow: hidden;
	}

	.screen-ui {
		display: grid;
		grid-template-rows: auto 1fr auto;
		width: 100%;
		height: 100%;
		background:
			radial-gradient(
				circle at 50% 44%,
				rgba(45, 54, 70, 0.78),
				transparent 32%
			),
			linear-gradient(180deg, #02040b 0%, #000 100%);
		box-shadow:
			inset 0 0 20px color-mix(in srgb, var(--accent), transparent 70%),
			inset 0 0 1px rgba(255, 255, 255, 0.6);
		padding: clamp(0.42rem, 1.35vw, 0.95rem);
	}

	.screen-header,
	.screen-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		min-width: 0;
		color: #dff5ff;
		font-size: clamp(0.4rem, 1vw, 0.72rem);
		font-weight: 950;
		text-transform: uppercase;
		text-shadow: 0 0 10px rgba(125, 211, 252, 0.7);
	}

	.screen-footer {
		justify-content: flex-start;
		overflow: hidden;
		white-space: nowrap;
		color: color-mix(in srgb, var(--accent), white 42%);
	}

	.controller-menu {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(0.32rem, 1vw, 0.75rem);
		align-content: center;
		padding: clamp(0.4rem, 1vw, 0.85rem) 0;
	}

	.controller-menu button {
		display: grid;
		place-items: center;
		gap: 0.2rem;
		min-width: 0;
		min-height: clamp(2.5rem, 6vw, 4.8rem);
		border: 1px solid color-mix(in srgb, var(--tile), transparent 44%);
		border-radius: 8px;
		background:
			radial-gradient(
				circle at 50% 15%,
				color-mix(in srgb, var(--tile), transparent 70%),
				transparent 55%
			),
			linear-gradient(180deg, rgba(8, 13, 22, 0.86), rgba(0, 0, 0, 0.86));
		color: #fff;
		font-size: clamp(0.48rem, 1.2vw, 0.82rem);
		font-weight: 950;
		text-transform: uppercase;
		cursor: pointer;
	}

	.controller-menu img {
		max-width: 42%;
		max-height: clamp(1.15rem, 3vw, 2.4rem);
		object-fit: contain;
	}

	.metric-screen,
	.map-screen {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: clamp(0.5rem, 1.5vw, 1rem);
		align-items: center;
		min-height: 0;
	}

	.map-screen {
		grid-template-columns: 1.08fr 0.92fr;
	}

	.metric-asset,
	.map-screen > img {
		display: grid;
		place-items: center;
		min-width: 0;
	}

	.metric-asset img,
	.map-screen > img {
		max-width: 100%;
		max-height: clamp(4.5rem, 15vw, 10rem);
		object-fit: contain;
		filter: drop-shadow(
			0 0 22px color-mix(in srgb, var(--accent), transparent 58%)
		);
	}

	.metric-value strong,
	.map-screen strong {
		display: block;
		color: var(--accent);
		font-size: clamp(2.8rem, 8.5vw, 7rem);
		font-weight: 950;
		line-height: 0.78;
		text-align: right;
		text-shadow:
			0 0 10px color-mix(in srgb, var(--accent), transparent 20%),
			0 0 28px color-mix(in srgb, var(--accent), transparent 46%);
	}

	.metric-value em,
	.map-screen em {
		display: block;
		margin-top: 0.45rem;
		color: #fff;
		font-size: clamp(0.7rem, 1.8vw, 1.25rem);
		font-style: normal;
		font-weight: 950;
		text-align: right;
		text-transform: uppercase;
	}

	.knob {
		position: absolute;
		right: 6.1%;
		top: 19.3%;
		z-index: 5;
		width: 23.5%;
		aspect-ratio: 1;
		border: 0;
		border-radius: 999px;
		background: transparent;
		cursor: pointer;
	}

	.knob span {
		position: absolute;
		inset: 12%;
		border-radius: 999px;
		background:
			linear-gradient(
				90deg,
				transparent 48%,
				rgba(255, 255, 255, 0.88) 49%,
				rgba(255, 255, 255, 0.88) 52%,
				transparent 53%
			),
			repeating-radial-gradient(
				circle at 50% 50%,
				rgba(255, 255, 255, 0.12) 0 1px,
				transparent 1px 4px
			),
			radial-gradient(circle at 38% 30%, #91949b, #202126 58%, #090a0e);
		box-shadow:
			inset -10px -10px 24px rgba(0, 0, 0, 0.62),
			inset 7px 7px 15px rgba(255, 255, 255, 0.18),
			0 12px 24px rgba(0, 0, 0, 0.52);
		transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.screen-hotspots {
		position: absolute;
		left: 8.4%;
		top: 80.6%;
		z-index: 8;
		display: flex;
		width: 53.5%;
		gap: 0.35rem;
		justify-content: center;
	}

	.screen-hotspots button,
	.control-rail button {
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		background: rgba(1, 4, 12, 0.74);
		color: #fff;
		font-size: clamp(0.48rem, 1vw, 0.74rem);
		font-weight: 900;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			background 0.16s ease,
			border-color 0.16s ease,
			transform 0.16s ease;
	}

	.screen-hotspots button {
		min-width: 0;
		padding: 0.38rem 0.52rem;
	}

	.screen-hotspots button.active,
	.screen-hotspots button:hover {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent), rgba(1, 4, 12, 0.84) 72%);
		transform: translateY(-1px);
	}

	.control-rail {
		position: absolute;
		z-index: 10;
		right: clamp(1rem, 4vw, 4rem);
		bottom: clamp(1rem, 4vh, 3.5rem);
		display: flex;
		gap: 0.55rem;
	}

	.control-rail button {
		min-height: 2.6rem;
		padding: 0 1rem;
		backdrop-filter: blur(14px);
	}

	.control-rail .press {
		background: #fff;
		color: #020617;
	}

	.image-strip {
		position: absolute;
		z-index: 9;
		left: clamp(1rem, 4vw, 4rem);
		bottom: clamp(1rem, 4vh, 3.5rem);
		display: flex;
		max-width: min(45vw, 40rem);
		gap: 0.45rem;
		overflow: hidden;
	}

	.image-strip img {
		width: clamp(2.4rem, 5vw, 4.8rem);
		aspect-ratio: 1;
		object-fit: contain;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 7px;
		background: rgba(255, 255, 255, 0.04);
		padding: 0.25rem;
	}

	@media (max-width: 900px) {
		.stage-copy {
			position: relative;
			left: auto;
			top: auto;
			max-width: none;
			padding: 1.25rem 1rem 0;
		}

		.stage-copy h1 {
			font-size: clamp(3.4rem, 16vw, 5.8rem);
		}

		.controller-wrap {
			min-height: auto;
			padding: 2rem 0 9rem;
		}

		.controller-shell {
			width: 142vw;
			transform: translateX(-15vw);
		}

		.screen-hotspots {
			left: 8.5%;
			top: 82%;
			width: 53%;
			flex-wrap: wrap;
		}

		.control-rail {
			right: 1rem;
		}

		.image-strip {
			left: 1rem;
			max-width: calc(100vw - 11rem);
		}
	}

	@media (max-width: 560px) {
		.controller-shell {
			width: 190vw;
			transform: translateX(-32vw);
		}

		.screen-hotspots {
			display: none;
		}

		.image-strip {
			display: none;
		}
	}
</style>
