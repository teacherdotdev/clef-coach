// What a band or piano student reads and plays, worked out from the activity's
// settings and — for band — the instrument the student picked. The exercise
// asks its questions from this, so band and piano share one question loop.

import {
	BAND_INSTRUMENTS,
	bandFingerings,
	bandRange,
	writtenKey,
	type BandInstrument,
	type Controls
} from './band';
import { parseNoteName, pitchInKey, type Accidental, type Clef, type KeyId } from './music';
import { PIANO_HIGHEST, PIANO_LEVELS, PIANO_LOWEST } from './piano';
import type { Settings } from './settings';

/** A staff the student reads, and the notes it may show, as diatonic indices. */
export interface Stave {
	clef: Clef;
	low: number;
	high: number;
}

export interface Practice {
	/** The band instrument, or null for piano. */
	instrument: BandInstrument | null;
	controls: Controls | 'piano';
	/** The written key every staff is in. */
	key: KeyId;
	/** One staff, or treble and bass for a piano reading both. */
	staves: Stave[];
	/** Whether the note is named before it is played. */
	askName: boolean;
	/**
	 * Every right answer for a written note, the first-taught first; empty when
	 * the instrument cannot play it. A keyboard's answer is the key's pitch.
	 */
	plays: (index: number, accidental?: Accidental | null) => string[];
}

function stave(clef: Clef, range: { low: string; high: string }): Stave {
	const a = parseNoteName(range.low);
	const b = parseNoteName(range.high);
	return { clef, low: Math.min(a, b), high: Math.max(a, b) };
}

export function bandPractice(s: Settings, inst: BandInstrument): Practice {
	const def = BAND_INSTRUMENTS[inst];
	const key = writtenKey(s.concertKey, inst);
	return {
		instrument: inst,
		controls: def.controls,
		key,
		staves: [stave(def.clef, bandRange(inst, s.level, s.rangeOverrides[inst]))],
		// Striking the bar already names it.
		askName: s.askName && def.controls !== 'bars',
		plays: (index, accidental = null) => bandFingerings(inst, pitchInKey(index, key, accidental))
	};
}

export function pianoPractice(s: Settings): Practice {
	const ranges = PIANO_LEVELS[s.level];
	const clefs: ('treble' | 'bass')[] =
		s.pianoClefs === 'both' ? ['treble', 'bass'] : [s.pianoClefs];
	return {
		instrument: null,
		controls: 'piano',
		key: s.key,
		staves: clefs.map((c) => stave(c, ranges[c])),
		askName: s.askName,
		plays: (index, accidental = null) => {
			const pitch = pitchInKey(index, s.key, accidental);
			return pitch >= PIANO_LOWEST && pitch <= PIANO_HIGHEST ? [String(pitch)] : [];
		}
	};
}

/**
 * The keys or bars to draw for a range: whole octaves from the C at or below
 * the lowest note to the B above the highest, so every note — and a sharp or
 * flat on the notes at either end — has its key, and the student still has to
 * find it among others.
 */
export function keyboardSpan(staves: Stave[], key: KeyId): { low: number; high: number } {
	const low = Math.min(...staves.map((s) => pitchInKey(s.low, key, 'flat')));
	const high = Math.max(...staves.map((s) => pitchInKey(s.high, key, 'sharp')));
	return { low: low - (((low % 12) + 12) % 12), high: high + 11 - (((high % 12) + 12) % 12) };
}
