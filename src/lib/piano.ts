// The piano activity: which clefs are read, and how far each level reaches in
// each of them. The answer is the key itself, so there is no chart to keep.

import type { Level, Range } from './band';

/** Which hand's notes are read: right (treble), left (bass), or both. */
export type PianoClefs = 'treble' | 'bass' | 'both';

export const ALL_PIANO_CLEFS: PianoClefs[] = ['treble', 'bass', 'both'];

export const PIANO_CLEF_NAMES: Record<PianoClefs, string> = {
	treble: 'Treble clef',
	bass: 'Bass clef',
	both: 'Both (grand staff)'
};

// Beginner is "C position" in each hand: the five notes from middle C up in
// the right hand, and the five from the C below it in the left. The higher
// levels stay within three ledger lines of each staff.
export const PIANO_LEVELS: Record<Level, { treble: Range; bass: Range }> = {
	beginner: { treble: { low: 'C4', high: 'G4' }, bass: { low: 'C3', high: 'G3' } },
	intermediate: { treble: { low: 'C4', high: 'C6' }, bass: { low: 'C2', high: 'C4' } },
	advanced: { treble: { low: 'A3', high: 'D6' }, bass: { low: 'B1', high: 'E4' } }
};

/** The piano's lowest and highest keys, A0 and C8, as pitch numbers. */
export const PIANO_LOWEST = 0 * 12 + 9;
export const PIANO_HIGHEST = 8 * 12;
