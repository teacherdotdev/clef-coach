/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
	ALL_BAND_INSTRUMENTS,
	ALL_CONCERT_KEYS,
	ALL_LEVELS,
	BAND_INSTRUMENTS,
	bandFingerings,
	bandRange,
	describeBandFingering,
	isRightFingering,
	pitchOfName,
	valveAnswer,
	woodwindOf,
	writtenKey,
	type BandInstrument
} from './band';
import { keysIn, woodwindAnswer } from './woodwinds';
import { ALL_KEYS, fromDiatonicIndex, parseNoteName, pitchInKey } from './music';

/** The written pitches a range asks about in a key. */
function pitchesIn(inst: BandInstrument, range: { low: string; high: string }, key = 'C') {
	const out: number[] = [];
	for (let i = parseNoteName(range.low); i <= parseNoteName(range.high); i++)
		out.push(pitchInKey(i, key as never));
	return out;
}

describe('written keys', () => {
	test('concert B♭ is each instrument’s first-page key', () => {
		expect(writtenKey('Bb', 'trumpet')).toBe('C');
		expect(writtenKey('Bb', 'baritoneTC')).toBe('C');
		expect(writtenKey('Bb', 'horn')).toBe('F');
		expect(writtenKey('Bb', 'trombone')).toBe('Bb');
		expect(writtenKey('Bb', 'tuba')).toBe('Bb');
		expect(writtenKey('Bb', 'bells')).toBe('Bb');
	});

	test('the other concert keys transpose as a band director expects', () => {
		expect(writtenKey('Eb', 'trumpet')).toBe('F');
		expect(writtenKey('Ab', 'trumpet')).toBe('Bb');
		expect(writtenKey('G', 'trumpet')).toBe('A');
		expect(writtenKey('Db', 'horn')).toBe('Ab');
		expect(writtenKey('C', 'horn')).toBe('G');
		expect(writtenKey('Db', 'tuba')).toBe('Db');
	});

	test('every concert key lands on a key the app can draw', () => {
		for (const concert of ALL_CONCERT_KEYS)
			for (const inst of ALL_BAND_INSTRUMENTS)
				expect(ALL_KEYS).toContain(writtenKey(concert, inst));
	});
});

describe('levels', () => {
	test('Beginner is concert B♭, C, D, E♭, F on every instrument', () => {
		for (const inst of ALL_BAND_INSTRUMENTS) {
			const key = writtenKey('Bb', inst);
			const written = pitchesIn(inst, BAND_INSTRUMENTS[inst].levels.beginner, key);
			const shift = BAND_INSTRUMENTS[inst].transposition;
			const classes = written.map((p) => (((p - shift) % 12) + 12) % 12);
			// B♭ C D E♭ F
			expect(classes).toEqual([10, 0, 2, 3, 5]);
		}
	});

	test('every note of every level can be played in every concert key', () => {
		for (const inst of ALL_BAND_INSTRUMENTS)
			for (const level of ALL_LEVELS)
				for (const concert of ALL_CONCERT_KEYS) {
					const key = writtenKey(concert, inst);
					const range = BAND_INSTRUMENTS[inst].levels[level];
					// A level may start on a letter the key does not reach (F3 on
					// trumpet is only playable as F♯), but never on a gap in the middle.
					const pitches = pitchesIn(inst, range, key);
					const playable = pitches.map((p) => bandFingerings(inst, p).length > 0);
					const first = playable.indexOf(true);
					const last = playable.lastIndexOf(true);
					expect(first).toBeGreaterThanOrEqual(0);
					expect(first).toBeLessThanOrEqual(1);
					expect(last).toBeGreaterThanOrEqual(playable.length - 2);
					expect(playable.slice(first, last + 1).every(Boolean)).toBe(true);
				}
	});

	test('a teacher’s range replaces the level’s', () => {
		expect(bandRange('trumpet', 'beginner')).toEqual({ low: 'C4', high: 'G4' });
		expect(bandRange('trumpet', 'beginner', { low: 'C4', high: 'C5' })).toEqual({
			low: 'C4',
			high: 'C5'
		});
	});
});

describe('fingerings', () => {
	test('trumpet first five', () => {
		const names = ['C4', 'D4', 'E4', 'F4', 'G4'];
		expect(names.map((n) => bandFingerings('trumpet', pitchOfName(n))[0])).toEqual([
			'0',
			'13',
			'12',
			'1',
			'0'
		]);
	});

	test('horn first five, F side first', () => {
		const names = ['F4', 'G4', 'A4', 'Bb4', 'C5'];
		expect(names.map((n) => bandFingerings('horn', pitchOfName(n))[0])).toEqual([
			'1',
			'0',
			'12',
			'1',
			'0'
		]);
	});

	test('trombone first five in positions', () => {
		const names = ['Bb2', 'C3', 'D3', 'Eb3', 'F3'];
		expect(names.map((n) => bandFingerings('trombone', pitchOfName(n))[0])).toEqual([
			'1',
			'6',
			'4',
			'3',
			'1'
		]);
	});

	test('baritone and tuba first five match the trumpet’s fingerings', () => {
		const first = (inst: BandInstrument, names: string[]) =>
			names.map((n) => bandFingerings(inst, pitchOfName(n))[0]);
		const trumpet = first('trumpet', ['C4', 'D4', 'E4', 'F4', 'G4']);
		expect(first('baritone', ['Bb2', 'C3', 'D3', 'Eb3', 'F3'])).toEqual(trumpet);
		expect(first('tuba', ['Bb1', 'C2', 'D2', 'Eb2', 'F2'])).toEqual(trumpet);
		expect(first('baritoneTC', ['C4', 'D4', 'E4', 'F4', 'G4'])).toEqual(trumpet);
	});

	test('alternates are accepted, and so is the first-taught fingering', () => {
		const a4 = pitchOfName('A4');
		expect(isRightFingering('trumpet', a4, '12')).toBe(true);
		expect(isRightFingering('trumpet', a4, '3')).toBe(true);
		expect(isRightFingering('trumpet', a4, '1')).toBe(false);
		expect(isRightFingering('horn', pitchOfName('A4'), 'T0')).toBe(true);
		expect(isRightFingering('trombone', pitchOfName('F3'), '6')).toBe(true);
	});

	test('a sharp and its flat are the same fingering', () => {
		expect(bandFingerings('trumpet', pitchOfName('Bb3'))).toEqual(
			bandFingerings('trumpet', pitchOfName('A#3'))
		);
	});

	test('notes outside the instrument have no fingering', () => {
		expect(bandFingerings('trumpet', pitchOfName('E3'))).toEqual([]);
		expect(bandFingerings('trombone', pitchOfName('Eb2'))).toEqual([]);
		expect(bandFingerings('bells', pitchOfName('C7'))).toEqual([]);
	});

	test('bells are answered by the bar itself', () => {
		const p = pitchOfName('Bb4');
		expect(isRightFingering('bells', p, String(p))).toBe(true);
		expect(isRightFingering('bells', p, String(p + 1))).toBe(false);
	});

	test('every chart entry is a fingering the drawing can produce', () => {
		for (const inst of ALL_BAND_INSTRUMENTS) {
			const controls = BAND_INSTRUMENTS[inst].controls;
			for (let p = 0; p < 120; p++)
				for (const f of bandFingerings(inst, p)) {
					if (controls === 'slide') expect(f).toMatch(/^[1-7]$/);
					else if (controls === 'bars') expect(f).toBe(String(p));
					else if (controls === 'woodwind')
						expect(woodwindAnswer(woodwindOf(inst)!.layout, keysIn(f))).toBe(f);
					else expect(valveAnswer(f.split(''))).toBe(f);
					if (controls === 'valves') expect(f).not.toContain('T');
				}
		}
	});

	// A ledger line too many is unreadable for a beginner, and the staff runs
	// out of room past three.
	test('every level stays within three ledger lines of the staff', () => {
		const bottom = { treble: parseNoteName('E4'), bass: parseNoteName('G2') };
		for (const inst of ALL_BAND_INSTRUMENTS)
			for (const level of ALL_LEVELS) {
				const { clef, levels } = BAND_INSTRUMENTS[inst];
				const b = bottom[clef as 'treble' | 'bass'];
				expect(parseNoteName(levels[level].low)).toBeGreaterThanOrEqual(b - 6);
				expect(parseNoteName(levels[level].high)).toBeLessThanOrEqual(b + 14);
			}
	});
});

describe('answers', () => {
	test('valves pressed in any order give the same answer', () => {
		expect(valveAnswer(['2', '1'])).toBe('12');
		expect(valveAnswer(['3', 'T', '1'])).toBe('T13');
		expect(valveAnswer([])).toBe('0');
		expect(valveAnswer(['T'])).toBe('T0');
	});

	test('fingerings read back in words', () => {
		expect(describeBandFingering('trumpet', '0')).toBe('open');
		expect(describeBandFingering('trumpet', '13')).toBe('valves 1 and 3');
		expect(describeBandFingering('trumpet', '123')).toBe('valves 1, 2 and 3');
		expect(describeBandFingering('horn', 'T2')).toBe('trigger and valve 2');
		expect(describeBandFingering('horn', 'T0')).toBe('trigger, open');
		expect(describeBandFingering('trombone', '6')).toBe('6th position');
	});

	test('pitch names parse sharps and flats', () => {
		expect(pitchOfName('C4')).toBe(48);
		expect(pitchOfName('Bb3')).toBe(46);
		expect(pitchOfName('A#3')).toBe(46);
		expect(fromDiatonicIndex(parseNoteName('C4'))).toEqual({ letter: 'C', octave: 4 });
	});
});
