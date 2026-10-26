// The band instruments: how each one reads, how far it transposes, the notes
// each level asks about, and how every note is fingered.
//
// Unlike the strings, nothing here can be worked out from first principles.
// Which valves play a note is a fact of the instrument and of how it is taught,
// with conventional alternates, so the fingerings are written out as charts
// (see docs/adr/0005). A band teacher checks them on the fingering chart page.
//
// Everything is in *written* pitch — the note on the student's part, which is
// what they read and finger. Concert pitch only comes in through the key: a
// band activity is set in a concert key, and each instrument reads it in its own
// written key (docs/adr/0001).

import { chromaticPitch, ordinal, pitchClass, type Clef, type KeyId } from './music';
import { keysIn, type Woodwind } from './woodwinds';
import { BASSOON } from './woodwinds/bassoon';
import { CLARINET } from './woodwinds/clarinet';
import { FLUTE } from './woodwinds/flute';
import { OBOE } from './woodwinds/oboe';
import { SAXOPHONE } from './woodwinds/saxophone';

export type BandInstrument =
	| 'flute'
	| 'oboe'
	| 'clarinet'
	| 'bassoon'
	| 'altoSax'
	| 'tenorSax'
	| 'bariSax'
	| 'trumpet'
	| 'horn'
	| 'trombone'
	| 'baritone'
	| 'baritoneTC'
	| 'tuba'
	| 'bells';

// In score order, woodwinds first, as a band director reads down the score.
export const ALL_BAND_INSTRUMENTS: BandInstrument[] = [
	'flute',
	'oboe',
	'clarinet',
	'bassoon',
	'altoSax',
	'tenorSax',
	'bariSax',
	'trumpet',
	'horn',
	'trombone',
	'baritone',
	'baritoneTC',
	'tuba',
	'bells'
];

/** How far into the instrument's range an activity reaches. */
export type Level = 'beginner' | 'intermediate' | 'advanced';

export const ALL_LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];

export const LEVEL_NAMES: Record<Level, string> = {
	beginner: 'Beginner',
	intermediate: 'Intermediate',
	advanced: 'Advanced'
};

/** The keys school band music is in, named in concert pitch (docs/adr/0003). */
export type ConcertKey = 'Bb' | 'Eb' | 'F' | 'Ab' | 'C' | 'Db' | 'G';

export const ALL_CONCERT_KEYS: ConcertKey[] = ['Bb', 'Eb', 'F', 'Ab', 'C', 'Db', 'G'];

export const CONCERT_KEY_NAMES: Record<ConcertKey, string> = {
	Bb: 'Concert B♭',
	Eb: 'Concert E♭',
	F: 'Concert F',
	Ab: 'Concert A♭',
	C: 'Concert C',
	Db: 'Concert D♭',
	G: 'Concert G'
};

/**
 * What the student answers on: three piston valves, the horn's three rotary
 * valves and thumb trigger, the trombone's slide, a woodwind's keys, or a row
 * of bars.
 */
export type Controls = 'valves' | 'horn' | 'slide' | 'woodwind' | 'bars';

/** Everything that differs between the kinds of drawing, in one place. */
export interface ControlsInfo {
	/** What the student is asked to do. */
	prompt: string;
	/**
	 * A fingering is several things held at once and needs a Play button; a key
	 * or bar is played the moment it is struck.
	 */
	playButton: boolean;
	/** Computer keys held down to press each valve. */
	keyboard: Record<string, string>;
	/** A keyboard needs the whole width, without the instrument's picture. */
	wide: boolean;
}

export const CONTROLS: Record<Controls | 'piano', ControlsInfo> = {
	// The right hand's home row works the three piston valves.
	valves: {
		prompt: 'Press the valves, then press Play',
		playButton: true,
		keyboard: { j: '1', k: '2', l: '3' },
		wide: false
	},
	// The horn is played with the left hand, so its valves sit under that
	// hand's fingers and the thumb works the trigger.
	horn: {
		prompt: 'Press the valves, then press Play',
		playButton: true,
		keyboard: { f: '1', d: '2', s: '3', ' ': 'T' },
		wide: false
	},
	slide: { prompt: 'Move the slide, then press Play', playButton: true, keyboard: {}, wide: false },
	// Too many keys at once for a home-row mapping, so woodwinds are clicked.
	woodwind: {
		prompt: 'Press the keys, then press Play',
		playButton: true,
		keyboard: {},
		wide: false
	},
	bars: { prompt: 'Strike the bar for this note', playButton: false, keyboard: {}, wide: true },
	piano: { prompt: 'Click the key for this note', playButton: false, keyboard: {}, wide: true }
};

/** A low and high note, as names like 'C4'. Sharps and flats come from the key. */
export interface Range {
	low: string;
	high: string;
}

export interface BandInstrumentDef {
	id: BandInstrument;
	name: string;
	clef: Clef;
	/**
	 * Half steps the written note sits above the sounding one, within the
	 * octave: 2 for a B♭ instrument, 7 for horn in F, 0 for one that reads at
	 * concert pitch. Only the key needs it — ranges are written out per level.
	 */
	transposition: number;
	controls: Controls;
	levels: Record<Level, Range>;
}

// The ranges are written pitch. Beginner is the "first five": concert B♭, C,
// D, E♭, F, in each instrument's own octave and transposition. The woodwind
// octaves are assumptions a teacher should check
// (docs/specs/phase-2-3-assumptions.md).
export const BAND_INSTRUMENTS: Record<BandInstrument, BandInstrumentDef> = {
	flute: {
		id: 'flute',
		name: 'Flute',
		clef: 'treble',
		transposition: 0,
		controls: 'woodwind',
		levels: {
			beginner: { low: 'B4', high: 'F5' },
			intermediate: { low: 'D4', high: 'D6' },
			advanced: { low: 'C4', high: 'E6' }
		}
	},
	oboe: {
		id: 'oboe',
		name: 'Oboe',
		clef: 'treble',
		transposition: 0,
		controls: 'woodwind',
		levels: {
			beginner: { low: 'B4', high: 'F5' },
			intermediate: { low: 'D4', high: 'D6' },
			advanced: { low: 'B3', high: 'E6' }
		}
	},
	// Intermediate crosses the break, the second-year clarinettist's milestone.
	clarinet: {
		id: 'clarinet',
		name: 'Clarinet',
		clef: 'treble',
		transposition: 2,
		controls: 'woodwind',
		levels: {
			beginner: { low: 'C4', high: 'G4' },
			intermediate: { low: 'G3', high: 'E5' },
			advanced: { low: 'F3', high: 'E6' }
		}
	},
	bassoon: {
		id: 'bassoon',
		name: 'Bassoon',
		clef: 'bass',
		transposition: 0,
		controls: 'woodwind',
		levels: {
			beginner: { low: 'B2', high: 'F3' },
			intermediate: { low: 'F2', high: 'C4' },
			advanced: { low: 'B1', high: 'G4' }
		}
	},
	// The three saxophones finger alike and read treble clef; they differ in
	// the key they read concert pitch in, and tenor starts an octave up.
	altoSax: {
		id: 'altoSax',
		name: 'Alto Sax',
		clef: 'treble',
		transposition: 9,
		controls: 'woodwind',
		levels: {
			beginner: { low: 'G4', high: 'D5' },
			intermediate: { low: 'D4', high: 'C6' },
			advanced: { low: 'B3', high: 'E6' }
		}
	},
	tenorSax: {
		id: 'tenorSax',
		name: 'Tenor Sax',
		clef: 'treble',
		transposition: 2,
		controls: 'woodwind',
		levels: {
			beginner: { low: 'C5', high: 'G5' },
			intermediate: { low: 'D4', high: 'C6' },
			advanced: { low: 'B3', high: 'E6' }
		}
	},
	bariSax: {
		id: 'bariSax',
		name: 'Bari Sax',
		clef: 'treble',
		transposition: 9,
		controls: 'woodwind',
		levels: {
			beginner: { low: 'G4', high: 'D5' },
			intermediate: { low: 'D4', high: 'C6' },
			advanced: { low: 'B3', high: 'E6' }
		}
	},
	trumpet: {
		id: 'trumpet',
		name: 'Trumpet',
		clef: 'treble',
		transposition: 2,
		controls: 'valves',
		levels: {
			beginner: { low: 'C4', high: 'G4' },
			intermediate: { low: 'A3', high: 'D5' },
			advanced: { low: 'G3', high: 'C6' }
		}
	},
	horn: {
		id: 'horn',
		name: 'French Horn',
		clef: 'treble',
		transposition: 7,
		controls: 'horn',
		levels: {
			beginner: { low: 'F4', high: 'C5' },
			intermediate: { low: 'C4', high: 'F5' },
			advanced: { low: 'G3', high: 'G5' }
		}
	},
	trombone: {
		id: 'trombone',
		name: 'Trombone',
		clef: 'bass',
		transposition: 0,
		controls: 'slide',
		levels: {
			beginner: { low: 'B2', high: 'F3' },
			intermediate: { low: 'F2', high: 'C4' },
			advanced: { low: 'E2', high: 'F4' }
		}
	},
	baritone: {
		id: 'baritone',
		name: 'Baritone (bass clef)',
		clef: 'bass',
		transposition: 0,
		controls: 'valves',
		levels: {
			beginner: { low: 'B2', high: 'F3' },
			intermediate: { low: 'F2', high: 'C4' },
			advanced: { low: 'E2', high: 'F4' }
		}
	},
	// Treble-clef baritone parts are written like a trumpet's, a ninth above
	// the sound, so the player reads and fingers exactly as a trumpeter does.
	baritoneTC: {
		id: 'baritoneTC',
		name: 'Baritone T.C.',
		clef: 'treble',
		transposition: 2,
		controls: 'valves',
		levels: {
			beginner: { low: 'C4', high: 'G4' },
			intermediate: { low: 'G3', high: 'D5' },
			advanced: { low: 'G3', high: 'G5' }
		}
	},
	tuba: {
		id: 'tuba',
		name: 'Tuba',
		clef: 'bass',
		transposition: 0,
		controls: 'valves',
		levels: {
			beginner: { low: 'B1', high: 'F2' },
			intermediate: { low: 'A1', high: 'D3' },
			advanced: { low: 'A1', high: 'F3' }
		}
	},
	// Bells sound two octaves above the written note, which changes nothing
	// about the key or the reading.
	bells: {
		id: 'bells',
		name: 'Bells',
		clef: 'treble',
		transposition: 0,
		controls: 'bars',
		levels: {
			beginner: { low: 'B4', high: 'F5' },
			intermediate: { low: 'F4', high: 'C6' },
			advanced: { low: 'G3', high: 'C6' }
		}
	}
};

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

const CONCERT_PITCH_CLASS: Record<ConcertKey, number> = {
	C: 0,
	Db: 1,
	Eb: 3,
	F: 5,
	G: 7,
	Ab: 8,
	Bb: 10
};

// How each pitch class is spelled as a written key. The seven concert keys,
// moved by each instrument's transposition, never land on F♯/G♭ or B, so those
// are not needed.
const KEY_OF_PITCH_CLASS: Record<number, KeyId> = {
	0: 'C',
	1: 'Db',
	2: 'D',
	3: 'Eb',
	4: 'E',
	5: 'F',
	7: 'G',
	8: 'Ab',
	9: 'A',
	10: 'Bb'
};

/** The key this instrument reads a concert key in: concert B♭ is C on trumpet. */
export function writtenKey(concert: ConcertKey, inst: BandInstrument): KeyId {
	const pc = (CONCERT_PITCH_CLASS[concert] + BAND_INSTRUMENTS[inst].transposition) % 12;
	return KEY_OF_PITCH_CLASS[pc];
}

/** The level's range for this instrument, unless the teacher has set their own. */
export function bandRange(inst: BandInstrument, level: Level, override?: Range | null): Range {
	return override ?? BAND_INSTRUMENTS[inst].levels[level];
}

// ---------------------------------------------------------------------------
// Fingering charts
// ---------------------------------------------------------------------------

// Each chart maps a written note to every standard way of playing it, the one
// taught first leading. Valve fingerings list the valves held down ("12" is
// first and second valves, "0" is open); "T" is the horn's thumb trigger, which
// switches to the B♭ side. Trombone fingerings are slide positions.
//
// Sharps are used throughout; a flat is the same key on these instruments.
type Chart = Record<string, string[]>;

const TRUMPET: Chart = {
	'F#3': ['123'],
	G3: ['13'],
	'G#3': ['23'],
	A3: ['12'],
	'A#3': ['1'],
	B3: ['2'],
	C4: ['0'],
	'C#4': ['123'],
	D4: ['13'],
	'D#4': ['23'],
	E4: ['12', '3'],
	F4: ['1'],
	'F#4': ['2'],
	G4: ['0'],
	'G#4': ['23'],
	A4: ['12', '3'],
	'A#4': ['1'],
	B4: ['2'],
	C5: ['0'],
	'C#5': ['12', '3'],
	D5: ['1'],
	'D#5': ['2', '23'],
	E5: ['0', '12'],
	F5: ['1'],
	'F#5': ['2'],
	G5: ['0', '13'],
	'G#5': ['23'],
	A5: ['12', '3'],
	'A#5': ['1'],
	B5: ['2'],
	C6: ['0']
};

// The F side first, as beginners are taught, then the B♭ side.
const HORN: Chart = {
	'F#3': ['2'],
	G3: ['0'],
	'G#3': ['23'],
	A3: ['12'],
	'A#3': ['1'],
	B3: ['2'],
	C4: ['0', 'T0'],
	'C#4': ['12', 'T23'],
	D4: ['1', 'T12'],
	'D#4': ['2', 'T1'],
	E4: ['0', 'T2'],
	F4: ['1', 'T0'],
	'F#4': ['2', 'T12'],
	G4: ['0', 'T1'],
	'G#4': ['23', 'T2'],
	A4: ['12', 'T0'],
	'A#4': ['1', 'T1'],
	B4: ['2', 'T2'],
	C5: ['0', 'T0'],
	'C#5': ['12', 'T23'],
	D5: ['1', 'T12'],
	'D#5': ['2', 'T1'],
	E5: ['0', 'T2'],
	F5: ['1', 'T0'],
	'F#5': ['2', 'T2'],
	G5: ['0', 'T0'],
	'G#5': ['23', 'T2'],
	A5: ['12', 'T0']
};

const TROMBONE: Chart = {
	E2: ['7'],
	F2: ['6'],
	'F#2': ['5'],
	G2: ['4'],
	'G#2': ['3'],
	A2: ['2'],
	'A#2': ['1'],
	B2: ['7'],
	C3: ['6'],
	'C#3': ['5'],
	D3: ['4'],
	'D#3': ['3'],
	E3: ['2'],
	F3: ['1', '6'],
	'F#3': ['5'],
	G3: ['4'],
	'G#3': ['3'],
	A3: ['2'],
	'A#3': ['1', '5'],
	B3: ['4'],
	C4: ['3', '6'],
	'C#4': ['2', '5'],
	D4: ['1', '4'],
	'D#4': ['3'],
	E4: ['2'],
	F4: ['1']
};

const BELLS_LOW = 'G3';
const BELLS_HIGH = 'C6';

/** Pitch number of a note name like 'F#3', 'Bb3' or 'C4'. */
export function pitchOfName(name: string): number {
	const m = name.match(/^([A-G])([#b]?)(-?\d+)$/);
	if (!m) throw new Error(`Not a note name: ${name}`);
	const shift = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
	return chromaticPitch(m[1], Number(m[3])) + shift;
}

function byPitch(chart: Chart, shift = 0): Map<number, string[]> {
	return new Map(Object.entries(chart).map(([name, ways]) => [pitchOfName(name) + shift, ways]));
}

// The bass-clef baritone and the tuba are three-valve B♭ instruments like the
// trumpet, a ninth and an octave-and-a-ninth lower, so they share its chart
// moved down to where they read. The treble-clef baritone reads exactly as a
// trumpet does.
// Each woodwind's keys and chart live in a file of their own under
// ./woodwinds/, since a woodwind's chart is as much its key layout as its
// fingerings.
const WOODWINDS: Partial<Record<BandInstrument, Woodwind>> = {
	flute: FLUTE,
	oboe: OBOE,
	clarinet: CLARINET,
	bassoon: BASSOON,
	altoSax: SAXOPHONE,
	tenorSax: SAXOPHONE,
	bariSax: SAXOPHONE
};

/** The key layout and chart for a woodwind; null for any other instrument. */
export function woodwindOf(inst: BandInstrument | null): Woodwind | null {
	return (inst && WOODWINDS[inst]) ?? null;
}

const CHARTS: Partial<Record<BandInstrument, Map<number, string[]>>> = {
	trumpet: byPitch(TRUMPET),
	baritoneTC: byPitch(TRUMPET),
	baritone: byPitch(TRUMPET, -14),
	tuba: byPitch(TRUMPET, -26),
	horn: byPitch(HORN),
	trombone: byPitch(TROMBONE),
	...Object.fromEntries(Object.entries(WOODWINDS).map(([inst, ww]) => [inst, byPitch(ww.chart)]))
};

/**
 * Every standard fingering for a written pitch, the first-taught first. An
 * empty list means the instrument does not play it. For bells the "fingering"
 * is the bar, named by its pitch.
 */
export function bandFingerings(inst: BandInstrument, pitch: number): string[] {
	if (inst === 'bells') {
		const inRange = pitch >= pitchOfName(BELLS_LOW) && pitch <= pitchOfName(BELLS_HIGH);
		return inRange ? [String(pitch)] : [];
	}
	return CHARTS[inst]?.get(pitch) ?? [];
}

/** Every pitch the chart covers, low to high — for the fingering chart page. */
export function chartPitches(inst: BandInstrument): number[] {
	if (inst === 'bells') {
		const out: number[] = [];
		for (let p = pitchOfName(BELLS_LOW); p <= pitchOfName(BELLS_HIGH); p++) out.push(p);
		return out;
	}
	return [...(CHARTS[inst]?.keys() ?? [])].sort((a, b) => a - b);
}

const NATURALS: [number, string][] = [
	[0, 'C'],
	[2, 'D'],
	[4, 'E'],
	[5, 'F'],
	[7, 'G'],
	[9, 'A'],
	[11, 'B']
];

// The natural note at or below (or above) a pitch: F♯3 → F3 going down.
function naturalNear(pitch: number, direction: -1 | 1): string {
	for (let p = pitch; ; p += direction) {
		const pc = pitchClass(p);
		const natural = NATURALS.find(([n]) => n === pc);
		if (natural) return `${natural[1]}${Math.floor(p / 12)}`;
	}
}

/**
 * The furthest a teacher may stretch an instrument's range: from the lowest to
 * the highest note its chart covers, as staff positions. The notes at the very
 * ends may only be playable with a sharp or flat; those without are skipped.
 */
export function chartRange(inst: BandInstrument): Range {
	const pitches = chartPitches(inst);
	return {
		low: naturalNear(pitches[0], -1),
		high: naturalNear(pitches[pitches.length - 1], 1)
	};
}

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

/**
 * Valves held down, written the way the charts are: the trigger first, then
 * the valves in order, "0" for none. The order they were pressed in does not
 * matter, so {2, 1} and {1, 2} are both "12".
 */
export function valveAnswer(pressed: Iterable<string>): string {
	const held = new Set(pressed);
	const valves = ['1', '2', '3'].filter((v) => held.has(v)).join('');
	const trigger = held.has('T') ? 'T' : '';
	return trigger + (valves || '0');
}

/** The valves (and trigger) a fingering holds down: "T12" → T, 1, 2. */
export function valvesIn(fingering: string): Set<string> {
	return new Set(fingering.split('').filter((c) => c !== '0'));
}

export function isRightFingering(inst: BandInstrument, pitch: number, answer: string): boolean {
	return bandFingerings(inst, pitch).includes(answer);
}

/** "valves 1 and 2", "open", "trigger and valve 1", "6th position". */
export function describeBandFingering(
	inst: BandInstrument,
	fingering: string,
	spelled = false
): string {
	const controls = BAND_INSTRUMENTS[inst].controls;
	if (controls === 'slide') return `${ordinal(Number(fingering))} position`;
	if (controls === 'bars') return 'that bar';
	if (controls === 'woodwind') {
		const layout = woodwindOf(inst)!.layout;
		const held = keysIn(fingering);
		const pressed = layout.keys.filter((k) => held.has(k.id));
		if (!pressed.length) return 'no keys';
		// Spelled out when the answer is read back, where "1 2 3 1 2" would not
		// say which hand; short on the answer chips.
		return spelled ? pressed.map((k) => k.name).join(', ') : pressed.map((k) => k.label).join(' ');
	}
	const held = [...valvesIn(fingering)];
	const trigger = held.includes('T');
	const valves = held.filter((v) => v !== 'T');
	const valveText = !valves.length
		? 'open'
		: valves.length === 1
			? `valve ${valves[0]}`
			: `valves ${valves.slice(0, -1).join(', ')} and ${valves[valves.length - 1]}`;
	if (!trigger) return valveText;
	return valves.length ? `trigger and ${valveText}` : 'trigger, open';
}
