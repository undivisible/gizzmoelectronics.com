<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type ScreenMode = 'live' | 'menu' | 'values' | 'confirm' | 'splash';
	type RowTone = 'cyan' | 'white' | 'lime' | 'blue' | 'red';
	type RowAction = 'navigate' | 'toggle' | 'adjust' | 'none';
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
		icon?:
			| 'gear'
			| 'warning'
			| 'turbo'
			| 'reset'
			| 'plug'
			| 'solenoid'
			| 'stethoscope';
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
		top: 'top',
		topleft: 'topleft',
		topright: 'topright',
		middle: 'middle',
		botleft: 'botleft',
		botright: 'botright',
		bottom: 'bottom',
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
		const digits: Record<string, SegmentName[]> = {
			'0': ['top', 'topleft', 'topright', 'botleft', 'botright', 'bottom'],
			'1': ['topright', 'botright'],
			'2': ['top', 'topright', 'middle', 'botleft', 'bottom'],
			'3': ['top', 'topright', 'middle', 'botright', 'bottom'],
			'4': ['topleft', 'topright', 'middle', 'botright'],
			'5': ['top', 'topleft', 'middle', 'botright', 'bottom'],
			'6': ['top', 'topleft', 'middle', 'botleft', 'botright', 'bottom'],
			'7': ['top', 'topright', 'botright'],
			'8': [
				'top',
				'topleft',
				'topright',
				'middle',
				'botleft',
				'botright',
				'bottom',
			],
			'9': ['top', 'topleft', 'topright', 'middle', 'botright', 'bottom'],
		};
		return digits[character] ?? [];
	}

	function segmentPartSrc(part: SegmentName): string {
		return `${imageBase}100pix%207seg/${segmentPartFiles[part]}.png`;
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
		if (icon === 'stethoscope')
			return `${imageBase}TheRest/stethoscopeSMALL.png`;
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
			source: 'IMG_2784.jpeg',
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
				{ label: 'DISPLAY', target: 'display-values' },
				{ label: 'ENGINE SAFETY', selected: true, target: 'engine-safety' },
				{ label: 'SYSTEM', target: 'system-menu' },
				{ label: 'AUX IN', target: 'aux-menu' },
				{ label: 'SOLENOID', target: 'solenoid-options' },
			],
			icon: 'gear',
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
			source: 'IMG_2763.jpeg',
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
				{ label: 'LIVE VOLTS 0.0V', tone: 'lime', target: 'freq-volts-live' },
			],
			source: 'IMG_2770.jpeg',
		},
		{
			id: 'freq-volts-live',
			label: 'Freq Live',
			title: 'FREQ VOLTS CAL',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'VOLTS', selected: true, value: 'PWM', valueTone: 'lime' },
				{ label: 'RAW', value: 'PERCENTAGE' },
				{ label: 'LIVE VOLTS 0.0V', tone: 'lime' },
			],
			source: 'IMG_2771.jpeg',
		},
		{
			id: 'freq-volts-duty',
			label: 'Freq Duty',
			title: 'FREQ VOLTS CAL',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'VOLTS', selected: true, value: 'PWM', valueTone: 'lime' },
				{ label: 'MSEC', value: 'DUTY' },
				{ label: 'SAMPLE HIGH LOW' },
				{ label: 'VOLT THRESH 2.4V' },
				{ label: 'LIVE PWM', value: '0.0MS', valueTone: 'lime' },
			],
			source: 'IMG_2772.jpeg',
		},
		{
			id: 'freq-volts-raw',
			label: 'Freq Raw',
			title: 'FREQ VOLTS CAL',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'VOLTS', selected: true, value: 'PWM', valueTone: 'lime' },
				{ label: 'RAW', value: 'PERCENTAGE' },
				{ label: 'LIVE VOLTS 0.0V', tone: 'lime' },
			],
			source: 'IMG_2773.jpeg',
		},
		{
			id: 'freq-volts-percent',
			label: 'Freq Percent',
			title: 'FREQ VOLTS CAL',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'VOLTS', selected: true, value: 'PWM', valueTone: 'lime' },
				{ label: 'RAW', value: 'PERCENTAGE' },
				{ label: '0% IS 0.0 VOLTS' },
				{ label: '100% IS 5.0 VOLTS' },
				{ label: 'LIVE PERC', value: '0%', valueTone: 'lime' },
			],
			source: 'IMG_2774.jpeg',
		},
		{
			id: 'system-menu',
			label: 'System',
			title: 'SYSTEM MENU',
			mode: 'menu',
			accent: blue,
			rows: [
				{ label: 'SOL CHECK', selected: true, target: 'solenoid-frequency' },
				{ label: 'MAP SENSOR', target: 'map-selector' },
				{ label: 'HARD RESET', target: 'hard-reset' },
				{ label: 'DIAGNOSTICS', target: 'diagnostics' },
			],
			icon: 'solenoid',
			source: 'IMG_2767.jpeg',
		},
		{
			id: 'solenoid-options',
			label: 'Sol',
			title: 'SOLENOID FREQ',
			mode: 'values',
			accent: blue,
			rows: [
				{ label: 'FREQUENCY', selected: true, value: 'PWM', valueTone: 'lime' },
				{ label: 'MODE', value: 'OPEN' },
				{ label: 'DUTY', value: '30HZ', target: 'solenoid-frequency' },
			],
			icon: 'solenoid',
			source: 'IMG_2765.jpeg',
		},
		{
			id: 'solenoid-frequency',
			label: 'Sol Hz',
			title: 'SOLENOID FREQUENCY',
			mode: 'values',
			accent: blue,
			rows: [{ label: '30 HZ', tone: 'white' }],
			icon: 'solenoid',
			source: 'IMG_2769.jpeg',
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
			source: 'IMG_2766.jpeg',
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
			id: 'offset-duty',
			label: 'Offset Duty',
			title: 'OFFSET DUTY',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'IF VOLTAGE IS...' },
				{ label: 'ABOVE', selected: true, value: 'BELOW', valueTone: 'lime' },
				{ label: '5.0 VOLTS' },
				{ label: 'ADD', value: 'SUBTRACT', valueTone: 'lime' },
				{
					label: '10%',
					value: 'MORE...',
					valueTone: 'lime',
					target: 'offset-duty-more',
				},
			],
			source: 'IMG_2777.jpeg',
		},
		{
			id: 'offset-duty-more',
			label: 'Offset More',
			title: 'OFFSET DUTY',
			mode: 'values',
			accent: lime,
			rows: [
				{ label: 'IF VOLTAGE IS...' },
				{ label: 'ABOVE', selected: true, value: 'BELOW', valueTone: 'lime' },
				{ label: '5.0 VOLTS' },
				{ label: 'ADD', value: 'SUBTRACT', valueTone: 'lime' },
				{ label: '10%', value: 'MORE...', valueTone: 'lime' },
			],
			source: 'IMG_2778.jpeg',
		},
		{
			id: 'aux-menu',
			label: 'Aux',
			title: 'AUX IN MENU',
			mode: 'menu',
			accent: blue,
			rows: [
				{ label: 'OFF', selected: true },
				{ label: 'VOLTS OR PWM', target: 'display-units' },
				{ label: 'SPEED OR RPM', target: 'rpm-cal' },
				{ label: 'OFFSET DUTY', target: 'offset-duty' },
				{ label: 'WIDEBAND', target: 'wb-calibration' },
				{ label: 'KNOCK' },
			],
			icon: 'gear',
			source: 'IMG_2768.jpeg',
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
			source: 'IMG_2775.jpeg',
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
			source: 'IMG_2776.jpeg',
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
			source: 'IMG_2785.jpeg',
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
			source: 'IMG_2780.jpeg',
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
			icon: 'stethoscope',
			source: 'IMG_2781.jpeg',
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
			title: 'ENTER TO SET ALL',
			mode: 'confirm',
			accent: blue,
			rows: [
				{ label: 'DATA TO FACTORY' },
				{ label: 'DEFAULTS' },
				{ label: 'ESCAPE TO CANCEL', selected: true },
			],
			source: 'IMG_2783.jpeg',
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
	let dragLastX = 0;
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
		if (row.value === undefined) return undefined;
		return valueOverrides[rowKey(screenId, rowIndex)] ?? row.value;
	}

	function labelFor(screenId: string, rowIndex: number, row: MenuRow): string {
		if (row.value !== undefined) return row.label;
		return valueOverrides[rowKey(screenId, rowIndex)] ?? row.label;
	}

	function currentOptionFor(
		screenId: string,
		rowIndex: number,
		row: MenuRow,
	): string {
		return valueOverrides[rowKey(screenId, rowIndex)] ?? row.value ?? row.label;
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
		if (current === 'ABOVE' || current === 'BELOW') return ['ABOVE', 'BELOW'];
		if (current === 'ADD' || current === 'SUBTRACT') return ['ADD', 'SUBTRACT'];
		if (current === 'LAMBDA' || current === 'NFR') return ['LAMBDA', 'NFR'];
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

	function rowAction(row: MenuRow): RowAction {
		if (row.target || row.label === 'RETURN') return 'navigate';
		const options = valueOptions(row);
		if (options.length <= 1) return 'none';
		return options.some((option) => /\d/.test(option)) ? 'adjust' : 'toggle';
	}

	function changeRowValue(
		screen: ControllerScreen,
		rowIndex: number,
		direction: number,
	) {
		const row = screen.rows?.[rowIndex];
		if (!row) return;
		const options = valueOptions(row);
		if (options.length <= 1) return;
		const key = rowKey(screen.id, rowIndex);
		const current = currentOptionFor(screen.id, rowIndex, row);
		const currentIndex = Math.max(0, options.indexOf(current));
		valueOverrides[key] =
			options[(currentIndex + direction + options.length) % options.length];
	}

	function changeValue(direction: number) {
		if (!editingRow) return;
		const screen = screens[indexFor(editingRow.screenId)];
		changeRowValue(screen, editingRow.rowIndex, direction);
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
		} else if (selected) {
			const action = rowAction(selected);
			if (selected.target) {
				chooseScreenId(selected.target);
			} else if (selected.label === 'RETURN') {
				chooseScreenId('main');
			} else if (action === 'toggle') {
				changeRowValue(activeScreen, activeRowIndex, 1);
			} else if (action === 'adjust') {
				editingRow = { screenId: activeScreen.id, rowIndex: activeRowIndex };
			} else {
				editingRow = null;
			}
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
		if (activeScreen.id === 'live') {
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
		dragLastX = event.clientX;
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
		const stepX = event.clientX - dragLastX;
		const movedY = event.clientY - dragLastY;
		if (movedX > 8 || Math.abs(movedY) > 8) {
			endHold();
			dragMoved = true;
		}
		if (Math.abs(stepX) > 18 || Math.abs(movedY) > 18) {
			const useHorizontal = Math.abs(stepX) > Math.abs(movedY);
			rotateKnob(useHorizontal ? (stepX > 0 ? 1 : -1) : movedY > 0 ? 1 : -1);
			dragLastX = event.clientX;
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
		if (
			editingRow?.screenId === activeScreen.id &&
			editingRow.rowIndex === index
		) {
			editingRow = null;
			return;
		}
		rowSelections[activeScreen.id] = index;
		if (row.target) {
			chooseScreenId(row.target);
		} else if (row.label === 'RETURN') {
			chooseScreenId('main');
		} else if (rowAction(row) === 'toggle') {
			editingRow = null;
			changeRowValue(activeScreen, index, 1);
		} else if (rowAction(row) === 'adjust') {
			editingRow = { screenId: activeScreen.id, rowIndex: index };
		} else {
			editingRow = null;
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
				<span
					class="segment-digit"
					class:fractional={text.includes('.') && index > text.indexOf('.')}
				>
					{#each parts as part (`${character}-${part}`)}
						<img
							class={`segment-part segment-${part}`}
							src={segmentPartSrc(part)}
							alt=""
						/>
					{/each}
				</span>
			{:else if character === '.'}
				<img
					src={segmentDigitSrc(character)}
					class="dot-glyph fractional-dot"
					alt=""
				/>
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
		<div class="controller-stage">
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
						} else if (
							event.key === 'ArrowDown' ||
							event.key === 'ArrowRight'
						) {
							event.preventDefault();
							rotateKnob(1);
						}
					}}
				>
					<div
						class={`screen-ui mode-${activeScreen.mode} screen-${activeScreen.id}`}
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
								<div class="splash-mark" aria-label="B1">
									<img src={`${imageBase}TheRest/Splash_B.png`} alt="" />
									<img src={`${imageBase}TheRest/Splash_1.png`} alt="" />
								</div>
								<img
									src={`${imageBase}TheRest/Splash_byGizzmo.png`}
									alt="by Gizzmo"
								/>
							</div>
						{:else if activeScreen.mode === 'live' && activeLive}
							<div
								class="live-screen"
								aria-label={`Memory ${activeLive.memory}`}
							>
								<img
									class="live-arc"
									src={`${imageBase}Bars/Base.png`}
									alt=""
								/>
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
								{#if activeScreen.id === 'set-memory'}
									<div class="set-memory-number">
										{@render bigDigitText(String(memoryIndex))}
									</div>
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
												<img
													src={`${imageBase}TheRest/BlueBall5px.png`}
													alt=""
												/>
											</span>
											<span class="row-label"
												>{@render glyphText(
													labelFor(activeScreen.id, index, row),
													row.tone ?? 'white',
												)}</span
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
		box-sizing: border-box;
		min-height: 100svh;
		padding: clamp(0.75rem, 4vh, 2.5rem) clamp(0.75rem, 4vw, 2.5rem);
	}

	.controller-stage {
		position: relative;
		width: min(
			1040px,
			calc(100vw - clamp(1.5rem, 8vw, 5rem)),
			calc((100svh - clamp(1.5rem, 8vh, 5rem)) * 1016 / 460)
		);
		aspect-ratio: 1016 / 460;
	}

	.controller-shell {
		position: relative;
		width: 100%;
		height: 100%;
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
		touch-action: none;
		container-type: size;
		--lcd-px: calc(100cqw / 516.88);
	}

	.controller-screen:focus,
	.knob:focus {
		outline: none;
	}

	.screen-ui {
		position: relative;
		width: 100%;
		height: 100%;
		background: #000;
		box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.36);
		overflow: hidden;
	}

	.screen-ui.mode-live {
		background: #000;
		box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.42);
	}

	.hold-progress {
		position: absolute;
		left: 50%;
		top: 3.6%;
		z-index: 20;
		display: flex;
		gap: calc(var(--lcd-px) * 4.48);
		transform: translateX(-50%);
		pointer-events: none;
	}

	.hold-progress span {
		display: block;
		width: calc(var(--lcd-px) * 5.76);
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
		height: calc(var(--lcd-px) * 16.64);
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
	}

	.glyph-text img.dot-glyph {
		align-self: flex-end;
		height: calc(var(--lcd-px) * 5.12);
		margin-bottom: calc(var(--lcd-px) * 3.2);
	}

	.glyph-space {
		display: block;
		width: calc(var(--lcd-px) * 7.36);
		height: 1px;
		flex: 0 0 auto;
	}

	.glyph-fallback {
		display: inline-block;
		color: var(--screen-white);
		font:
			900 calc(var(--lcd-px) * 16) Impact,
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
		gap: calc(var(--lcd-px) * 2.56);
		font-size: 0;
		line-height: 1;
	}

	.big-digit-text img {
		display: block;
		width: auto;
		height: calc(var(--lcd-px) * 75.52);
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
	}

	.big-digit-text img.dot-glyph {
		height: calc(var(--lcd-px) * 9.6);
		margin-bottom: calc(var(--lcd-px) * 8);
	}

	.segment-digit-text {
		display: inline-flex;
		align-items: flex-end;
		gap: calc(var(--lcd-px) * 2.08);
		font-size: 0;
		line-height: 1;
	}

	.segment-digit-text img {
		display: block;
		width: auto;
		height: calc(var(--lcd-px) * 99.2);
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
	}

	.segment-digit {
		position: relative;
		display: inline-block;
		width: calc(var(--lcd-px) * 81);
		height: calc(var(--lcd-px) * 100);
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
		z-index: 2;
	}

	.segment-topleft,
	.segment-topright,
	.segment-botleft,
	.segment-botright {
		z-index: 1;
	}

	.segment-top,
	.segment-middle,
	.segment-bottom,
	.segment-topleft,
	.segment-topright,
	.segment-botleft,
	.segment-botright {
		right: auto;
	}

	.segment-digit .segment-top {
		left: 29.63%;
		top: 0;
		width: 69.14%;
	}

	.segment-digit .segment-middle {
		left: 17.28%;
		top: 43%;
		width: 65.43%;
	}

	.segment-digit .segment-bottom {
		left: 2.47%;
		top: 88%;
		width: 67.9%;
	}

	.segment-digit .segment-topleft,
	.segment-digit .segment-topright,
	.segment-digit .segment-botleft,
	.segment-digit .segment-botright {
		width: 27.16%;
	}

	.segment-digit .segment-topleft {
		left: 13.58%;
		top: 3%;
	}

	.segment-digit .segment-topright {
		left: 72.84%;
		top: 2%;
	}

	.segment-digit .segment-botleft {
		left: 0;
		top: 51%;
	}

	.segment-digit .segment-botright {
		left: 60.49%;
		top: 51%;
	}

	.segment-digit-text img.dot-glyph {
		height: calc(var(--lcd-px) * 7.04);
		margin-bottom: calc(var(--lcd-px) * 13.12);
	}

	.big-digit-space {
		width: calc(var(--lcd-px) * 6.72);
	}

	.big-digit-fallback {
		color: var(--screen-white);
		font:
			900 calc(var(--lcd-px) * 96) Impact,
			sans-serif;
		line-height: 0.78;
	}

	.splash-screen {
		display: grid;
		place-content: center;
		height: 100%;
		justify-items: center;
		gap: calc(var(--lcd-px) * 8);
	}

	.splash-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: calc(var(--lcd-px) * 1.2);
	}

	.splash-mark img {
		width: auto;
		height: calc(var(--lcd-px) * 91);
		image-rendering: pixelated;
	}

	.splash-screen img:last-child {
		width: min(38%, 10rem);
		image-rendering: pixelated;
	}

	.live-screen {
		position: relative;
		display: block;
		height: 100%;
		overflow: hidden;
	}

	.live-arc {
		position: absolute;
		left: -3.8%;
		top: -2.2%;
		width: auto;
		height: 104.4%;
		object-fit: contain;
		image-rendering: pixelated;
		mix-blend-mode: screen;
		opacity: 0.94;
		transform: rotate(-2deg);
	}

	.live-memory-title {
		display: none;
	}

	.live-memory-title .glyph-text {
		gap: 0;
	}

	.live-memory-title .glyph-text img {
		height: calc(var(--lcd-px) * 17.28);
	}

	.live-rpm-label {
		position: absolute;
		left: 71.7%;
		top: -1.8%;
		z-index: 2;
	}

	.live-rpm-label .glyph-text img {
		height: calc(var(--lcd-px) * 11.52);
	}

	.live-rpm-value {
		position: absolute;
		right: 10.8%;
		top: 6.8%;
		z-index: 2;
	}

	.live-rpm-value .segment-digit-text {
		transform: scale(0.58);
		transform-origin: top right;
	}

	.live-memory-rail {
		position: absolute;
		right: -24.9%;
		top: 43.1%;
		z-index: 2;
		transform: rotate(-90deg);
		transform-origin: center;
	}

	.live-memory-rail .glyph-text {
		gap: 0;
	}

	.live-memory-rail .glyph-text img {
		height: calc(var(--lcd-px) * 32.64);
	}

	.live-memory-number {
		display: none;
	}

	.live-memory-number .big-digit-text img {
		height: calc(var(--lcd-px) * 48);
	}

	.live-unit {
		position: absolute;
		left: 7.4%;
		top: 34.8%;
		z-index: 2;
	}

	.live-unit .glyph-text img {
		height: calc(var(--lcd-px) * 14.4);
	}

	.live-pressure {
		position: absolute;
		right: 15.8%;
		bottom: 10.2%;
		z-index: 2;
	}

	.live-pressure .segment-digit-text {
		gap: calc(var(--lcd-px) * 3.2);
		transform: scale(1.36);
		transform-origin: bottom right;
	}

	.live-pressure .segment-digit.fractional {
		margin-left: calc(var(--lcd-px) * -8);
		transform: scale(0.62);
		transform-origin: bottom right;
	}

	.live-pressure .segment-digit-text img.dot-glyph {
		height: calc(var(--lcd-px) * 16.64);
		margin-bottom: calc(var(--lcd-px) * 7.36);
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
		height: calc(var(--lcd-px) * 17.92);
	}

	.screen-title .glyph-space {
		width: calc(var(--lcd-px) * 8.96);
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
		gap: calc(var(--lcd-px) * 0.8);
		min-width: 0;
	}

	.menu-rows.compact {
		top: 24.4%;
		gap: 0;
	}

	.menu-rows button {
		display: grid;
		grid-template-columns: calc(var(--lcd-px) * 8) minmax(0, 1fr) auto;
		align-items: center;
		min-width: 0;
		height: calc(var(--lcd-px) * 24);
		border: 0;
		background: transparent;
		padding: 0;
		cursor: default;
	}

	.menu-rows button .glyph-text img {
		height: calc(var(--lcd-px) * 19.2);
	}

	.menu-rows.compact button .glyph-text img {
		height: calc(var(--lcd-px) * 16.32);
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
		width: calc(var(--lcd-px) * 8);
	}

	.selection-dot img {
		display: block;
		width: calc(var(--lcd-px) * 4.8);
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
		padding-left: calc(var(--lcd-px) * 6.08);
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
		height: calc(var(--lcd-px) * 12.48);
	}

	.screen-icon {
		position: absolute;
		right: 4.8%;
		top: 8.4%;
		z-index: 1;
		width: calc(var(--lcd-px) * 36);
		height: calc(var(--lcd-px) * 36);
		object-fit: contain;
		image-rendering: pixelated;
		opacity: 0.95;
	}

	.screen-icon.warning {
		filter: none;
	}

	.screen-icon.stethoscope {
		right: 6.4%;
		top: 9.4%;
		width: calc(var(--lcd-px) * 38);
		height: calc(var(--lcd-px) * 38);
		filter: none;
	}

	.screen-set-memory .screen-icon {
		left: 5.7%;
		right: auto;
		top: 10.8%;
		width: calc(var(--lcd-px) * 47);
		height: calc(var(--lcd-px) * 47);
	}

	.screen-set-memory .menu-rows {
		top: 38.2%;
	}

	.set-memory-number {
		position: absolute;
		left: 22.5%;
		top: 11.8%;
		z-index: 3;
	}

	.set-memory-number .big-digit-text img {
		height: calc(var(--lcd-px) * 68);
		filter: hue-rotate(-96deg) saturate(2.15) brightness(1.18);
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
		touch-action: none;
	}

	.knob span {
		display: none;
	}

	@keyframes memory-pulse {
		50% {
			opacity: 0.55;
		}
	}

	@media (max-width: 560px) {
		.controller-wrap {
			padding-block: 0.5rem;
			padding-inline: 0.5rem;
		}
	}

	@media (max-width: 560px) and (orientation: portrait) {
		.controller-stage {
			width: min(
				calc(1040px * 460 / 1016),
				calc(100vw - 1rem),
				calc((100svh - 1rem) * 460 / 1016)
			);
			aspect-ratio: 460 / 1016;
		}

		.controller-shell {
			position: absolute;
			left: 50%;
			top: 50%;
			width: min(
				1040px,
				calc(100svh - 1rem),
				calc((100vw - 1rem) * 1016 / 460)
			);
			height: auto;
			aspect-ratio: 1016 / 460;
			transform: translate(-50%, -50%) rotate(90deg);
		}
	}
</style>
