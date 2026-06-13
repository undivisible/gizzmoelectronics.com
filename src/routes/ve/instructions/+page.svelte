<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const renderSrc = '/ve/VE-Cosmetic%20design.1263.jpg';
	const screenSrc = '/ve/SWC-Symbol-RedNEW/StartwithGicons.bmp';
	const digitSegments: Record<string, string[]> = {
		'0': ['a', 'b', 'c', 'd', 'e', 'f'],
		'1': ['b', 'c'],
		'2': ['a', 'b', 'g', 'e', 'd'],
		'3': ['a', 'b', 'c', 'd', 'g'],
		'4': ['f', 'g', 'b', 'c'],
		'5': ['a', 'f', 'g', 'c', 'd'],
		'6': ['a', 'f', 'e', 'd', 'c', 'g'],
		'7': ['a', 'b', 'c'],
		'8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
		'9': ['a', 'b', 'c', 'd', 'f', 'g'],
	};

	let temperature = $state(31);
	let booted = $state(false);
	let temperatureDigits = $derived(String(temperature).padStart(2, '0'));

	function changeTemperature(direction: number) {
		temperature = Math.max(16, Math.min(32, temperature + direction));
	}

	function handleRightKnobWheel(event: WheelEvent) {
		event.preventDefault();
		changeTemperature(event.deltaY < 0 ? 1 : -1);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
			event.preventDefault();
			changeTemperature(1);
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
			event.preventDefault();
			changeTemperature(-1);
		}
	}

	onMount(() => {
		const requestedTemperatureParam = new URLSearchParams(
			window.location.search,
		).get('temp');
		const requestedTemperature = Number(requestedTemperatureParam);
		if (
			requestedTemperatureParam !== null &&
			Number.isFinite(requestedTemperature)
		) {
			temperature = Math.max(16, Math.min(32, requestedTemperature));
		}

		requestAnimationFrame(() => {
			booted = true;
		});
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
			<img class="screen-render" src={screenSrc} alt="" aria-hidden="true" />
			<button
				type="button"
				class="temperature-overlay"
				aria-label="Temperature"
				onclick={() => changeTemperature(1)}
			>
				<strong class="temperature-value">
					{#each temperatureDigits as digit, digitIndex (`${digit}-${digitIndex}`)}
						<span class="digit" aria-hidden="true">
							{#each ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as segment (segment)}
								<span
									class:lit={digitSegments[digit]?.includes(segment)}
									class={`segment segment-${segment}`}
								></span>
							{/each}
						</span>
					{/each}
					<span class="sr-only">{temperature}</span>
				</strong>
			</button>
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
		background: #000;
		box-shadow: none;
		outline: none;
	}

	.screen-render {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 50%;
		height: 100%;
		object-fit: fill;
		pointer-events: none;
		transform: translate(-50%, -68%) rotate(90deg);
		user-select: none;
		-webkit-user-drag: none;
	}

	.temperature-overlay {
		position: absolute;
		left: 40.4%;
		top: 19.9%;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 20%;
		height: 28.4%;
		border: 0;
		background: transparent;
		box-shadow: none;
		padding: 0;
		cursor: pointer;
	}

	.temperature-value {
		position: absolute;
		left: 50%;
		top: 50%;
		display: flex;
		gap: 8%;
		width: 82%;
		height: 82%;
		transform: translate(-50%, -50%);
	}

	.digit {
		position: relative;
		flex: 1 1 0;
		height: 100%;
	}

	.segment {
		position: absolute;
		display: block;
		background: rgba(87, 23, 18, 0.18);
		opacity: 0;
		filter: drop-shadow(0 0 0.03rem rgba(0, 0, 0, 0.42));
	}

	.segment.lit {
		background: #faffff;
		opacity: 1;
		box-shadow:
			0 0 0.08rem rgba(255, 255, 255, 0.8),
			0 0 0.16rem rgba(58, 255, 248, 0.32);
	}

	.segment-a,
	.segment-d,
	.segment-g {
		left: 17%;
		width: 66%;
		height: 10%;
		clip-path: polygon(11% 0, 89% 0, 100% 50%, 89% 100%, 11% 100%, 0 50%);
	}

	.segment-a {
		top: 0;
	}

	.segment-g {
		top: 45%;
	}

	.segment-d {
		bottom: 0;
	}

	.segment-b,
	.segment-c,
	.segment-e,
	.segment-f {
		width: 17%;
		height: 42%;
		clip-path: polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%);
	}

	.segment-b,
	.segment-c {
		right: 0;
	}

	.segment-e,
	.segment-f {
		left: 0;
	}

	.segment-b,
	.segment-f {
		top: 4%;
	}

	.segment-c,
	.segment-e {
		bottom: 4%;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	@media (max-width: 760px) {
		.controller-stage {
			width: 150vw;
			transform: translateX(-10%);
		}
	}
</style>
