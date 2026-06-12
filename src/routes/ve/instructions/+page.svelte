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
	type TempSegment =
		| 'top'
		| 'leftTop'
		| 'rightTop'
		| 'middle'
		| 'leftBottom'
		| 'rightBottom'
		| 'bottom';

	const symbolBase = '/ve/SWC-Symbol-RedNEW/';
	const symbolEtcBase = `${symbolBase}transparent/SymbolsEtc/`;
	const tempDigitBase = `${symbolBase}transparent/Temp_Digits/`;
	const renderSrc = '/ve/VE-Cosmetic%20design.1263.jpg';
	const lcdOverlaySrc = '/ve/generated/lcd-overlay.png';
	const tempSegmentFiles: Record<TempSegment, string> = {
		top: 'Top.png',
		leftTop: 'Left_Top.png',
		rightTop: 'Right_Top.png',
		middle: 'Middle.png',
		leftBottom: 'Left_Bottom.png',
		rightBottom: 'Right_Bottom.png',
		bottom: 'Bottom.png',
	};
	const tempSegmentsByDigit: Record<string, TempSegment[]> = {
		'0': ['top', 'leftTop', 'rightTop', 'leftBottom', 'rightBottom', 'bottom'],
		'1': ['rightTop', 'rightBottom'],
		'2': ['top', 'rightTop', 'middle', 'leftBottom', 'bottom'],
		'3': ['top', 'rightTop', 'middle', 'rightBottom', 'bottom'],
		'4': ['leftTop', 'rightTop', 'middle', 'rightBottom'],
		'5': ['top', 'leftTop', 'middle', 'rightBottom', 'bottom'],
		'6': ['top', 'leftTop', 'middle', 'leftBottom', 'rightBottom', 'bottom'],
		'7': ['top', 'rightTop', 'rightBottom'],
		'8': [
			'top',
			'leftTop',
			'rightTop',
			'middle',
			'leftBottom',
			'rightBottom',
			'bottom',
		],
		'9': ['top', 'leftTop', 'rightTop', 'middle', 'rightBottom', 'bottom'],
	};
	let screens = $state<ClimateScreen[]>([
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
	]);

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

	function tempDigits(value: number) {
		return String(value).padStart(2, '0').split('');
	}

	function handleRightKnobWheel(event: WheelEvent) {
		event.preventDefault();
		changeTemperature(event.deltaY < 0 ? 1 : -1);
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
		<div
			class="right-knob-control"
			role="group"
			aria-label="Right temperature knob"
			onwheel={handleRightKnobWheel}
		>
			<button
				type="button"
				class="knob-half knob-up"
				aria-label="Increase temperature"
				onclick={() => changeTemperature(1)}
			></button>
			<button
				type="button"
				class="knob-half knob-down"
				aria-label="Decrease temperature"
				onclick={() => changeTemperature(-1)}
			></button>
		</div>

		<div class="controller-screen" aria-label="Interactive VE screen">
			<div class="screen-ui" aria-live="polite">
				<img class="lcd-art" src={lcdOverlaySrc} alt="" />
				<div class="screen-glow"></div>
				<div class="screen-grid">
					<img
						class="screen-backdrop screen-backdrop-low"
						src={`${symbolEtcBase}LowBackground.png`}
						alt=""
					/>
					<img
						class="screen-backdrop screen-backdrop-high"
						src={`${symbolEtcBase}highBackground.png`}
						alt=""
					/>
					<button
						type="button"
						class="screen-tile fresh"
						class:active={!activeScreen.recirc}
						aria-label="Fresh air"
						onclick={() => (activeScreen.recirc = false)}
					>
						<img src={`${symbolEtcBase}FreshSymbol.png`} alt="" />
					</button>
					<button
						type="button"
						class="screen-tile front"
						class:active={activeScreen.front}
						aria-label="Front demist"
						onclick={() => (activeScreen.front = !activeScreen.front)}
					>
						<img
							src={`${symbolEtcBase}${activeScreen.front ? 'Front_Demist_ON.png' : 'Front_Demist_OFF.png'}`}
							alt=""
						/>
					</button>
					<button
						type="button"
						class="screen-tile recirc"
						class:active={activeScreen.recirc}
						aria-label="Recirculation"
						onclick={() => (activeScreen.recirc = true)}
					>
						<img src={`${symbolEtcBase}RecircSymbol.png`} alt="" />
					</button>
					<div class="screen-core">
						<div class="fan-ring" aria-hidden="true"></div>
						<button
							type="button"
							class="temperature-orb"
							aria-label="Temperature"
							onclick={() => changeTemperature(1)}
						>
							<img
								class="mode-word"
								src={`${symbolEtcBase}${activeScreen.id === 'manual' ? 'ManualWording.png' : 'AutoWording.png'}`}
								alt=""
							/>
							<strong class="temperature-value">
								{activeScreen.temperature}
							</strong>
							<span class="temperature-digits" aria-hidden="true">
								{#each tempDigits(activeScreen.temperature) as digit, digitIndex (`${digit}-${digitIndex}`)}
									<span class="temperature-digit">
										{#each tempSegmentsByDigit[digit] as segment (segment)}
											<img
												class={`temperature-segment ${segment}`}
												src={`${tempDigitBase}${tempSegmentFiles[segment]}`}
												alt=""
											/>
										{/each}
									</span>
								{/each}
							</span>
							<span class="temperature-degree"></span>
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
							src={`${symbolEtcBase}${activeScreen.ac ? 'AC-Symbols.png' : 'AC-OFF-Symbols.png'}`}
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
						<img
							src={`${symbolEtcBase}${activeScreen.rear ? 'Rear_Demist_ON.png' : 'Rear_Demist_OFF.png'}`}
							alt=""
						/>
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

	.right-knob-control {
		position: absolute;
		left: 63.8%;
		top: 41.4%;
		z-index: 3;
		width: 18.4%;
		height: 30.2%;
		border-radius: 50%;
	}

	.knob-half {
		position: absolute;
		left: 0;
		width: 100%;
		height: 50%;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: ns-resize;
	}

	.knob-up {
		top: 0;
		border-radius: 999rem 999rem 0 0;
	}

	.knob-down {
		bottom: 0;
		border-radius: 0 0 999rem 999rem;
	}

	.controller-screen {
		position: absolute;
		left: 39.7%;
		top: 43.35%;
		width: 20.8%;
		height: 23.8%;
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
		background:
			linear-gradient(
				90deg,
				rgba(2, 21, 22, 0.98),
				rgba(12, 86, 87, 0.98) 24%,
				rgba(10, 56, 58, 0.98) 50%,
				rgba(9, 73, 74, 0.98) 76%,
				rgba(2, 22, 23, 0.98)
			),
			#041415;
		box-shadow:
			inset 0 0 0.55rem rgba(93, 255, 250, 0.34),
			0 0 0.34rem rgba(35, 255, 248, 0.22);
		overflow: hidden;
		text-transform: uppercase;
	}

	.lcd-art {
		position: absolute;
		inset: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		object-fit: fill;
		opacity: 1;
		pointer-events: none;
		user-select: none;
		-webkit-user-drag: none;
	}

	.screen-glow {
		position: absolute;
		inset: 12% 16%;
		z-index: 2;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(79, 255, 249, 0.13),
			rgba(7, 67, 70, 0.08) 48%,
			transparent 72%
		);
		filter: blur(0.28rem);
		opacity: 0;
	}

	.screen-grid {
		position: absolute;
		inset: 2% 3%;
		z-index: 3;
	}

	.screen-backdrop {
		position: absolute;
		z-index: 0;
		opacity: 0;
		image-rendering: pixelated;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.screen-backdrop-low {
		left: 18%;
		bottom: 1%;
		width: 64%;
	}

	.screen-backdrop-high {
		left: 24%;
		top: 0;
		width: 52%;
	}

	.screen-tile {
		position: absolute;
		display: grid;
		place-items: center;
		z-index: 3;
		width: 17%;
		height: 18%;
		border-radius: 0.08rem;
		background:
			linear-gradient(180deg, rgba(45, 194, 197, 0.34), rgba(2, 39, 41, 0.82)),
			rgba(5, 55, 58, 0.68);
		box-shadow:
			inset 0 0 0.18rem rgba(84, 255, 250, 0.36),
			0 0 0.18rem rgba(50, 255, 248, 0.32);
		opacity: 0;
	}

	.screen-tile.active,
	.screen-tile.fan-step {
		opacity: 0;
	}

	.screen-tile img {
		max-width: 100%;
		max-height: 100%;
		image-rendering: pixelated;
		filter: drop-shadow(0 0 0.18rem rgba(53, 255, 250, 0.72));
		mix-blend-mode: screen;
	}

	.screen-tile.fresh {
		left: 6%;
		top: 12%;
	}

	.screen-tile.front {
		right: 6%;
		top: 10%;
	}

	.screen-tile.recirc {
		left: 6.2%;
		bottom: 11%;
	}

	.screen-tile.ac {
		right: 6.4%;
		top: 41%;
	}

	.screen-tile.rear {
		right: 5.6%;
		bottom: 10%;
	}

	.screen-tile.fan-step {
		left: 7%;
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
		left: 30.6%;
		top: 11%;
		display: grid;
		place-items: center;
		z-index: 4;
		width: 38.2%;
		height: 76%;
	}

	.fan-ring {
		position: absolute;
		width: 104%;
		aspect-ratio: 1;
		border-radius: 50%;
		opacity: 0;
		background:
			radial-gradient(
				circle,
				transparent 42%,
				rgba(0, 0, 0, 0.72) 43% 47%,
				transparent 48%
			),
			repeating-conic-gradient(
				from -6deg,
				rgba(215, 218, 212, 0.92) 0deg 4.5deg,
				rgba(35, 38, 38, 0.92) 4.5deg 10deg
			);
		filter: drop-shadow(0 0 0.18rem rgba(18, 255, 248, 0.22));
	}

	.temperature-orb {
		position: relative;
		z-index: 5;
		display: grid;
		place-items: center;
		width: 70%;
		opacity: 1;
		aspect-ratio: 1;
		border: 0.12rem solid rgba(238, 240, 232, 0.96);
		border-radius: 50%;
		background:
			radial-gradient(
				circle at 50% 38%,
				#ffe7dc 0 8%,
				#ff7b5e 23%,
				#e22118 46%,
				#8b0805 74%,
				#4d0201 100%
			),
			#b9100c;
		box-shadow:
			inset 0 0 0.72rem rgba(255, 255, 255, 0.5),
			0 0 0.86rem rgba(255, 46, 31, 0.82);
		color: #fff;
		text-shadow: 0 0 0.44rem rgba(0, 0, 0, 0.8);
	}

	.mode-word {
		position: absolute;
		top: 17%;
		width: 38%;
		height: auto;
		image-rendering: pixelated;
		opacity: 0;
	}

	.temperature-value {
		position: absolute;
		left: 50%;
		top: 55.5%;
		color: transparent;
		font:
			900 clamp(0.88rem, 2.45vw, 2.16rem) 'Arial Rounded MT Bold',
			'Arial Black',
			Helvetica,
			sans-serif;
		letter-spacing: -0.08em;
		line-height: 0.82;
		text-shadow: none;
		transform: translate(-52%, -50%) scaleX(0.92);
	}

	.temperature-digits {
		position: absolute;
		left: 50%;
		top: 54%;
		display: flex;
		gap: 0.03rem;
		opacity: 1;
		transform: translate(-50%, -50%);
	}

	.temperature-digit {
		position: relative;
		display: block;
		width: clamp(0.54rem, 1.45vw, 1.3rem);
		aspect-ratio: 22 / 37;
	}

	.temperature-segment {
		position: absolute;
		image-rendering: pixelated;
		filter: drop-shadow(0 0 0.16rem rgba(255, 255, 255, 0.65));
	}

	.temperature-segment.top {
		left: 11%;
		top: 0;
		width: 78%;
	}

	.temperature-segment.leftTop {
		left: 0;
		top: 12%;
		width: 23%;
	}

	.temperature-segment.rightTop {
		right: 0;
		top: 12%;
		width: 23%;
	}

	.temperature-segment.middle {
		left: 12%;
		top: 45%;
		width: 76%;
	}

	.temperature-segment.leftBottom {
		left: 0;
		bottom: 13%;
		width: 23%;
	}

	.temperature-segment.rightBottom {
		right: 0;
		bottom: 11%;
		width: 23%;
	}

	.temperature-segment.bottom {
		left: 11%;
		bottom: 0;
		width: 78%;
	}

	.temperature-degree {
		position: absolute;
		right: 20.5%;
		top: 31%;
		width: 6%;
		aspect-ratio: 1;
		border: 0.08rem solid #f8ffff;
		border-radius: 50%;
		box-shadow: 0 0 0.18rem rgba(255, 255, 255, 0.75);
	}

	@media (max-width: 760px) {
		.controller-stage {
			width: 150vw;
			transform: translateX(-10%);
		}
	}
</style>
