// The flute, drawn side-on with the headjoint to the left, as method books
// draw it. The thumb keys sit under the body, below the left hand; the pinky
// keys sit under it at the foot. No B footjoint and no trill keys: no note
// asked about needs them.
//
// Fingerings follow the Woodwind Fingering Guide's basic chart, checked
// against fingerchart.com and fluteinfo.com. Flute sounds as written, and the
// second octave is fingered like the first (C♯ to C♯), only blown harder.

import type { Woodwind } from '../woodwinds';

/**
 * The thumb can rest on either lever whenever left 2 or right 1 is down, since
 * the B♭ lever only changes the note when both are up. Players keep it on B♭
 * through flat keys, so both are right; the B key is shown first.
 */
function eitherThumb(rest: string): string[] {
	return [`B ${rest}`, `Bb ${rest}`];
}

export const FLUTE: Woodwind = {
	layout: {
		width: 400,
		height: 100,
		body: [
			// Headjoint, lip plate, body and footjoint.
			{ x: 6, y: 38, w: 100, h: 28, r: 6 },
			{ x: 40, y: 32, w: 24, h: 40, r: 10 },
			{ x: 106, y: 38, w: 216, h: 28, r: 4 },
			{ x: 322, y: 38, w: 72, h: 28, r: 6 }
		],
		keys: [
			// The B♭ lever sits nearer the headjoint than the B key.
			{ id: 'Bb', name: 'thumb B♭ lever', label: 'B♭', shape: 'key', x: 124, y: 82, w: 18, h: 14 },
			{ id: 'B', name: 'thumb B key', label: 'B', shape: 'key', x: 150, y: 82, w: 26, h: 14 },
			{
				id: 'L1',
				name: 'left first finger',
				label: '1',
				shape: 'hole',
				x: 136,
				y: 52,
				w: 22,
				h: 22
			},
			{
				id: 'L2',
				name: 'left second finger',
				label: '2',
				shape: 'hole',
				x: 170,
				y: 52,
				w: 22,
				h: 22
			},
			{
				id: 'L3',
				name: 'left third finger',
				label: '3',
				shape: 'hole',
				x: 196,
				y: 52,
				w: 22,
				h: 22
			},
			{
				id: 'G#',
				name: 'G♯ key (left pinky)',
				label: 'G♯',
				shape: 'key',
				x: 224,
				y: 80,
				w: 22,
				h: 14
			},
			{
				id: 'R1',
				name: 'right first finger',
				label: '1',
				shape: 'hole',
				x: 250,
				y: 52,
				w: 22,
				h: 22
			},
			{
				id: 'R2',
				name: 'right second finger',
				label: '2',
				shape: 'hole',
				x: 276,
				y: 52,
				w: 22,
				h: 22
			},
			{
				id: 'R3',
				name: 'right third finger',
				label: '3',
				shape: 'hole',
				x: 302,
				y: 52,
				w: 22,
				h: 22
			},
			{
				id: 'Eb',
				name: 'E♭ key (right pinky)',
				label: 'E♭',
				shape: 'key',
				x: 330,
				y: 80,
				w: 22,
				h: 14
			},
			{
				id: 'C#',
				name: 'C♯ roller (right pinky)',
				label: 'C♯',
				shape: 'key',
				x: 356,
				y: 80,
				w: 22,
				h: 14
			},
			{
				id: 'C',
				name: 'C roller (right pinky)',
				label: 'C',
				shape: 'key',
				x: 382,
				y: 80,
				w: 22,
				h: 14
			}
		]
	},
	// The right pinky holds the E♭ key down on almost every note, for venting
	// and balance; it is left off only for the two Ds and the footjoint notes.
	chart: {
		// The C roller closes the C♯ pad as well, so pressing both rollers is
		// the same low C.
		C4: [...eitherThumb('L1 L2 L3 R1 R2 R3 C'), ...eitherThumb('L1 L2 L3 R1 R2 R3 C# C')],
		'C#4': eitherThumb('L1 L2 L3 R1 R2 R3 C#'),
		D4: eitherThumb('L1 L2 L3 R1 R2 R3'),
		'D#4': eitherThumb('L1 L2 L3 R1 R2 R3 Eb'),
		E4: eitherThumb('L1 L2 L3 R1 R2 Eb'),
		F4: eitherThumb('L1 L2 L3 R1 Eb'),
		'F#4': eitherThumb('L1 L2 L3 R3 Eb'),
		G4: eitherThumb('L1 L2 L3 Eb'),
		'G#4': eitherThumb('L1 L2 L3 G# Eb'),
		A4: eitherThumb('L1 L2 Eb'),
		// Thumb B♭ first, as most method books teach it; one-and-one is the
		// other standard B♭, needed next to B natural.
		'A#4': ['Bb L1 Eb', 'B L1 R1 Eb', 'Bb L1 R1 Eb'],
		B4: ['B L1 Eb'],
		C5: ['L1 Eb'],
		'C#5': ['Eb'],
		// Middle D and E♭ lift left 1 to vent the second octave.
		D5: eitherThumb('L2 L3 R1 R2 R3'),
		'D#5': eitherThumb('L2 L3 R1 R2 R3 Eb'),
		E5: eitherThumb('L1 L2 L3 R1 R2 Eb'),
		F5: eitherThumb('L1 L2 L3 R1 Eb'),
		'F#5': eitherThumb('L1 L2 L3 R3 Eb'),
		G5: eitherThumb('L1 L2 L3 Eb'),
		'G#5': eitherThumb('L1 L2 L3 G# Eb'),
		A5: eitherThumb('L1 L2 Eb'),
		'A#5': ['Bb L1 Eb', 'B L1 R1 Eb', 'Bb L1 R1 Eb'],
		B5: ['B L1 Eb'],
		C6: ['L1 Eb'],
		'C#6': ['Eb'],
		// The third octave has fingerings of its own: high D is an overblown G
		// with left 1 lifted.
		D6: eitherThumb('L2 L3 Eb'),
		'D#6': eitherThumb('L1 L2 L3 G# R1 R2 R3 Eb'),
		E6: eitherThumb('L1 L2 R1 R2 Eb')
	}
};
