// The bassoon, German (Heckel) system, as school bassoons are. Bass clef only,
// low B♭ to the G above middle C (docs/specs/phase-2-3-assumptions.md, 8).
//
// The drawing follows the usual chart diagram: the left hand on top, the right
// hand below, each with its thumb keys on the left (the back of the
// instrument) and its finger holes and little-finger keys on the right (the
// front). The fingerings were checked against the Woodwind Fingering Guide
// basic chart, the Jones Double Reed chart and Fox's "Let's Play" chart, with
// Blue Moon Bassoon and Building a Bassoonist for which one is taught first.
//
// Where those charts differ only by a key that does no harm, both are
// accepted: the whisper key on the lowest notes, the right little finger F
// under the thumb F♯, and the resonance key on middle E♭.

import type { Woodwind } from '../woodwinds';

export const BASSOON: Woodwind = {
	layout: {
		width: 240,
		height: 360,
		body: [
			// The bass joint, under the left thumb.
			{ x: 8, y: 8, w: 104, h: 166, r: 12 },
			// The wing joint, under the left fingers.
			{ x: 124, y: 8, w: 108, h: 166, r: 12 },
			// The back of the boot, under the right thumb.
			{ x: 8, y: 186, w: 104, h: 166, r: 12 },
			// The front of the boot, under the right fingers.
			{ x: 124, y: 186, w: 108, h: 166, r: 12 }
		],
		keys: [
			// Left thumb, the low keys. The charts show them held together, a
			// key at a time: low C is C and D, low B♭ is all four.
			{
				id: 'lowBb',
				name: 'low B flat key',
				label: 'B♭',
				shape: 'key',
				x: 22,
				y: 50,
				w: 16,
				h: 50
			},
			{ id: 'lowB', name: 'low B key', label: 'B', shape: 'key', x: 42, y: 50, w: 16, h: 50 },
			{ id: 'lowC', name: 'low C key', label: 'C', shape: 'key', x: 32, y: 90, w: 32, h: 18 },
			{ id: 'lowD', name: 'low D key', label: 'D', shape: 'key', x: 32, y: 134, w: 18, h: 50 },
			// Left thumb, the flick keys, lower case so they are not taken for
			// the low keys. Tapped as a note starts, which a beginner does not
			// do yet, so every flicked note is also right without one.
			{ id: 'fD', name: 'high D flick key', label: 'd', shape: 'key', x: 86, y: 28, w: 32, h: 14 },
			{ id: 'fC', name: 'high C flick key', label: 'c', shape: 'key', x: 80, y: 50, w: 32, h: 14 },
			{ id: 'fA', name: 'high A flick key', label: 'a', shape: 'key', x: 74, y: 72, w: 32, h: 14 },
			{
				id: 'Cs',
				name: 'C sharp thumb key',
				label: 'C♯',
				shape: 'key',
				x: 80,
				y: 100,
				w: 30,
				h: 16
			},
			{ id: 'W', name: 'whisper key', label: 'W', shape: 'key', x: 80, y: 136, w: 24, h: 24 },
			// Left fingers. The half-hole is its own key, pressed instead of
			// the first finger, so a rolled-back finger has something to click.
			{
				id: 'L1',
				name: 'left first finger',
				label: '1',
				shape: 'hole',
				x: 162,
				y: 40,
				w: 22,
				h: 22
			},
			{
				id: 'L1h',
				name: 'left first finger, half-hole',
				label: '½',
				shape: 'key',
				x: 196,
				y: 40,
				w: 22,
				h: 16
			},
			{
				id: 'L2',
				name: 'left second finger',
				label: '2',
				shape: 'hole',
				x: 162,
				y: 85,
				w: 22,
				h: 22
			},
			{
				id: 'L3',
				name: 'left third finger',
				label: '3',
				shape: 'hole',
				x: 162,
				y: 130,
				w: 22,
				h: 22
			},
			// Left little finger. E♭ doubles as the resonance key for the
			// notes high in the staff.
			{
				id: 'Eb',
				name: 'left little finger E flat key',
				label: 'E♭',
				shape: 'key',
				x: 204,
				y: 124,
				w: 30,
				h: 16
			},
			{
				id: 'pCs',
				name: 'left little finger C sharp key',
				label: 'C♯',
				shape: 'key',
				x: 204,
				y: 150,
				w: 30,
				h: 16
			},
			// Right thumb.
			{
				id: 'Bb',
				name: 'right thumb B flat key',
				label: 'B♭',
				shape: 'key',
				x: 58,
				y: 212,
				w: 44,
				h: 16
			},
			{
				id: 'E',
				name: 'right thumb low E key',
				label: 'E',
				shape: 'key',
				x: 58,
				y: 252,
				w: 32,
				h: 32
			},
			{
				id: 'Fs',
				name: 'right thumb F sharp key',
				label: 'F♯',
				shape: 'key',
				x: 58,
				y: 292,
				w: 40,
				h: 16
			},
			{
				id: 'Ab',
				name: 'right thumb A flat key',
				label: 'A♭',
				shape: 'key',
				x: 58,
				y: 320,
				w: 40,
				h: 16
			},
			// Right fingers.
			{
				id: 'R1',
				name: 'right first finger',
				label: '1',
				shape: 'hole',
				x: 160,
				y: 216,
				w: 22,
				h: 22
			},
			{
				id: 'R2',
				name: 'right second finger',
				label: '2',
				shape: 'hole',
				x: 160,
				y: 256,
				w: 22,
				h: 22
			},
			{
				id: 'R3',
				name: 'right third finger',
				label: '3',
				shape: 'hole',
				x: 160,
				y: 296,
				w: 22,
				h: 22
			},
			// Right little finger.
			{
				id: 'F',
				name: 'right little finger low F key',
				label: 'F',
				shape: 'key',
				x: 204,
				y: 284,
				w: 30,
				h: 16
			},
			{
				id: 'pFs',
				name: 'right little finger F sharp key',
				label: 'F♯',
				shape: 'key',
				x: 204,
				y: 308,
				w: 30,
				h: 16
			},
			{
				id: 'pAb',
				name: 'right little finger A flat key',
				label: 'A♭',
				shape: 'key',
				x: 204,
				y: 332,
				w: 30,
				h: 16
			}
		]
	},
	chart: {
		// The lowest notes. The Woodwind Fingering Guide and Fox leave the
		// whisper key up here; holding it, as many students do from habit,
		// changes nothing, so it is accepted.
		'A#1': [
			'lowBb lowB lowC lowD L1 L2 L3 E R1 R2 R3 F',
			'lowBb lowB lowC lowD W L1 L2 L3 E R1 R2 R3 F'
		],
		B1: ['lowB lowC lowD L1 L2 L3 E R1 R2 R3 F', 'lowB lowC lowD W L1 L2 L3 E R1 R2 R3 F'],
		C2: ['lowC lowD L1 L2 L3 E R1 R2 R3 F', 'lowC lowD W L1 L2 L3 E R1 R2 R3 F'],
		'C#2': ['lowC lowD L1 L2 L3 pCs E R1 R2 R3 F', 'lowC lowD W L1 L2 L3 pCs E R1 R2 R3 F'],
		D2: ['lowD L1 L2 L3 E R1 R2 R3 F', 'lowD W L1 L2 L3 E R1 R2 R3 F'],
		'D#2': ['lowD L1 L2 L3 Eb E R1 R2 R3 F', 'lowD W L1 L2 L3 Eb E R1 R2 R3 F'],
		E2: ['W L1 L2 L3 E R1 R2 R3 F', 'L1 L2 L3 E R1 R2 R3 F'],
		F2: ['W L1 L2 L3 R1 R2 R3 F'],
		// Fox and Blue Moon lift the little finger F for the thumb F♯; the
		// Woodwind Fingering Guide and Jones keep it down. Either plays.
		'F#2': ['W L1 L2 L3 Fs R1 R2 R3', 'W L1 L2 L3 Fs R1 R2 R3 F', 'W L1 L2 L3 R1 R2 R3 F pFs'],
		G2: ['W L1 L2 L3 R1 R2 R3'],
		'G#2': ['W L1 L2 L3 R1 R2 R3 pAb', 'W L1 L2 L3 Ab R1 R2 R3'],
		A2: ['W L1 L2 L3 R1 R2'],
		'A#2': ['W L1 L2 L3 Bb R1 R2'],
		B2: ['W L1 L2 L3 R1'],
		C3: ['W L1 L2 L3'],
		// Low D and the whisper key with the C♯ key: the charts all insist,
		// because students leave them off.
		'C#3': ['lowD Cs W L1 L2 L3'],
		D3: ['W L1 L2'],
		// The long E♭ is the one bassoonists teach from day one; the short,
		// left-hand-only E♭ is still a standard fingering.
		'D#3': ['W L1 L3 Bb R2', 'W L1 L3 Eb Bb R2', 'W L1 L3', 'W L1 L3 Eb'],
		E3: ['W L1'],
		F3: ['W'],
		// The half-hole notes.
		'F#3': ['W L1h L2 L3 Fs R1 R2 R3', 'W L1h L2 L3 Fs R1 R2 R3 F', 'W L1h L2 L3 R1 R2 R3 F pFs'],
		G3: ['W L1h L2 L3 Eb R1 R2 R3'],
		'G#3': ['W L1h L2 L3 R1 R2 R3 pAb', 'W L1h L2 L3 Ab R1 R2 R3'],
		// The flicked notes: plain first, since flicking comes later.
		A3: ['L1 L2 L3 R1 R2', 'fA L1 L2 L3 R1 R2'],
		'A#3': ['L1 L2 L3 Bb R1 R2', 'fA L1 L2 L3 Bb R1 R2', 'fC L1 L2 L3 Bb R1 R2'],
		B3: ['L1 L2 L3 R1', 'fC L1 L2 L3 R1'],
		C4: ['L1 L2 L3', 'fC L1 L2 L3'],
		'C#4': ['lowD Cs L1 L2 L3', 'Cs L1 L2 L3 R2 R3 F'],
		D4: ['L1 L2', 'fD L1 L2'],
		'D#4': ['L1 L2 R1 R2 R3'],
		// From E up the resonance key stays down.
		E4: ['L1 L3 Eb R1 R2 R3'],
		F4: ['L1 L3 Eb R1 R2'],
		'F#4': ['L2 L3 Eb R1 R2 F', 'L2 L3 Eb Bb R1 R2'],
		G4: ['W L1h L2 L3 Eb R1 F']
	}
};
