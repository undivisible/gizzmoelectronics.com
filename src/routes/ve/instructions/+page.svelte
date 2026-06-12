<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const renderSrc = '/ve/VE-Cosmetic%20design.1263.jpg';

	let temperature = $state(31);
	let booted = $state(false);

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
			<button
				type="button"
				class="temperature-overlay"
				aria-label="Temperature"
				onclick={() => changeTemperature(1)}
			>
				<strong class="temperature-value">{temperature}</strong>
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
		background: transparent;
		box-shadow: none;
		outline: none;
	}

	.temperature-overlay {
		position: absolute;
		left: 36.9%;
		top: 27.6%;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 20%;
		height: 28.4%;
		border: 0;
		border-radius: 999rem;
		background:
			radial-gradient(
				ellipse at 50% 52%,
				rgba(210, 49, 38, 0.98),
				rgba(165, 18, 15, 1) 54%,
				rgba(99, 8, 8, 0.88) 78%,
				rgba(41, 4, 4, 0) 100%
			),
			transparent;
		box-shadow:
			inset 0 0.18rem 0.26rem rgba(255, 196, 176, 0.16),
			inset 0 -0.16rem 0.22rem rgba(43, 2, 2, 0.42);
		padding: 0;
		cursor: pointer;
	}

	.temperature-value {
		position: absolute;
		left: 50%;
		top: 50%;
		color: #f9ffff;
		font:
			900 clamp(0.92rem, 2.52vw, 2.28rem) 'Arial Rounded MT Bold',
			'Arial Black',
			Helvetica,
			sans-serif;
		letter-spacing: -0.11em;
		line-height: 0.82;
		text-shadow:
			0 0 0.1rem rgba(255, 255, 255, 0.86),
			0 0 0.2rem rgba(42, 255, 248, 0.24),
			0.06rem 0.08rem 0 rgba(0, 0, 0, 0.62);
		transform: translate(-50%, -50%) scaleX(0.95);
	}

	@media (max-width: 760px) {
		.controller-stage {
			width: 150vw;
			transform: translateX(-10%);
		}
	}
</style>
