<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type ScreenMode = 'live' | 'menu' | 'values' | 'confirm' | 'splash';
	type RowTone = 'cyan' | 'white' | 'lime' | 'blue' | 'red';
	type MenuRow = {
		label: string;
		value?: string;
		tone?: RowTone;
		valueTone?: RowTone;
		selected?: boolean;
		target?: string;
	};
	type LiveState = {
		memory: string;
		rpm: string;
		psi: string;
		label: string;
	};
	type ControllerScreen = {
		id: string;
		label: string;
		title: string;
		mode: ScreenMode;
		accent: string;
		rows?: MenuRow[];
		live?: LiveState;
		footer?: string;
		icon?: 'gear' | 'warning' | 'turbo' | 'reset' | 'plug' | 'solenoid';
		source?: string;
	};
	type Glyph = {
		kind: 'image' | 'space' | 'fallback';
		src?: string;
		character?: string;
	};
	type SegmentName =
		| 'top'
		| 'topleft'
		| 'topright'
		| 'middle'
		| 'botleft'
		| 'botright'
		| 'bottom';

	const blue = '#78dcff';
	const lime = '#b7ff22';
	const white = '#f7fbff';
	const red = '#ff4e64';
	const memoryCount = 6;
	const holdDelayMs = 520;
	const wheelResetDelayMs = 320;
	const holdDotCount = 4;

	const imageBase = '/images/b1/instructions-png/';
	const segmentPartFiles: Record<SegmentName, string> = {
		top: '80high8Top',
		topleft: '80high8TopLeft',
		topright: '80high8TopRight',
		middle: '80high8Middle',
		botleft: '80high8BotLeft',
		botright: '80high8BotRight',
		bottom: '80high8Bottom',
	};
	function glyphSrc(character: string): string | undefined {
		const upper = character.toUpperCase();
		if (upper >= 'A' && upper <= 'Z') {
			return `${imageBase}a%20to%20z/${upper}.png`;
		}
		if (upper >= '0' && upper <= '9') {
			return `${imageBase}0%20to%209/${upper}.png`;
		}
		if (upper === '.') return `${imageBase}0%20to%209/dot.png`;
		if (upper === '-') return `${imageBase}0%20to%209/minus.png`;
		if (upper === '+') return `${imageBase}0%20to%209/plus.png`;
		if (upper === '%') return `${imageBase}0%20to%209/perc.png`;
		if (upper === ':') return `${imageBase}a%20to%20z/colon.png`;
		return undefined;
	}

	function glyphs(text: string): Glyph[] {
		return text.split('').map((character) => {
			if (character === ' ') return { kind: 'space' };
			const src = glyphSrc(character);
			if (src) return { kind: 'image', src, character };
			if (character === '…') {
				return { kind: 'image', src: glyphSrc('.') ?? '', character: '.' };
			}
			return { kind: 'fallback', character };
		});
	}

	function bigDigitSrc(character: string): string | undefined {
		if (character >= '0' && character <= '9') {
			return `${imageBase}0%20to%209/29pixHigh/BigCool${character}.png`;
		}
		if (character === '.') {
			return `${imageBase}0%20to%209/29pixHigh/BigCoolDot.png`;
		}
		return undefined;
	}

	function segmentDigitSrc(character: string): string | undefined {
		if (character === '.') {
			return `${imageBase}0%20to%209/29pixHigh/BigCoolDot.png`;
		}
		if (character >= '0' && character <= '9') {
			return `${imageBase}0%20to%209/29pixHigh/BigCool${character}.png`;
		}
		return undefined;
	}

	function segmentParts(character: string): SegmentName[] {
		if (character === '0') {
			return ['top', 'topleft', 'topright', 'botleft', 'botright', 'bottom'];
		}
		if (character === '8') {
			return [
				'top',
				'topleft',
				'topright',
				'middle',
				'botleft',
				'botright',
				'bottom',
			];
		}
		return [];
	}

	function segmentPartSrc(part: SegmentName): string {
		return `${imageBase}80pix%20High%207seg/${segmentPartFiles[part]}.png`;
	}

	function bigGlyphs(text: string): Glyph[] {
		return text.split('').map((character) => {
			if (character === ' ') return { kind: 'space' };
			const src = bigDigitSrc(character);
			if (src) return { kind: 'image', src, character };
			return { kind: 'fallback', character };
		});
	}

	function iconSrc(icon: ControllerScreen['icon']): string | undefined {
		if (icon === 'gear') return `${imageBase}TheRest/gears.png`;
		if (icon === 'warning')
			return `${imageBase}TheRest/Main%20Menu%20Images/safety.png`;
		if (icon === 'turbo') return `${imageBase}TheRest/Turbo.png`;
		if (icon === 'reset') return `${imageBase}TheRest/NewResetLARGE.png`;
		if (icon === 'plug')
			return `${imageBase}TheRest/Main%20Menu%20Images/InputConfig.png`;
		if (icon === 'solenoid')
			return `${imageBase}TheRest/Main%20Menu%20Images/Sol.png`;
		return undefined;
	}

	const screens: ControllerScreen[] = [
		{
			id: 'splash',
			label: 'Splash',
			title: 'B1',
			mode: 'splash',
			accent: white,
			footer: 'by Gizzmo',
			source: 'IMG_2781.jpeg',
		},
		{
			id: 'live',
			label: 'Live',
			title: 'MEMORY 1',
			mode: 'live',
			accent: blue,
			live: {
				memory: '1',
				rpm: '0',
				psi: '0.0',
				label: 'PSI',
			},
			footer: 'RPM 0',
			source: 'IMG_2760.jpeg',
		},
		{
			id: 'main',
			label: 'Main',
			title: 'MAIN MENU',
			mode: 'menu',
			accent: blue,
			rows: [
				{ label: 'DISPLAY', selected: true, target: 'display-values' },
				{ label: 'ENGINE SAFETY', target: 'engine-safety' },
				{ label: 'SYSTEM', target: 'system-menu' },
				{ label: 'AUX IN', target: 'aux-menu' },
				{ label: 'SOLENOID', target: 'solenoid-frequency' },
			],
			icon: 'gear',
			footer: 'PUSH TO SELECT',
			source: 'IMG_2761.jpeg',
		},
		{
			id: 'display-values',
			label: 'Display',
			title: 'DISPLAY VALUES',
			mode: 'menu',
			accent: blue,
			rows: [
				{ label: 'PRESSURE', selected: true, value: 'BAR', valueTone: 'lime' },
				{ label: 'PSI', value: 'VAC' },
				{ label: 'KPA', value: 'IN-HG' },
				{ label: 'NEXT', value: 'KPA', target: 'display-units' },
				{ label: 'BAR', value: 'PSI', valueTone: 'lime' },
			],
			footer: 'NEXT',
			source: 'IMG_2766.jpeg',
		},
		{
			id: 'display-units',
			label: 'Units',
			title: 'FREQ VOLTS CAL',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'VOLTS', value: 'PWM', valueTone: 'lime' },
				{ label: 'RAW', value: 'PERCENTAGE' },
				{ label: 'LIVE VOLTS 0.0V', tone: 'lime' },
			],
			source: 'IMG_2770.jpeg',
		},
		{
			id: 'system-menu',
			label: 'System',
			title: 'SYSTEM MENU',
			mode: 'menu',
			accent: blue,
			rows: [
				{ label: 'CLOCK', selected: true },
				{ label: 'SOL SENSOR', target: 'solenoid-frequency' },
				{ label: 'HARD RESET', target: 'hard-reset' },
				{ label: 'DIAGNOSTICS', target: 'diagnostics' },
			],
			icon: 'gear',
			footer: 'SYSTEM',
			source: 'IMG_2766.jpeg',
		},
		{
			id: 'solenoid-frequency',
			label: 'Sol',
			title: 'SOLENOID FREQUENCY',
			mode: 'values',
			accent: blue,
			rows: [{ label: '30 HZ', tone: 'white' }],
			icon: 'solenoid',
			source: 'IMG_2765.jpeg',
		},
		{
			id: 'engine-safety',
			label: 'Safety',
			title: 'ENGINE SAFETY',
			mode: 'menu',
			accent: blue,
			rows: [
				{ label: 'WARNING', selected: true, value: '1.24' },
				{ label: 'BOOST CUT', value: '1.36' },
				{ label: 'AUX OPT', value: 'OFF' },
			],
			icon: 'warning',
			source: 'IMG_2767.jpeg',
		},
		{
			id: 'offset-options',
			label: 'Offset',
			title: 'OFFSET OPTIONS',
			mode: 'menu',
			accent: blue,
			rows: [
				{
					label: 'TRIG MODE',
					selected: true,
					value: 'LATCHED',
					valueTone: 'lime',
				},
			],
			source: 'IMG_2779.jpeg',
		},
		{
			id: 'aux-menu',
			label: 'Aux',
			title: 'AUX IN MENU',
			mode: 'menu',
			accent: blue,
			rows: [
				{ label: 'OFF', selected: true },
				{ label: 'VOLTS OR PWM' },
				{ label: 'SPEED OR RPM' },
				{ label: 'OFFSET DUTY' },
				{ label: 'WIDEBAND' },
				{ label: 'KNOCK' },
			],
			icon: 'gear',
			source: 'IMG_2769.jpeg',
		},
		{
			id: 'wb-calibration',
			label: 'WB Cal',
			title: 'WB CALIBRATION',
			mode: 'values',
			accent: blue,
			rows: [
				{ label: 'LOW AFR', value: '7.35', selected: true },
				{ label: 'LOW VOLT', value: '0.00' },
				{ label: 'HIGH AFR', value: '22.39' },
				{ label: 'HIGH VOLT', value: '5.00' },
				{ label: 'LAMBDA', value: 'NFR', valueTone: 'lime' },
			],
			source: 'IMG_2787.jpeg',
		},
		{
			id: 'rpm-cal',
			label: 'RPM Cal',
			title: 'SPEED RPM CAL',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'RPM', selected: true, value: 'SPEED', valueTone: 'lime' },
				{ label: 'COMMON', value: 'CUSTOM' },
				{ label: '33.33HZ IS 1000RPM' },
				{ label: 'SHIFT RPM', value: '7000' },
				{ label: 'LIVE RPM', value: '0', valueTone: 'lime' },
			],
			source: 'IMG_2777.jpeg',
		},
		{
			id: 'speed-cal',
			label: 'Speed',
			title: 'SPEED RPM CAL',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'RPM', selected: true, value: 'SPEED', valueTone: 'lime' },
				{ label: 'COMMON', value: 'CUSTOM' },
				{ label: '33.4HZ IS 60KPH' },
				{ label: 'KPH', value: 'MPH', valueTone: 'lime' },
				{ label: 'LIVE SPEED', value: '0KPH', valueTone: 'lime' },
			],
			source: 'IMG_2778.jpeg',
		},
		{
			id: 'set-memory',
			label: 'Memory',
			title: 'SET MEMORY',
			mode: 'menu',
			accent: lime,
			rows: [
				{ label: 'DUTY SETUP', selected: true },
				{ label: 'GAIN', value: '10%' },
				{ label: 'ANTILAG', value: '10%' },
				{ label: 'GATE PIPES', value: '5.0' },
				{ label: 'OPTIONS...', target: 'set-options' },
			],
			icon: 'turbo',
			source: 'IMG_2783.jpeg',
		},
		{
			id: 'set-options',
			label: 'Options',
			title: 'SET OPTIONS',
			mode: 'menu',
			accent: lime,
			rows: [
				{ label: 'RETURN' },
				{
					label: 'LOG TYPE',
					selected: true,
					value: 'SINGLE',
					valueTone: 'lime',
				},
				{ label: 'MAX LOG TIME', value: '4 SEC' },
				{ label: 'BOOST TYPE', value: 'DIM' },
			],
			icon: 'turbo',
			source: 'IMG_2786.jpeg',
		},
		{
			id: 'map-selector',
			label: 'Maps',
			title: 'MAP SELECTOR',
			mode: 'menu',
			accent: lime,
			rows: [
				{ label: 'GIZZMO 30PSI', selected: true, tone: 'lime' },
				{ label: 'GIZZMO 60PSI' },
				{ label: 'BOSCH 076 3BAR' },
				{ label: 'BOSCH 119 3BAR' },
				{ label: 'CUSTOM' },
			],
			icon: 'plug',
			source: 'IMG_2768.jpeg',
		},
		{
			id: 'diagnostics',
			label: 'Diag',
			title: 'DIAGNOSTICS',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'MAP', value: '0.0V', valueTone: 'lime' },
				{ label: 'AUX', value: '0.0V' },
				{ label: 'BUTTON', value: 'UP', valueTone: 'lime' },
				{ label: 'KNOB', value: 'A   B', valueTone: 'lime' },
				{ label: 'FW 26-MAY-26' },
			],
			icon: 'plug',
			source: 'IMG_2784.jpeg',
		},
		{
			id: 'hard-reset',
			label: 'Reset',
			title: 'HARD RESET',
			mode: 'confirm',
			accent: red,
			rows: [
				{ label: 'RESET MEMORIES', selected: true },
				{ label: 'RESET SETTINGS' },
				{ label: 'RESET ALL' },
			],
			icon: 'reset',
			source: 'IMG_2782.jpeg',
		},
		{
			id: 'factory-reset',
			label: 'Factory',
			title: 'ENTER TO SET ALL DATA TO FACTORY DEFAULTS',
			mode: 'confirm',
			accent: blue,
			rows: [{ label: 'ESCAPE TO CANCEL' }],
			source: 'IMG_2781.jpeg',
		},
	];

	let activeIndex = $state(1);
	let knobAngle = $state(18);
	let booted = $state(false);
	let memoryIndex = $state(1);
	let memoryAdjusting = $state(false);
	let rowSelections = $state<Record<string, number>>({});
	let valueOverrides = $state<Record<string, string>>({});
	let editingRow = $state<{ screenId: string; rowIndex: number } | null>(null);
	let holdTimer: ReturnType<typeof setTimeout> | null = null;
	let holdProgressTimer: ReturnType<typeof setInterval> | null = null;
	let holdProgressDots = $state(0);
	let holdTriggered = false;
	let dragStartX = 0;
	let dragLastY = 0;
	let dragActive = false;
	let dragMoved = false;
	let wheelDeltaBuffer = 0;
	let lastWheelAt = 0;
	let activeScreen = $derived(screens[activeIndex]);
	let activeRowIndex = $derived(selectedRowIndex(activeScreen));
	let activeLive = $derived(
		activeScreen.live
			? {
					...activeScreen.live,
					memory: String(memoryIndex),
				}
			: undefined,
	);

	function indexFor(id: string): number {
		return Math.max(
			0,
			screens.findIndex((screen) => screen.id === id),
		);
	}

	function chooseScreen(index: number) {
		activeIndex = index;
		editingRow = null;
		memoryAdjusting = false;
		knobAngle = index * 31 + 18;
	}

	function chooseScreenId(id: string) {
		chooseScreen(indexFor(id));
	}

	function selectedRowIndex(screen: ControllerScreen): number {
		const rows = screen.rows ?? [];
		const stored = rowSelections[screen.id];
		if (stored !== undefined)
			return Math.min(stored, Math.max(0, rows.length - 1));
		const firstSelected = rows.findIndex((row) => row.selected);
		return firstSelected >= 0 ? firstSelected : 0;
	}

	function rowKey(screenId: string, rowIndex: number): string {
		return `${screenId}:${rowIndex}`;
	}

	function valueFor(
		screenId: string,
		rowIndex: number,
		row: MenuRow,
	): string | undefined {
		return valueOverrides[rowKey(screenId, rowIndex)] ?? row.value;
	}

	function valueOptions(row: MenuRow): string[] {
		const current = row.value ?? row.label;
		if (current.includes('%'))
			return ['0%', '5%', '10%', '15%', '20%', '30%', '40%', '50%'];
		if (
			current === 'BAR' ||
			current === 'PSI' ||
			current === 'KPA' ||
			current === 'VAC'
		) {
			return ['BAR', 'PSI', 'KPA', 'VAC', 'IN-HG'];
		}
		if (current === 'PWM' || current === 'PERCENTAGE')
			return ['PWM', 'PERCENTAGE', 'VOLTS', 'RAW'];
		if (current === 'SPEED' || current === 'RPM') return ['RPM', 'SPEED'];
		if (current === 'COMMON' || current === 'CUSTOM')
			return ['COMMON', 'CUSTOM'];
		if (current === 'SINGLE' || current === 'MULTI') return ['SINGLE', 'MULTI'];
		if (current === 'DIM' || current === 'BRIGHT')
			return ['DIM', 'BRIGHT', 'AUTO'];
		if (current === 'LATCHED' || current === 'MOMENTARY')
			return ['LATCHED', 'MOMENTARY'];
		if (current === 'OFF' || current === 'ON') return ['OFF', 'ON'];
		if (current.endsWith('SEC'))
			return ['1 SEC', '2 SEC', '4 SEC', '8 SEC', '10 SEC'];
		if (current.endsWith('KPH')) return ['0KPH', '20KPH', '60KPH', '100KPH'];
		if (/^\d+\.\d+$/.test(current))
			return ['0.00', '1.00', '1.24', '1.36', '5.00', '7.35', '22.39'];
		if (/^\d+$/.test(current))
			return ['0', '30', '60', '1000', '5000', '7000', '10000'];
		return [current];
	}

	function changeValue(direction: number) {
		if (!editingRow) return;
		const screen = screens[indexFor(editingRow.screenId)];
		const row = screen.rows?.[editingRow.rowIndex];
		if (!row) return;
		const options = valueOptions(row);
		const key = rowKey(screen.id, editingRow.rowIndex);
		const current = valueFor(screen.id, editingRow.rowIndex, row) ?? options[0];
		const currentIndex = Math.max(0, options.indexOf(current));
		valueOverrides[key] =
			options[(currentIndex + direction + options.length) % options.length];
	}

	function moveSelection(direction: number) {
		const rows = activeScreen.rows ?? [];
		if (!rows.length) {
			chooseScreen((activeIndex + direction + screens.length) % screens.length);
			return;
		}
		rowSelections[activeScreen.id] =
			(activeRowIndex + direction + rows.length) % rows.length;
	}

	function moveMemory(direction: number) {
		memoryIndex =
			((memoryIndex - 1 + direction + memoryCount) % memoryCount) + 1;
	}

	function rotateKnob(direction: number) {
		if (memoryAdjusting) {
			moveMemory(direction);
		} else if (editingRow) {
			changeValue(direction);
		} else {
			moveSelection(direction);
		}
		knobAngle += direction * 24;
	}

	function pressKnob() {
		if (editingRow) {
			editingRow = null;
			knobAngle += 18;
			return;
		}
		if (memoryAdjusting) {
			memoryAdjusting = false;
			knobAngle += 18;
			return;
		}
		const selected = activeScreen.rows?.[activeRowIndex];
		if (activeScreen.id === 'live' || activeScreen.id === 'splash') {
			chooseScreenId('main');
		} else if (selected?.target) {
			chooseScreenId(selected.target);
		} else if (selected?.label === 'RETURN') {
			chooseScreenId('main');
		} else if (selected) {
			editingRow = { screenId: activeScreen.id, rowIndex: activeRowIndex };
		} else {
			chooseScreenId('main');
		}
		knobAngle += 18;
	}

	function longPress() {
		holdTimer = null;
		if (holdProgressTimer) {
			clearInterval(holdProgressTimer);
			holdProgressTimer = null;
		}
		holdTriggered = true;
		holdProgressDots = holdDotCount;
		editingRow = null;
		if (activeScreen.id === 'live' || activeScreen.id === 'main') {
			chooseScreenId('set-memory');
			memoryAdjusting = true;
		} else {
			chooseScreenId('live');
		}
	}

	function startHold(event: PointerEvent) {
		holdTriggered = false;
		dragActive = true;
		dragMoved = false;
		holdProgressDots = 0;
		dragStartX = event.clientX;
		dragLastY = event.clientY;
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		if (holdTimer) clearTimeout(holdTimer);
		if (holdProgressTimer) clearInterval(holdProgressTimer);
		holdProgressTimer = setInterval(() => {
			holdProgressDots = Math.min(holdDotCount, holdProgressDots + 1);
		}, holdDelayMs / holdDotCount);
		holdTimer = setTimeout(longPress, holdDelayMs);
	}

	function endHold() {
		if (holdTimer) {
			clearTimeout(holdTimer);
			holdTimer = null;
		}
		if (holdProgressTimer) {
			clearInterval(holdProgressTimer);
			holdProgressTimer = null;
		}
		if (!holdTriggered) holdProgressDots = 0;
	}

	function cancelInteraction() {
		endHold();
		dragActive = false;
	}

	function releaseKnob() {
		endHold();
		dragActive = false;
		if (holdTriggered || dragMoved) {
			holdProgressDots = 0;
			return;
		}
		holdProgressDots = 0;
		pressKnob();
	}

	function dragTurn(event: PointerEvent) {
		if (!dragActive) return;
		const movedX = Math.abs(event.clientX - dragStartX);
		const movedY = event.clientY - dragLastY;
		if (movedX > 8 || Math.abs(movedY) > 8) {
			endHold();
			dragMoved = true;
		}
		if (Math.abs(movedY) > 18) {
			rotateKnob(movedY > 0 ? 1 : -1);
			dragLastY = event.clientY;
		}
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		const scaledDelta =
			event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
		const now = performance.now();
		if (now - lastWheelAt > wheelResetDelayMs) wheelDeltaBuffer = 0;
		lastWheelAt = now;

		if (Math.abs(scaledDelta) >= 85) {
			wheelDeltaBuffer = 0;
			rotateKnob(scaledDelta > 0 ? 1 : -1);
			return;
		}

		wheelDeltaBuffer += scaledDelta;
		if (Math.abs(wheelDeltaBuffer) >= 120) {
			rotateKnob(wheelDeltaBuffer > 0 ? 1 : -1);
			wheelDeltaBuffer = 0;
		}
	}

	function rowClick(row: MenuRow, index: number) {
		if (activeRowIndex !== index) {
			rowSelections[activeScreen.id] = index;
			editingRow = null;
			return;
		}
		if (row.target) {
			chooseScreenId(row.target);
		} else if (row.label === 'RETURN') {
			chooseScreenId('main');
		} else {
			editingRow = { screenId: activeScreen.id, rowIndex: index };
		}
	}

	onMount(() => {
		requestAnimationFrame(() => {
			booted = true;
		});
		const requestedScreen = new URLSearchParams(window.location.search).get(
			'screen',
		);
		if (
			requestedScreen &&
			screens.some((screen) => screen.id === requestedScreen)
		) {
			chooseScreenId(requestedScreen);
		}
	});

	onDestroy(() => {
		if (holdTimer) clearTimeout(holdTimer);
		if (holdProgressTimer) clearInterval(holdProgressTimer);
	});
</script>

{#snippet glyphText(text: string, tone: RowTone = 'white')}
	<span class={`glyph-text glyph-${tone}`} aria-label={text}>
		{#each glyphs(text) as glyph, index (`${text}-${index}`)}
			{#if glyph.kind === 'space'}
				<span class="glyph-space"></span>
			{:else if glyph.kind === 'image' && glyph.src}
				<img src={glyph.src} class:dot-glyph={glyph.character === '.'} alt="" />
			{:else}
				<span class="glyph-fallback">{glyph.character}</span>
			{/if}
		{/each}
	</span>
{/snippet}

{#snippet bigDigitText(text: string)}
	<span class="big-digit-text" aria-label={text}>
		{#each bigGlyphs(text) as glyph, index (`${text}-${index}`)}
			{#if glyph.kind === 'space'}
				<span class="big-digit-space"></span>
			{:else if glyph.kind === 'image' && glyph.src}
				<img src={glyph.src} class:dot-glyph={glyph.character === '.'} alt="" />
			{:else}
				<span class="big-digit-fallback">{glyph.character}</span>
			{/if}
		{/each}
	</span>
{/snippet}

{#snippet segmentDigitText(text: string)}
	<span class="segment-digit-text" aria-label={text}>
		{#each text.split('') as character, index (`${text}-${index}`)}
			{@const parts = segmentParts(character)}
			{#if character === ' '}
				<span class="big-digit-space"></span>
			{:else if parts.length}
				<span class="segment-digit">
					{#each parts as part (`${character}-${part}`)}
						<img
							class={`segment-part segment-${part}`}
							src={segmentPartSrc(part)}
							alt=""
						/>
					{/each}
				</span>
			{:else if character === '.'}
				<img src={segmentDigitSrc(character)} class="dot-glyph" alt="" />
			{:else}
				{@const src = segmentDigitSrc(character)}
				{#if src}
					<img {src} alt="" />
				{:else}
					<span class="big-digit-fallback">{character}</span>
				{/if}
			{/if}
		{/each}
	</span>
{/snippet}

<svelte:head>
	<title>B1 Interface | Gizzmo Electronics</title>
	<meta
		name="description"
		content="Interactive B1 boost controller interface simulator."
	/>
</svelte:head>

<section class="b1-instructions" class:booted>
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
				onpointerdown={startHold}
				onpointermove={dragTurn}
				onpointerup={releaseKnob}
				onpointerleave={endHold}
				onpointercancel={cancelInteraction}
				onwheel={handleWheel}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						pressKnob();
					} else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
						event.preventDefault();
						rotateKnob(-1);
					} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
						event.preventDefault();
						rotateKnob(1);
					}
				}}
			>
				<div
					class={`screen-ui mode-${activeScreen.mode}`}
					class:memory-active={memoryAdjusting}
					style={`--accent:${activeScreen.accent};--cyan:${blue};--lime:${lime};--screen-white:${white};--red:${red}`}
				>
					{#if holdProgressDots > 0}
						<div class="hold-progress" aria-hidden="true">
							{#each Array.from( { length: holdDotCount }, ) as _, index (`hold-dot-${index}`)}
								<span class:active={index < holdProgressDots}></span>
							{/each}
						</div>
					{/if}
					{#if activeScreen.mode === 'splash'}
						<div class="splash-screen">
							<img src={`${imageBase}TheRest/Splash_B.png`} alt="B1" />
							<img
								src={`${imageBase}TheRest/Splash_byGizzmo.png`}
								alt="by Gizzmo"
							/>
						</div>
					{:else if activeScreen.mode === 'live' && activeLive}
						<div class="live-screen" aria-label={`Memory ${activeLive.memory}`}>
							<img class="live-arc" src={`${imageBase}Bars/Base.png`} alt="" />
							<div class="live-memory-title">
								{@render glyphText(`MEMORY ${activeLive.memory}`, 'lime')}
							</div>
							<div class="live-rpm-label">
								{@render glyphText('RPM', 'cyan')}
							</div>
							<div class="live-rpm-value">
								{@render segmentDigitText(activeLive.rpm)}
							</div>
							<div class="live-unit">
								{@render glyphText(activeLive.label, 'cyan')}
							</div>
							<div class="live-pressure">
								{@render segmentDigitText(activeLive.psi)}
							</div>
							<div class="live-memory-rail">
								{@render glyphText(`MEMORY ${activeLive.memory}`, 'lime')}
							</div>
							<div class="live-memory-number">
								{@render bigDigitText(activeLive.memory)}
							</div>
						</div>
					{:else}
						<div class="menu-screen">
							<div class="screen-title">
								{@render glyphText(activeScreen.title, 'cyan')}
							</div>
							{#if activeScreen.icon}
								<img
									class={`screen-icon ${activeScreen.icon}`}
									src={iconSrc(activeScreen.icon) ?? ''}
									alt=""
								/>
							{/if}
							<div
								class="menu-rows"
								class:compact={(activeScreen.rows?.length ?? 0) > 4}
							>
								{#each activeScreen.rows ?? [] as row, index (`${activeScreen.id}-${row.label}-${index}`)}
									<button
										type="button"
										class:selected={index === activeRowIndex}
										class:clickable={Boolean(
											row.target || row.value || row.label === 'RETURN',
										)}
										class:editing={editingRow?.screenId === activeScreen.id &&
											editingRow.rowIndex === index}
										class={`row-tone-${row.tone ?? 'white'} value-tone-${row.valueTone ?? 'white'}`}
										onpointerdown={(event) => event.stopPropagation()}
										onpointerup={(event) => event.stopPropagation()}
										onpointercancel={(event) => event.stopPropagation()}
										onclick={(event) => {
											event.stopPropagation();
											rowClick(row, index);
										}}
									>
										<span class="selection-dot">
											<img src={`${imageBase}TheRest/BlueBall5px.png`} alt="" />
										</span>
										<span class="row-label"
											>{@render glyphText(row.label, row.tone ?? 'white')}</span
										>
										{#if valueFor(activeScreen.id, index, row)}
											<span class="row-value"
												>{@render glyphText(
													valueFor(activeScreen.id, index, row) ?? '',
													row.valueTone ?? 'white',
												)}</span
											>
										{/if}
									</button>
								{/each}
							</div>
							{#if activeScreen.footer}
								<div class="screen-footer">
									{@render glyphText(activeScreen.footer, 'cyan')}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<button
				type="button"
				class="knob"
				aria-label="B1 rotary knob"
				onpointerdown={startHold}
				onpointermove={dragTurn}
				onpointerup={releaseKnob}
				onpointerleave={endHold}
				onpointercancel={cancelInteraction}
				onwheel={handleWheel}
			>
				<span style={`transform:rotate(${knobAngle}deg)`}></span>
			</button>
		</div>
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

	.controller-wrap {
		position: relative;
		z-index: 4;
		display: grid;
		place-items: center;
		min-height: 100vh;
		padding: 4vh 4vw;
	}

	.controller-shell {
		position: relative;
		width: min(92vw, 1040px);
		aspect-ratio: 1016 / 460;
	}

	.controller-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 38px 90px rgba(0, 0, 0, 0.75));
	}

	.controller-screen {
		position: absolute;
		left: 10.45%;
		top: 20.9%;
		z-index: 4;
		width: 49.7%;
		height: 60%;
		border: 0;
		border-radius: 19px;
		background: transparent;
		padding: 0;
		cursor: pointer;
		overflow: hidden;
	}

	.controller-screen:focus,
	.knob:focus {
		outline: none;
	}

	.screen-ui {
		position: relative;
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, #050b18 0%, #020510 56%, #000 100%);
		box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.36);
		overflow: hidden;
	}

	.screen-ui.mode-live {
		background: linear-gradient(180deg, #01040c 0%, #000 58%, #01030a 100%);
		box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.42);
	}

	.hold-progress {
		position: absolute;
		left: 50%;
		top: 3.6%;
		z-index: 20;
		display: flex;
		gap: clamp(0.16rem, 0.38vw, 0.28rem);
		transform: translateX(-50%);
		pointer-events: none;
	}

	.hold-progress span {
		display: block;
		width: clamp(0.22rem, 0.5vw, 0.36rem);
		aspect-ratio: 1;
		border-radius: 999px;
		background: rgba(95, 166, 206, 0.24);
	}

	.hold-progress span.active {
		background: var(--cyan);
	}

	.glyph-text {
		display: inline-flex;
		align-items: center;
		gap: 1px;
		min-width: 0;
		line-height: 1;
		font-size: 0;
	}

	.glyph-text img {
		display: block;
		width: auto;
		height: clamp(0.58rem, 1.35vw, 1.04rem);
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
	}

	.glyph-text img.dot-glyph {
		align-self: flex-end;
		height: clamp(0.18rem, 0.42vw, 0.32rem);
		margin-bottom: clamp(0.1rem, 0.26vw, 0.2rem);
	}

	.glyph-space {
		display: block;
		width: clamp(0.24rem, 0.62vw, 0.46rem);
		height: 1px;
		flex: 0 0 auto;
	}

	.glyph-fallback {
		display: inline-block;
		color: var(--screen-white);
		font:
			900 clamp(0.58rem, 1.3vw, 1rem) Impact,
			sans-serif;
		line-height: 0.85;
	}

	.glyph-cyan img,
	.glyph-cyan .glyph-fallback {
		filter: none;
	}

	.glyph-lime img,
	.glyph-lime .glyph-fallback {
		filter: hue-rotate(-96deg) saturate(2.15) brightness(1.18);
	}

	.glyph-blue img,
	.glyph-blue .glyph-fallback {
		filter: hue-rotate(18deg) saturate(1.4);
	}

	.glyph-red img,
	.glyph-red .glyph-fallback {
		filter: hue-rotate(155deg) saturate(1.8);
	}

	.big-digit-text {
		display: inline-flex;
		align-items: flex-end;
		gap: clamp(0.08rem, 0.18vw, 0.16rem);
		font-size: 0;
		line-height: 1;
	}

	.big-digit-text img {
		display: block;
		width: auto;
		height: clamp(1.9rem, 6.6vw, 4.72rem);
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
	}

	.big-digit-text img.dot-glyph {
		height: clamp(0.26rem, 0.84vw, 0.6rem);
		margin-bottom: clamp(0.22rem, 0.7vw, 0.5rem);
	}

	.segment-digit-text {
		display: inline-flex;
		align-items: flex-end;
		gap: clamp(0.18rem, 0.42vw, 0.32rem);
		font-size: 0;
		line-height: 1;
	}

	.segment-digit-text img {
		display: block;
		width: auto;
		height: clamp(2.8rem, 8.1vw, 5.9rem);
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
	}

	.segment-digit {
		position: relative;
		display: inline-block;
		width: clamp(2.28rem, 6.55vw, 4.78rem);
		height: clamp(2.8rem, 8.1vw, 5.9rem);
		flex: 0 0 auto;
	}

	.segment-digit .segment-part {
		position: absolute;
		height: auto;
		image-rendering: pixelated;
		mix-blend-mode: screen;
	}

	.segment-top,
	.segment-middle,
	.segment-bottom {
		left: 15.4%;
		width: 69.2%;
	}

	.segment-top {
		top: 0;
	}

	.segment-middle {
		top: 43.6%;
	}

	.segment-bottom {
		bottom: 0;
	}

	.segment-topleft,
	.segment-topright,
	.segment-botleft,
	.segment-botright {
		width: 27.2%;
	}

	.segment-topleft,
	.segment-topright {
		top: 10.6%;
	}

	.segment-botleft,
	.segment-botright {
		bottom: 10.6%;
	}

	.segment-topleft,
	.segment-botleft {
		left: 0;
	}

	.segment-topright,
	.segment-botright {
		right: 0;
	}

	.segment-digit-text img.dot-glyph {
		height: clamp(0.3rem, 0.8vw, 0.58rem);
		margin-bottom: clamp(0.3rem, 0.78vw, 0.56rem);
	}

	.big-digit-space {
		width: clamp(0.2rem, 0.5vw, 0.42rem);
	}

	.big-digit-fallback {
		color: var(--screen-white);
		font:
			900 clamp(2.4rem, 8vw, 6rem) Impact,
			sans-serif;
		line-height: 0.78;
	}

	.splash-screen {
		display: grid;
		place-content: center;
		height: 100%;
		justify-items: center;
		gap: clamp(0.2rem, 0.7vw, 0.5rem);
	}

	.splash-screen img:first-child {
		width: min(42%, 11rem);
		image-rendering: pixelated;
		filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.78))
			drop-shadow(0 0 30px rgba(125, 211, 252, 0.52));
	}

	.splash-screen img:last-child {
		width: min(38%, 10rem);
		image-rendering: pixelated;
		filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.66));
	}

	.live-screen {
		position: relative;
		display: block;
		height: 100%;
		overflow: hidden;
	}

	.live-arc {
		position: absolute;
		left: -15.7%;
		top: 36.8%;
		width: 53.4%;
		height: auto;
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
		opacity: 0.94;
		transform: rotate(-5deg);
	}

	.live-memory-title {
		display: none;
	}

	.live-memory-title .glyph-text {
		gap: 0;
	}

	.live-memory-title .glyph-text img {
		height: clamp(0.7rem, 1.46vw, 1.08rem);
	}

	.live-rpm-label {
		position: absolute;
		right: 19.8%;
		top: 6.8%;
		z-index: 2;
	}

	.live-rpm-label .glyph-text img {
		height: clamp(0.72rem, 1.46vw, 1.08rem);
	}

	.live-rpm-value {
		position: absolute;
		right: 13.2%;
		top: 2.5%;
		z-index: 2;
	}

	.live-rpm-value .segment-digit-text {
		transform: scale(0.56);
		transform-origin: top right;
	}

	.live-memory-rail {
		position: absolute;
		right: -18.9%;
		top: 52.2%;
		z-index: 2;
		transform: rotate(-90deg);
		transform-origin: center;
	}

	.live-memory-rail .glyph-text {
		gap: 0;
	}

	.live-memory-rail .glyph-text img {
		height: clamp(1.06rem, 2.48vw, 1.8rem);
	}

	.live-memory-number {
		display: none;
	}

	.live-memory-number .big-digit-text img {
		height: clamp(1.7rem, 4.15vw, 3rem);
	}

	.live-unit {
		position: absolute;
		left: 8.4%;
		top: 73.4%;
		z-index: 2;
	}

	.live-unit .glyph-text img {
		height: clamp(0.58rem, 1.2vw, 0.9rem);
	}

	.live-pressure {
		position: absolute;
		right: 12.6%;
		top: 32.5%;
		z-index: 2;
	}

	.live-pressure .segment-digit-text {
		gap: clamp(0.1rem, 0.22vw, 0.18rem);
	}

	.live-pressure .segment-digit-text img.dot-glyph {
		height: clamp(0.3rem, 0.82vw, 0.58rem);
		margin-bottom: clamp(0.26rem, 0.7vw, 0.52rem);
	}

	.memory-active .live-memory-rail,
	.memory-active .screen-title {
		animation: memory-pulse 0.82s steps(2, jump-none) infinite;
	}

	.menu-screen {
		position: relative;
		display: block;
		height: 100%;
	}

	.screen-title {
		position: absolute;
		left: 3.9%;
		top: 3.7%;
		z-index: 3;
		display: flex;
		align-items: center;
		max-width: 91%;
		overflow: visible;
	}

	.screen-title .glyph-text {
		white-space: nowrap;
		gap: 0;
	}

	.screen-title .glyph-text img {
		height: clamp(0.7rem, 1.5vw, 1.12rem);
	}

	.screen-title .glyph-space {
		width: clamp(0.32rem, 0.74vw, 0.56rem);
	}

	.menu-rows {
		position: absolute;
		left: 4.5%;
		top: 25.6%;
		right: 4.4%;
		bottom: 12.8%;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: clamp(0.01rem, 0.08vw, 0.05rem);
		min-width: 0;
	}

	.menu-rows.compact {
		top: 24.4%;
		gap: 0;
	}

	.menu-rows button {
		display: grid;
		grid-template-columns: clamp(0.32rem, 0.68vw, 0.5rem) minmax(0, 1fr) auto;
		align-items: center;
		min-width: 0;
		height: clamp(0.9rem, 2.08vw, 1.5rem);
		border: 0;
		background: transparent;
		padding: 0;
		cursor: default;
	}

	.menu-rows button .glyph-text img {
		height: clamp(0.76rem, 1.66vw, 1.2rem);
	}

	.menu-rows.compact button .glyph-text img {
		height: clamp(0.66rem, 1.42vw, 1.02rem);
	}

	.mode-values .menu-rows {
		top: 19.8%;
		bottom: 7%;
	}

	.mode-values .menu-rows.compact,
	.mode-confirm .menu-rows.compact {
		top: 19.8%;
	}

	.mode-confirm .menu-rows {
		top: 27.5%;
	}

	.menu-rows button.clickable {
		cursor: pointer;
	}

	.menu-rows button.editing .row-label,
	.menu-rows button.editing .row-value {
		animation: memory-pulse 0.82s steps(2, jump-none) infinite;
	}

	.selection-dot {
		display: grid;
		place-items: center;
		width: clamp(0.32rem, 0.68vw, 0.5rem);
	}

	.selection-dot img {
		display: block;
		width: clamp(0.18rem, 0.4vw, 0.3rem);
		height: auto;
		opacity: 0;
		image-rendering: pixelated;
	}

	.menu-rows button.selected .selection-dot img {
		opacity: 1;
	}

	.row-label,
	.row-value {
		display: flex;
		min-width: 0;
		white-space: nowrap;
	}

	.row-value {
		padding-left: clamp(0.18rem, 0.48vw, 0.38rem);
		text-align: right;
	}

	.screen-footer {
		position: absolute;
		right: 3.9%;
		bottom: 4.7%;
		display: flex;
		justify-content: flex-end;
	}

	.screen-footer .glyph-text img {
		height: clamp(0.5rem, 1.02vw, 0.78rem);
	}

	.screen-icon {
		position: absolute;
		right: 4.8%;
		top: 8.4%;
		z-index: 1;
		width: clamp(1.2rem, 3vw, 2.25rem);
		height: clamp(1.2rem, 3vw, 2.25rem);
		object-fit: contain;
		image-rendering: pixelated;
		opacity: 0.95;
	}

	.screen-icon.warning {
		filter: none;
	}

	.knob {
		position: absolute;
		right: 8.45%;
		top: 21.6%;
		z-index: 5;
		width: 23.2%;
		aspect-ratio: 1;
		border: 0;
		border-radius: 999px;
		background: transparent;
		cursor: pointer;
	}

	.knob span {
		display: none;
	}

	@keyframes memory-pulse {
		50% {
			opacity: 0.55;
		}
	}

	@media (max-width: 900px) {
		.controller-wrap {
			min-height: 100vh;
			padding: 2rem 0;
		}

		.controller-shell {
			width: 142vw;
			transform: translateX(-15vw);
		}
	}

	@media (max-width: 560px) {
		.controller-shell {
			width: 190vw;
			transform: translateX(-32vw);
		}
	}
</style>
