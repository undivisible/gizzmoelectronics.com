<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { InstructionAsset } from '$lib/data/b1InstructionAssets';

	let { data }: { data: PageData } = $props();

	type ControllerScreen = {
		id: string;
		label: string;
		title: string;
		value: string;
		unit: string;
		status: string;
		accent: string;
		image: string;
		lines: string[];
	};

	let assets: InstructionAsset[] = $derived(data.assets);
	let groups: string[] = $derived(['All', ...data.groups]);

	function assetUrl(relativePath: string): string {
		return (
			assets.find((asset) => asset.relativePath === relativePath)?.url ??
			'/images/b1/instructions/logo.jpg'
		);
	}

	let screens: ControllerScreen[] = $derived([
		{
			id: 'home',
			label: 'Home',
			title: 'B1 live',
			value: '18.6',
			unit: 'psi',
			status: 'Memory 3 · closed loop',
			accent: '#3bb7ff',
			image: assetUrl('TheRest/Splash2.bmp'),
			lines: ['Peak hold armed', 'Solenoid duty 42%', 'Aux input nominal'],
		},
		{
			id: 'boost',
			label: 'Boost',
			title: 'Boost target',
			value: '22.4',
			unit: 'psi',
			status: 'Ramp by RPM and speed',
			accent: '#78d4ff',
			image: assetUrl('Bars/Base.bmp'),
			lines: ['Target table active', 'Gain 16', 'Overboost cut 26.0 psi'],
		},
		{
			id: 'mapping',
			label: 'Map',
			title: '2D map',
			value: '119',
			unit: 'kpa',
			status: 'High load cell selected',
			accent: '#80f2a8',
			image: assetUrl('TheRest/map119HIGH.bmp'),
			lines: ['RPM axis enabled', 'Speed trim enabled', 'Interpolation on'],
		},
		{
			id: 'solenoid',
			label: 'Sol',
			title: 'Solenoid',
			value: '42',
			unit: '%',
			status: 'MAC 3-port output',
			accent: '#f8d36b',
			image: assetUrl('TheRest/HiResSol.png'),
			lines: ['Frequency 31 hz', 'Duty limit 90%', 'Output test ready'],
		},
		{
			id: 'safety',
			label: 'Safety',
			title: 'Protection',
			value: 'ON',
			unit: '',
			status: 'AFR and knock watched',
			accent: '#ff7d5c',
			image: assetUrl('TheRest/Main Menu Images/safety.bmp'),
			lines: [
				'AFR cut enabled',
				'Knock warning enabled',
				'Reset requires press',
			],
		},
		{
			id: 'display',
			label: 'Display',
			title: 'Display setup',
			value: '65K',
			unit: 'colour',
			status: 'TFT display properties',
			accent: '#c58bff',
			image: assetUrl('TheRest/Main Menu Images/displaysetting.bmp'),
			lines: ['Top value peak boost', 'Bottom value duty', 'Night dim 48%'],
		},
		{
			id: 'inputs',
			label: 'Inputs',
			title: 'Input config',
			value: '4',
			unit: 'chan',
			status: 'MAP, AFR, knock, aux',
			accent: '#5ee6d2',
			image: assetUrl('TheRest/Main Menu Images/InputConfig.bmp'),
			lines: ['MAP sensor 6.9 bar', 'AFR petrol stoic', 'Aux input volts'],
		},
		{
			id: 'datalog',
			label: 'Log',
			title: 'Datalog',
			value: '20',
			unit: 'hz',
			status: 'Session buffer ready',
			accent: '#ff9dd1',
			image: assetUrl('TheRest/Datalog.bmp'),
			lines: [
				'Boost, RPM, duty',
				'AFR and knock optional',
				'Hold press to clear',
			],
		},
	]);

	const screenGrid = [
		{ screen: 0, label: 'Live' },
		{ screen: 1, label: 'Boost' },
		{ screen: 2, label: 'Map' },
		{ screen: 3, label: 'Sol' },
		{ screen: 4, label: 'Safety' },
		{ screen: 5, label: 'Display' },
		{ screen: 6, label: 'Inputs' },
		{ screen: 7, label: 'Log' },
	];

	let activeIndex = $state(0);
	let knobAngle = $state(18);
	let selectedGroup = $state('All');
	let assetQuery = $state('');
	let live = $state(false);

	let activeScreen = $derived(screens[activeIndex]);
	let visibleAssets = $derived(
		assets.filter((asset) => {
			const groupMatches =
				selectedGroup === 'All' || asset.group === selectedGroup;
			const query = assetQuery.trim().toLowerCase();
			const queryMatches =
				query === '' ||
				asset.name.toLowerCase().includes(query) ||
				asset.relativePath.toLowerCase().includes(query);

			return groupMatches && queryMatches;
		}),
	);

	function rotateKnob(direction: number) {
		activeIndex = (activeIndex + direction + screens.length) % screens.length;
		knobAngle += direction * 36;
	}

	function pressKnob() {
		knobAngle += 16;
		activeIndex = (activeIndex + 1) % screens.length;
	}

	function chooseScreen(index: number) {
		activeIndex = index;
		knobAngle = index * 36 + 18;
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		rotateKnob(event.deltaY > 0 ? 1 : -1);
	}

	onMount(() => {
		live = true;
	});
</script>

<svelte:head>
	<title>B1 Interactive Instructions | Gizzmo Electronics</title>
	<meta
		name="description"
		content="Interactive B1 boost controller instruction route built from the provided display, icon, map, and gauge images."
	/>
</svelte:head>

<section class="instructions-shell" class:live>
	<div class="hero-grid">
		<div class="intro-panel">
			<p class="eyebrow">B1 interactive instructions</p>
			<h1>Drive the controller instead of reading around it.</h1>
			<p class="intro-copy">
				Scroll over the knob, click the knob, or press the display hotspots to
				step through the B1-style menus, display modes, mapping, solenoid,
				safety, and input screens assembled from the instruction image set.
			</p>
			<div class="control-row" aria-label="Controller actions">
				<button type="button" onclick={() => rotateKnob(-1)}>Previous</button>
				<button type="button" class="primary" onclick={pressKnob}
					>Press knob</button
				>
				<button type="button" onclick={() => rotateKnob(1)}>Next</button>
			</div>
		</div>

		<div class="controller-stage" aria-label="Interactive B1 controller">
			<div class="device-frame">
				<img
					class="device-image"
					src={assetUrl('TheRest/display.bmp')}
					alt="B1 controller front render"
				/>
				<button
					type="button"
					class="screen-layer"
					aria-label="Cycle controller display"
					onclick={pressKnob}
				>
					<div class="screen-content" style={`--accent:${activeScreen.accent}`}>
						<div class="screen-topline">
							<span>{activeScreen.title}</span>
							<span>{activeScreen.status}</span>
						</div>
						<div class="screen-main">
							<img src={activeScreen.image} alt="" />
							<div>
								<strong>{activeScreen.value}</strong>
								<em>{activeScreen.unit}</em>
							</div>
						</div>
						<div class="screen-lines">
							{#each activeScreen.lines as line (line)}
								<span>{line}</span>
							{/each}
						</div>
					</div>
				</button>
				<button
					type="button"
					class="knob-target"
					aria-label="Rotate B1 knob"
					onclick={pressKnob}
					onwheel={handleWheel}
				>
					<span style={`transform:rotate(${knobAngle}deg)`}></span>
				</button>
			</div>
			<div class="screen-picker" aria-label="Screen shortcuts">
				{#each screenGrid as item (item.label)}
					<button
						type="button"
						class:active={activeIndex === item.screen}
						onclick={() => chooseScreen(item.screen)}
					>
						{item.label}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="instruction-layout">
		<aside class="menu-panel" aria-label="B1 menu tree">
			<p class="panel-label">Menu stack</p>
			{#each screens as screen, index (screen.id)}
				<button
					type="button"
					class:active={index === activeIndex}
					onclick={() => chooseScreen(index)}
				>
					<span style={`background:${screen.accent}`}></span>
					<strong>{screen.label}</strong>
					<em>{screen.title}</em>
				</button>
			{/each}
		</aside>

		<section class="detail-panel" style={`--accent:${activeScreen.accent}`}>
			<div>
				<p class="panel-label">Selected display</p>
				<h2>{activeScreen.title}</h2>
				<p>{activeScreen.status}</p>
			</div>
			<div class="detail-visual">
				<img src={activeScreen.image} alt={activeScreen.title} />
				<div>
					<strong>{activeScreen.value}</strong>
					<span>{activeScreen.unit}</span>
				</div>
			</div>
			<ul>
				{#each activeScreen.lines as line (line)}
					<li>{line}</li>
				{/each}
			</ul>
		</section>

		<section class="asset-panel">
			<div class="asset-heading">
				<div>
					<p class="panel-label">Instruction images</p>
					<h2>{assets.length} source assets</h2>
				</div>
				<input
					type="search"
					placeholder="Filter images"
					bind:value={assetQuery}
					aria-label="Filter instruction images"
				/>
			</div>

			<div class="group-tabs" aria-label="Instruction image groups">
				{#each groups as group (group)}
					<button
						type="button"
						class:active={group === selectedGroup}
						onclick={() => (selectedGroup = group)}
					>
						{group}
					</button>
				{/each}
			</div>

			<div class="asset-grid">
				{#each visibleAssets as asset (asset.relativePath)}
					<figure>
						<div>
							<img loading="lazy" src={asset.url} alt={asset.name} />
						</div>
						<figcaption>
							<strong>{asset.name}</strong>
							<span>{asset.relativePath}</span>
						</figcaption>
					</figure>
				{/each}
			</div>
		</section>
	</div>
</section>

<style>
	.instructions-shell {
		width: min(100%, 1180px);
		margin: 0 auto;
		color: #f8fafc;
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.5s ease,
			transform 0.5s ease;
	}

	.instructions-shell.live {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(280px, 0.72fr) minmax(420px, 1.28fr);
		gap: 2rem;
		align-items: center;
		min-height: calc(100vh - 8rem);
	}

	.intro-panel {
		border: 1px solid rgba(148, 163, 184, 0.28);
		background:
			linear-gradient(140deg, rgba(7, 12, 20, 0.94), rgba(19, 28, 43, 0.72)),
			radial-gradient(
				circle at 20% 0%,
				rgba(59, 183, 255, 0.28),
				transparent 32%
			);
		border-radius: 8px;
		padding: clamp(1.25rem, 3vw, 2.25rem);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
	}

	.eyebrow,
	.panel-label {
		margin: 0 0 0.75rem;
		color: #7dd3fc;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	h1,
	h2,
	p {
		margin-top: 0;
	}

	h1 {
		max-width: 10ch;
		margin-bottom: 1.2rem;
		font-size: clamp(3rem, 7vw, 6.5rem);
		line-height: 0.86;
		font-weight: 950;
		letter-spacing: 0;
	}

	h2 {
		margin-bottom: 0.5rem;
		font-size: clamp(1.6rem, 3vw, 2.6rem);
		line-height: 0.95;
		font-weight: 900;
		letter-spacing: 0;
	}

	.intro-copy {
		max-width: 44rem;
		color: #cbd5e1;
		font-size: 1rem;
		line-height: 1.65;
	}

	.control-row,
	.screen-picker,
	.group-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	button,
	input {
		font: inherit;
	}

	button {
		border: 1px solid rgba(148, 163, 184, 0.3);
		background: rgba(15, 23, 42, 0.82);
		color: #f8fafc;
		border-radius: 7px;
		cursor: pointer;
		transition:
			border-color 0.16s ease,
			background 0.16s ease,
			transform 0.16s ease;
	}

	button:hover,
	button:focus-visible {
		border-color: rgba(125, 211, 252, 0.86);
		background: rgba(30, 41, 59, 0.92);
		transform: translateY(-1px);
		outline: none;
	}

	.control-row button {
		min-height: 2.75rem;
		padding: 0 1rem;
		font-size: 0.85rem;
		font-weight: 800;
	}

	.control-row .primary {
		background: #f8fafc;
		color: #030712;
	}

	.controller-stage {
		display: grid;
		gap: 1rem;
	}

	.device-frame {
		position: relative;
		aspect-ratio: 1142 / 645;
		isolation: isolate;
	}

	.device-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 34px 62px rgba(0, 0, 0, 0.62));
	}

	.screen-layer {
		position: absolute;
		left: 21%;
		top: 21.6%;
		z-index: 3;
		width: 45.8%;
		height: 55%;
		padding: 0;
		border: 0;
		background: transparent;
		border-radius: 8px;
		transform: perspective(900px) rotateX(1deg) rotateY(-2deg) rotateZ(-0.4deg);
		overflow: hidden;
	}

	.screen-content {
		display: grid;
		grid-template-rows: auto 1fr auto;
		width: 100%;
		height: 100%;
		padding: clamp(0.45rem, 1.5vw, 1rem);
		background:
			linear-gradient(180deg, rgba(2, 6, 14, 0.82), rgba(1, 4, 9, 0.96)),
			radial-gradient(
				circle at 70% 24%,
				color-mix(in srgb, var(--accent), transparent 64%),
				transparent 42%
			);
		box-shadow: inset 0 0 18px rgba(125, 211, 252, 0.22);
	}

	.screen-topline,
	.screen-lines {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		color: #bae6fd;
		font-size: clamp(0.42rem, 1.1vw, 0.72rem);
		font-weight: 800;
		text-transform: uppercase;
	}

	.screen-main {
		display: grid;
		grid-template-columns: 0.95fr 1.05fr;
		gap: 0.75rem;
		align-items: center;
		min-width: 0;
	}

	.screen-main img {
		max-width: 100%;
		max-height: 8.5rem;
		margin: auto;
		object-fit: contain;
		image-rendering: auto;
	}

	.screen-main strong {
		display: block;
		color: var(--accent);
		font-size: clamp(2rem, 7vw, 5.5rem);
		line-height: 0.82;
		font-weight: 950;
		letter-spacing: 0;
		text-shadow: 0 0 22px color-mix(in srgb, var(--accent), transparent 45%);
	}

	.screen-main em {
		display: block;
		margin-top: 0.4rem;
		color: #f8fafc;
		font-style: normal;
		font-size: clamp(0.7rem, 1.8vw, 1.05rem);
		font-weight: 900;
		text-transform: uppercase;
	}

	.screen-lines {
		justify-content: flex-start;
		overflow: hidden;
		white-space: nowrap;
	}

	.knob-target {
		position: absolute;
		right: 5%;
		top: 35.5%;
		z-index: 4;
		width: 18%;
		aspect-ratio: 1;
		border: 0;
		border-radius: 999px;
		background: radial-gradient(
			circle at 38% 32%,
			rgba(255, 255, 255, 0.44),
			rgba(15, 18, 25, 0.18) 48%,
			rgba(0, 0, 0, 0.04)
		);
	}

	.knob-target span {
		position: absolute;
		inset: 18%;
		border-radius: 999px;
		background:
			linear-gradient(
				90deg,
				transparent 48%,
				rgba(255, 255, 255, 0.72) 49%,
				rgba(255, 255, 255, 0.72) 52%,
				transparent 53%
			),
			radial-gradient(circle at 35% 28%, #a7abb4, #2b2d34 54%, #0f1014);
		box-shadow:
			inset -12px -12px 22px rgba(0, 0, 0, 0.48),
			inset 8px 8px 16px rgba(255, 255, 255, 0.18),
			0 12px 22px rgba(0, 0, 0, 0.5);
		transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.screen-picker button,
	.group-tabs button {
		min-height: 2.25rem;
		padding: 0 0.8rem;
		font-size: 0.78rem;
		font-weight: 800;
	}

	.screen-picker button.active,
	.group-tabs button.active {
		border-color: #7dd3fc;
		background: #e0f2fe;
		color: #020617;
	}

	.instruction-layout {
		display: grid;
		grid-template-columns: minmax(210px, 0.55fr) minmax(280px, 0.85fr) minmax(
				420px,
				1.6fr
			);
		gap: 1rem;
		align-items: start;
		padding-bottom: 3rem;
	}

	.menu-panel,
	.detail-panel,
	.asset-panel {
		border: 1px solid rgba(148, 163, 184, 0.22);
		border-radius: 8px;
		background: rgba(8, 13, 23, 0.88);
		box-shadow: 0 18px 56px rgba(0, 0, 0, 0.26);
	}

	.menu-panel {
		position: sticky;
		top: 1rem;
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
	}

	.menu-panel button {
		display: grid;
		grid-template-columns: 0.65rem 2.8rem 1fr;
		gap: 0.65rem;
		align-items: center;
		min-height: 3rem;
		padding: 0.5rem 0.65rem;
		text-align: left;
	}

	.menu-panel button.active {
		border-color: #e0f2fe;
		background: rgba(224, 242, 254, 0.14);
	}

	.menu-panel button span {
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 999px;
	}

	.menu-panel strong,
	.menu-panel em {
		font-size: 0.76rem;
		line-height: 1.15;
		letter-spacing: 0;
	}

	.menu-panel em {
		color: #94a3b8;
		font-style: normal;
	}

	.detail-panel {
		display: grid;
		gap: 1rem;
		padding: 1.1rem;
	}

	.detail-panel p {
		color: #cbd5e1;
		line-height: 1.55;
	}

	.detail-visual {
		display: grid;
		grid-template-columns: minmax(7rem, 0.7fr) 1fr;
		gap: 1rem;
		align-items: center;
		min-height: 10rem;
		border-radius: 7px;
		background:
			linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.96)),
			radial-gradient(
				circle at 0% 0%,
				color-mix(in srgb, var(--accent), transparent 74%),
				transparent 42%
			);
		padding: 1rem;
	}

	.detail-visual img {
		max-width: 100%;
		max-height: 9rem;
		margin: auto;
		object-fit: contain;
	}

	.detail-visual strong {
		display: block;
		color: var(--accent);
		font-size: clamp(2.6rem, 6vw, 5rem);
		line-height: 0.9;
		font-weight: 950;
	}

	.detail-visual span {
		color: #e2e8f0;
		font-weight: 900;
		text-transform: uppercase;
	}

	.detail-panel ul {
		display: grid;
		gap: 0.55rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.detail-panel li {
		border-left: 3px solid var(--accent);
		background: rgba(15, 23, 42, 0.68);
		padding: 0.65rem 0.8rem;
		color: #dbeafe;
		font-size: 0.88rem;
	}

	.asset-panel {
		display: grid;
		gap: 1rem;
		padding: 1rem;
	}

	.asset-heading {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: start;
	}

	.asset-heading input {
		width: min(100%, 15rem);
		min-height: 2.5rem;
		border: 1px solid rgba(148, 163, 184, 0.32);
		border-radius: 7px;
		background: rgba(2, 6, 23, 0.74);
		color: #f8fafc;
		padding: 0 0.8rem;
		outline: none;
	}

	.asset-heading input:focus {
		border-color: #7dd3fc;
	}

	.group-tabs {
		max-height: 8rem;
		overflow: auto;
		padding-bottom: 0.2rem;
	}

	.asset-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
		gap: 0.75rem;
		max-height: 40rem;
		overflow: auto;
		padding-right: 0.25rem;
	}

	figure {
		min-width: 0;
		margin: 0;
		border: 1px solid rgba(148, 163, 184, 0.2);
		border-radius: 7px;
		background: rgba(2, 6, 23, 0.75);
		overflow: hidden;
	}

	figure div {
		display: grid;
		place-items: center;
		aspect-ratio: 1.24;
		background:
			linear-gradient(45deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.78)),
			repeating-linear-gradient(
				45deg,
				rgba(255, 255, 255, 0.04) 0 1px,
				transparent 1px 8px
			);
	}

	figure img {
		max-width: 86%;
		max-height: 86%;
		object-fit: contain;
		image-rendering: auto;
	}

	figcaption {
		display: grid;
		gap: 0.25rem;
		padding: 0.55rem;
	}

	figcaption strong {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.76rem;
		line-height: 1.15;
	}

	figcaption span {
		overflow-wrap: anywhere;
		color: #94a3b8;
		font-size: 0.64rem;
		line-height: 1.25;
	}

	@media (max-width: 1040px) {
		.hero-grid,
		.instruction-layout {
			grid-template-columns: 1fr;
		}

		.hero-grid {
			min-height: 0;
		}

		.menu-panel {
			position: relative;
			top: auto;
			grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		}
	}

	@media (max-width: 640px) {
		.instructions-shell {
			width: 100%;
		}

		.intro-panel {
			padding: 1rem;
		}

		h1 {
			max-width: 8ch;
			font-size: clamp(2.55rem, 16vw, 4rem);
		}

		.controller-stage {
			margin-inline: -1rem;
		}

		.screen-topline,
		.screen-lines {
			font-size: 0.42rem;
		}

		.screen-lines span:nth-child(n + 2) {
			display: none;
		}

		.asset-heading,
		.detail-visual {
			grid-template-columns: 1fr;
		}

		.asset-heading {
			display: grid;
		}
	}
</style>
