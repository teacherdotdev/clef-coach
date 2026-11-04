// The oboe, standing up with the reed at the top, as oboe charts draw it. It
// has the keys a middle schooler's instrument uses: both octave keys, the
// half-hole, the left F key, and the pinky keys of each hand. The right-hand
// side keys, trill keys and third octave key are left off; no note asked about
// needs them. The F resonance key opens by itself, so it is not drawn.
//
// Fingerings follow the Woodwind Fingering Guide's basic chart, checked
// against the Fox Products chart ("Let's Play Oboe") and, for F, Bret
// Pimentel's guide to the F fingerings. Oboe sounds as written.

import type { Woodwind } from '../woodwinds';

export const OBOE: Woodwind = {
	layout: {
		width: 240,
		height: 480,
		body: [
			// Reed, upper joint, lower joint and bell.
			{ x: 116, y: 2, w: 8, h: 20, r: 3 },
			{ x: 104, y: 20, w: 32, h: 202, r: 6 },
			{ x: 104, y: 222, w: 32, h: 180, r: 4 },
			{ x: 96, y: 400, w: 48, h: 72, r: 14 }
		],
		keys: [
			// The thumb octave key is on the back; it is drawn to the left.
			{
				id: 'oct',
				name: 'octave key (left thumb)',
				label: 'Oct',
				shape: 'key',
				x: 72,
				y: 56,
				w: 16,
				h: 30
			},
			{
				id: 'oct2',
				name: 'second octave key (side of left first finger)',
				label: '2nd',
				shape: 'key',
				x: 162,
				y: 60,
				w: 16,
				h: 30
			},
			// Rolling left 1 down to open the small vent in its plate. A
			// fingering lists H in place of L1.
			{
				id: 'H',
				name: 'half-hole (left first finger rolled down)',
				label: '½',
				shape: 'key',
				x: 120,
				y: 74,
				w: 22,
				h: 14
			},
			{
				id: 'L1',
				name: 'left first finger',
				label: '1',
				shape: 'hole',
				x: 120,
				y: 98,
				w: 22,
				h: 22
			},
			{
				id: 'L2',
				name: 'left second finger',
				label: '2',
				shape: 'hole',
				x: 120,
				y: 136,
				w: 22,
				h: 22
			},
			{
				id: 'L3',
				name: 'left third finger',
				label: '3',
				shape: 'hole',
				x: 120,
				y: 172,
				w: 22,
				h: 22
			},
			// The left pinky cluster: G♯ above, the left F lever over low B
			// and B♭, and the left E♭ innermost.
			{
				id: 'G#',
				name: 'G♯ key (left pinky)',
				label: 'G♯',
				shape: 'key',
				x: 162,
				y: 168,
				w: 24,
				h: 14
			},
			{
				id: 'LF',
				name: 'left F key (left pinky)',
				label: 'F',
				shape: 'key',
				x: 204,
				y: 168,
				w: 24,
				h: 14
			},
			{
				id: 'LEb',
				name: 'left E♭ key (left pinky)',
				label: 'E♭',
				shape: 'key',
				x: 162,
				y: 192,
				w: 24,
				h: 14
			},
			{
				id: 'B',
				name: 'low B key (left pinky)',
				label: 'B',
				shape: 'key',
				x: 190,
				y: 192,
				w: 24,
				h: 14
			},
			{
				id: 'Bb',
				name: 'low B♭ key (left pinky)',
				label: 'B♭',
				shape: 'key',
				x: 218,
				y: 192,
				w: 24,
				h: 14
			},
			{
				id: 'R1',
				name: 'right first finger',
				label: '1',
				shape: 'hole',
				x: 120,
				y: 246,
				w: 22,
				h: 22
			},
			{
				id: 'R2',
				name: 'right second finger',
				label: '2',
				shape: 'hole',
				x: 120,
				y: 282,
				w: 22,
				h: 22
			},
			// The narrow key between right 2 and 3 that the third finger
			// presses for regular F.
			{
				id: 'F',
				name: 'F key (right third finger)',
				label: 'F',
				shape: 'key',
				x: 120,
				y: 308,
				w: 22,
				h: 14
			},
			{
				id: 'R3',
				name: 'right third finger',
				label: '3',
				shape: 'hole',
				x: 120,
				y: 334,
				w: 22,
				h: 22
			},
			{
				id: 'C',
				name: 'low C key (right pinky)',
				label: 'C',
				shape: 'key',
				x: 76,
				y: 362,
				w: 28,
				h: 14
			},
			{
				id: 'C#',
				name: 'low C♯ key (right pinky)',
				label: 'C♯',
				shape: 'key',
				x: 76,
				y: 384,
				w: 28,
				h: 14
			},
			{
				id: 'Eb',
				name: 'E♭ key (right pinky)',
				label: 'E♭',
				shape: 'key',
				x: 76,
				y: 406,
				w: 28,
				h: 14
			}
		]
	},
	chart: {
		// The lowest notes keep the right pinky on low C.
		'A#3': ['L1 L2 L3 Bb R1 R2 R3 C'],
		B3: ['L1 L2 L3 B R1 R2 R3 C'],
		C4: ['L1 L2 L3 R1 R2 R3 C'],
		'C#4': ['L1 L2 L3 R1 R2 R3 C#'],
		D4: ['L1 L2 L3 R1 R2 R3'],
		// E♭ has a key in each hand; the left one is for next to C♯ or C.
		'D#4': ['L1 L2 L3 R1 R2 R3 Eb', 'L1 L2 L3 LEb R1 R2 R3'],
		E4: ['L1 L2 L3 R1 R2'],
		// Regular F, with the right F key, is on every oboe and is the one
		// method books and the Fox chart show first. The left F key opens the
		// same pad. Forked F needs the E♭ key on an oboe without a resonance
		// key and must leave it up on one with, so it is right either way.
		F4: [
			'L1 L2 L3 R1 R2 F',
			'L1 L2 L3 LF R1 R2',
			'L1 L2 L3 R1 R3',
			'L1 L2 L3 R1 R3 Eb',
			'L1 L2 L3 LEb R1 R3'
		],
		'F#4': ['L1 L2 L3 R1'],
		G4: ['L1 L2 L3'],
		'G#4': ['L1 L2 L3 G#'],
		A4: ['L1 L2'],
		'A#4': ['L1 L2 R1'],
		B4: ['L1'],
		C5: ['L1 R1'],
		// C♯ to E♭ in the second octave use the half-hole instead of an
		// octave key.
		'C#5': ['H L2 L3 R1 R2 R3 C#'],
		D5: ['H L2 L3 R1 R2 R3'],
		'D#5': ['H L2 L3 R1 R2 R3 Eb', 'H L2 L3 LEb R1 R2 R3'],
		// E to G♯ add the thumb octave key to the low fingering.
		E5: ['oct L1 L2 L3 R1 R2'],
		F5: [
			'oct L1 L2 L3 R1 R2 F',
			'oct L1 L2 L3 LF R1 R2',
			'oct L1 L2 L3 R1 R3',
			'oct L1 L2 L3 R1 R3 Eb',
			'oct L1 L2 L3 LEb R1 R3'
		],
		'F#5': ['oct L1 L2 L3 R1'],
		G5: ['oct L1 L2 L3'],
		'G#5': ['oct L1 L2 L3 G#'],
		// A to C take the second octave key. The Fox chart lets the thumb stay
		// on the first octave key for these, so that is accepted too.
		A5: ['oct2 L1 L2', 'oct oct2 L1 L2'],
		'A#5': ['oct2 L1 L2 R1', 'oct oct2 L1 L2 R1'],
		B5: ['oct2 L1', 'oct oct2 L1'],
		C6: ['oct2 L1 R1', 'oct oct2 L1 R1'],
		// Above the staff the fingerings are their own: no octave key for C♯
		// and D, and the half-hole comes back from D.
		'C#6': ['L2 L3 R1 C'],
		D6: ['H L2 L3 C', 'H L2 L3 R2 C'],
		'D#6': ['H L2 L3 B R2 R3', 'H L2 L3 R2 R3 Eb'],
		E6: ['oct H L2 L3 G# LEb R2 R3', 'oct H L2 L3 G# R2 R3 Eb']
	}
};
