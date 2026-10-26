// The B♭ clarinet: a standard 17-key, 6-ring Boehm clarinet, drawn from the
// front with the mouthpiece at the top, as fingering charts draw it. The thumb
// hole and register key sit on the back; they are drawn to the left so they can
// be pressed. Keys worked by the right hand (the side key, the right pinky
// keys) are on the left of the drawing and the left hand's on the right, as
// they are seen from the front.
//
// The chart was checked against the Woodwind Fingering Guide's Boehm charts
// (wfg.woodwind.org), Yamaha's clarinet fingering chart and Brian Stahl's
// chart. Only fingerings at least two of them give are here.

import type { Woodwind } from '../woodwinds';

// Fingerings that are the same in every register but the register key.
const LH = 'L1 L2 L3';
const RH = 'R1 R2 R3';

export const CLARINET: Woodwind = {
	layout: {
		width: 160,
		height: 440,
		body: [
			// Mouthpiece and barrel, the two joints, then the bell.
			{ x: 70, y: 4, w: 20, h: 30, r: 8 },
			{ x: 64, y: 30, w: 32, h: 170, r: 6 },
			{ x: 64, y: 198, w: 32, h: 180, r: 6 },
			{ x: 58, y: 372, w: 44, h: 28, r: 8 },
			{ x: 46, y: 390, w: 68, h: 44, r: 20 }
		],
		keys: [
			{ id: 'T', name: 'thumb hole', label: 'T', shape: 'hole', x: 30, y: 82, w: 22, h: 22 },
			{ id: 'R', name: 'register key', label: 'R', shape: 'key', x: 30, y: 52, w: 14, h: 26 },
			{ id: 'A', name: 'A key', label: 'A', shape: 'key', x: 80, y: 46, w: 16, h: 22 },
			{
				id: 'Gs',
				name: 'G♯ key',
				label: 'G♯',
				shape: 'key',
				x: 108,
				y: 54,
				w: 14,
				h: 28,
				angle: -15
			},
			{
				id: 'L1',
				name: 'left first finger',
				label: '1',
				shape: 'hole',
				x: 80,
				y: 84,
				w: 22,
				h: 22
			},
			{
				id: 'L2',
				name: 'left second finger',
				label: '2',
				shape: 'hole',
				x: 80,
				y: 116,
				w: 22,
				h: 22
			},
			{
				id: 'L3',
				name: 'left third finger',
				label: '3',
				shape: 'hole',
				x: 80,
				y: 148,
				w: 22,
				h: 22
			},
			// The left sliver key, pressed by rolling the third finger up: a
			// chromatic E♭ and B♭.
			{
				id: 'Lsl',
				name: 'left sliver key (E♭/B♭)',
				label: 'sl',
				shape: 'key',
				x: 108,
				y: 132,
				w: 14,
				h: 22
			},
			{
				id: 'CsGs',
				name: 'C♯/G♯ key',
				label: 'C♯',
				shape: 'key',
				x: 110,
				y: 172,
				w: 28,
				h: 14
			},
			// The left pinky's three levers reach down past the joint.
			{
				id: 'LE',
				name: 'left pinky E/B key',
				label: 'E',
				shape: 'key',
				x: 112,
				y: 214,
				w: 14,
				h: 30
			},
			{
				id: 'LF',
				name: 'left pinky F/C key',
				label: 'F',
				shape: 'key',
				x: 124,
				y: 192,
				w: 26,
				h: 14
			},
			{
				id: 'LFs',
				name: 'left pinky F♯/C♯ key',
				label: 'F♯',
				shape: 'key',
				x: 134,
				y: 220,
				w: 14,
				h: 30
			},
			{
				id: 'SEb',
				name: 'side E♭/B♭ key',
				label: 'E♭',
				shape: 'key',
				x: 50,
				y: 176,
				w: 14,
				h: 26
			},
			{
				id: 'R1',
				name: 'right first finger',
				label: '1',
				shape: 'hole',
				x: 80,
				y: 244,
				w: 22,
				h: 22
			},
			{
				id: 'R2',
				name: 'right second finger',
				label: '2',
				shape: 'hole',
				x: 80,
				y: 276,
				w: 22,
				h: 22
			},
			{
				id: 'R3',
				name: 'right third finger',
				label: '3',
				shape: 'hole',
				x: 80,
				y: 308,
				w: 22,
				h: 22
			},
			// The right sliver key, a chromatic B and F♯.
			{
				id: 'Rsl',
				name: 'right sliver key (B/F♯)',
				label: 'sl',
				shape: 'key',
				x: 52,
				y: 292,
				w: 14,
				h: 22
			},
			{
				id: 'RF',
				name: 'right pinky F/C key',
				label: 'F',
				shape: 'key',
				x: 48,
				y: 330,
				w: 26,
				h: 14
			},
			{
				id: 'RGs',
				name: 'right pinky G♯/D♯ key',
				label: 'G♯',
				shape: 'key',
				x: 78,
				y: 334,
				w: 26,
				h: 14
			},
			{
				id: 'RE',
				name: 'right pinky E/B key',
				label: 'E',
				shape: 'key',
				x: 40,
				y: 352,
				w: 26,
				h: 14
			},
			{
				id: 'RFs',
				name: 'right pinky F♯/C♯ key',
				label: 'F♯',
				shape: 'key',
				x: 70,
				y: 356,
				w: 26,
				h: 14
			}
		]
	},
	// Left pinky for B (and E), right pinky for C (and F), so the pinkies
	// alternate down the chromatic scale; the other pinky is accepted too. The
	// pinky combinations used for sliding (both E and F held) are left out.
	chart: {
		// Chalumeau
		E3: [`T ${LH} LE ${RH}`, `T ${LH} ${RH} RE`],
		F3: [`T ${LH} ${RH} RF`, `T ${LH} LF ${RH}`],
		'F#3': [`T ${LH} LFs ${RH}`, `T ${LH} ${RH} RFs`],
		G3: [`T ${LH} ${RH}`],
		'G#3': [`T ${LH} ${RH} RGs`],
		A3: [`T ${LH} R1 R2`],
		'A#3': [`T ${LH} R1`],
		B3: [`T ${LH} R2`, `T ${LH} R1 Rsl`],
		C4: [`T ${LH}`],
		'C#4': [`T ${LH} CsGs`],
		D4: ['T L1 L2'],
		// The side key first, as method books teach it; the sliver key and
		// one-and-one (a little sharp) are both standard.
		'D#4': ['T L1 L2 SEb', 'T L1 L2 Lsl', 'T L1 R1'],
		E4: ['T L1'],
		F4: ['T'],
		'F#4': ['L1'],
		// Throat tones
		G4: ['0'],
		'G#4': ['Gs'],
		A4: ['A'],
		// The A key and register key. Side B♭ (a trill key) and the
		// "resonance" fingerings with the right hand down are left out.
		'A#4': ['R A'],
		// Clarion: the chalumeau fingering a twelfth lower, with the register key.
		B4: [`T R ${LH} LE ${RH}`, `T R ${LH} ${RH} RE`],
		C5: [`T R ${LH} ${RH} RF`, `T R ${LH} LF ${RH}`],
		'C#5': [`T R ${LH} LFs ${RH}`, `T R ${LH} ${RH} RFs`],
		D5: [`T R ${LH} ${RH}`],
		'D#5': [`T R ${LH} ${RH} RGs`],
		E5: [`T R ${LH} R1 R2`],
		F5: [`T R ${LH} R1`],
		'F#5': [`T R ${LH} R2`, `T R ${LH} R1 Rsl`],
		G5: [`T R ${LH}`],
		'G#5': [`T R ${LH} CsGs`],
		A5: ['T R L1 L2'],
		'A#5': ['T R L1 L2 SEb', 'T R L1 L2 Lsl', 'T R L1 R1'],
		B5: ['T R L1'],
		C6: ['T R'],
		// Altissimo, up to the fourth ledger line. The first finger comes off
		// to vent, and the G♯/D♯ key steadies most of these notes.
		'C#6': ['T R L2 L3 R1 R2'],
		D6: ['T R L2 L3 R1 RGs'],
		'D#6': ['T R L2 L3 R1 Rsl RGs', 'T R L2 L3 R2 RGs'],
		E6: ['T R L2 L3 RGs'],
		F6: ['T R L2 L3 CsGs RGs'],
		// The long F♯, with the right hand down, slurs better from below.
		'F#6': ['T R L2 RGs', `T R L1 L2 ${RH} RGs`],
		G6: ['T R L2 R1 R2 RGs']
	}
};
