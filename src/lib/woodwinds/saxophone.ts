// The saxophone. Alto, tenor and baritone are fingered alike in written
// pitch, so one drawing and one chart serve all three. The baritone's low A
// key is left off (see docs/specs/phase-2-3-assumptions.md).
//
// Drawn from the front, mouthpiece at the top, as fingering charts draw it:
// the left hand's palm keys and pinky table on the right of the drawing, the
// right hand's side keys on the left. The octave key sits under the left thumb
// on the back; it is drawn to the left so it can be pressed.
//
// The chart was checked against the Woodwind Fingering Guide's saxophone
// charts (wfg.woodwind.org), the alto saxophone chart in Essential Elements
// and Saxophone Hub's chart. Only fingerings at least two of them give are
// here.

import type { Woodwind } from '../woodwinds';

export const SAXOPHONE: Woodwind = {
	layout: {
		width: 180,
		height: 420,
		body: [
			// Mouthpiece and neck, the body tube, the bow, and the bell rising
			// beside the body.
			{ x: 82, y: 4, w: 16, h: 30, r: 6 },
			{ x: 70, y: 24, w: 40, h: 340, r: 14 },
			{ x: 120, y: 244, w: 48, h: 150, r: 20 },
			{ x: 66, y: 346, w: 102, h: 64, r: 30 }
		],
		keys: [
			{ id: 'oct', name: 'octave key', label: 'oct', shape: 'key', x: 36, y: 80, w: 16, h: 28 },
			{
				id: 'fF',
				name: 'front F key',
				label: 'fF',
				shape: 'key',
				x: 90,
				y: 46,
				w: 26,
				h: 14,
				angle: -15
			},
			// The palm keys, worked by the side of the left hand.
			{
				id: 'pEb',
				name: 'palm E♭ key',
				label: 'E♭',
				shape: 'key',
				x: 128,
				y: 40,
				w: 14,
				h: 28,
				angle: 15
			},
			{
				id: 'pD',
				name: 'palm D key',
				label: 'D',
				shape: 'key',
				x: 150,
				y: 66,
				w: 14,
				h: 28,
				angle: 15
			},
			{
				id: 'pF',
				name: 'palm F key',
				label: 'F',
				shape: 'key',
				x: 128,
				y: 86,
				w: 14,
				h: 28,
				angle: 15
			},
			{
				id: 'L1',
				name: 'left first finger',
				label: '1',
				shape: 'hole',
				x: 90,
				y: 80,
				w: 24,
				h: 24
			},
			// The bis key, a small pearl the first finger rolls onto for B♭.
			{ id: 'bis', name: 'bis key', label: 'bis', shape: 'hole', x: 90, y: 106, w: 14, h: 14 },
			{
				id: 'L2',
				name: 'left second finger',
				label: '2',
				shape: 'hole',
				x: 90,
				y: 132,
				w: 24,
				h: 24
			},
			{
				id: 'L3',
				name: 'left third finger',
				label: '3',
				shape: 'hole',
				x: 90,
				y: 166,
				w: 24,
				h: 24
			},
			// The left pinky table: G♯ on top, C♯ and B side by side, B♭ below.
			{ id: 'Gs', name: 'G♯ key', label: 'G♯', shape: 'key', x: 136, y: 166, w: 30, h: 14 },
			{ id: 'B', name: 'low B key', label: 'B', shape: 'key', x: 128, y: 186, w: 18, h: 14 },
			{ id: 'Cs', name: 'low C♯ key', label: 'C♯', shape: 'key', x: 152, y: 186, w: 18, h: 14 },
			{ id: 'Bb', name: 'low B♭ key', label: 'B♭', shape: 'key', x: 140, y: 206, w: 30, h: 14 },
			// The side keys, pressed with the side of the right first finger.
			{ id: 'sE', name: 'side E key', label: 'E', shape: 'key', x: 46, y: 194, w: 14, h: 24 },
			{ id: 'sC', name: 'side C key', label: 'C', shape: 'key', x: 46, y: 222, w: 14, h: 24 },
			{ id: 'sBb', name: 'side B♭ key', label: 'B♭', shape: 'key', x: 46, y: 250, w: 14, h: 24 },
			{
				id: 'R1',
				name: 'right first finger',
				label: '1',
				shape: 'hole',
				x: 90,
				y: 222,
				w: 24,
				h: 24
			},
			{
				id: 'R2',
				name: 'right second finger',
				label: '2',
				shape: 'hole',
				x: 90,
				y: 256,
				w: 24,
				h: 24
			},
			{
				id: 'R3',
				name: 'right third finger',
				label: '3',
				shape: 'hole',
				x: 90,
				y: 290,
				w: 24,
				h: 24
			},
			{ id: 'Eb', name: 'low E♭ key', label: 'E♭', shape: 'key', x: 92, y: 324, w: 30, h: 14 },
			{ id: 'C', name: 'low C key', label: 'C', shape: 'key', x: 92, y: 344, w: 30, h: 14 }
		]
	},
	// Below D the right pinky holds low C down: every chart consulted shows it
	// held for low C♯, B and B♭ as well as C. From D5 up the octave key is
	// added, except C♯5, which is played with nothing down.
	chart: {
		'A#3': ['L1 L2 L3 Bb R1 R2 R3 C'],
		B3: ['L1 L2 L3 B R1 R2 R3 C'],
		C4: ['L1 L2 L3 R1 R2 R3 C'],
		'C#4': ['L1 L2 L3 Cs R1 R2 R3 C'],
		D4: ['L1 L2 L3 R1 R2 R3'],
		'D#4': ['L1 L2 L3 R1 R2 R3 Eb'],
		E4: ['L1 L2 L3 R1 R2'],
		F4: ['L1 L2 L3 R1'],
		'F#4': ['L1 L2 L3 R2'],
		G4: ['L1 L2 L3'],
		'G#4': ['L1 L2 L3 Gs'],
		A4: ['L1 L2'],
		// The bis key first; side B♭ and one-and-one are both accepted.
		'A#4': ['L1 bis', 'L1 L2 sBb', 'L1 R1'],
		B4: ['L1'],
		C5: ['L2', 'L1 sC'],
		'C#5': ['0'],
		D5: ['oct L1 L2 L3 R1 R2 R3'],
		'D#5': ['oct L1 L2 L3 R1 R2 R3 Eb'],
		E5: ['oct L1 L2 L3 R1 R2'],
		F5: ['oct L1 L2 L3 R1'],
		'F#5': ['oct L1 L2 L3 R2'],
		G5: ['oct L1 L2 L3'],
		'G#5': ['oct L1 L2 L3 Gs'],
		A5: ['oct L1 L2'],
		'A#5': ['oct L1 bis', 'oct L1 L2 sBb', 'oct L1 R1'],
		B5: ['oct L1'],
		C6: ['oct L2', 'oct L1 sC'],
		'C#6': ['oct'],
		// The palm keys, added one at a time; front F is the standard
		// alternative for the top two.
		D6: ['oct pD'],
		'D#6': ['oct pEb pD'],
		E6: ['oct pEb pD sE', 'oct fF L2 L3'],
		F6: ['oct pEb pD pF sE', 'oct fF L2']
	}
};
