// Turns the activity settings into URL text (for a shareable link) and back.

import {
	ALL_BAND_INSTRUMENTS,
	ALL_CONCERT_KEYS,
	ALL_LEVELS,
	chartRange,
	type BandInstrument,
	type ConcertKey,
	type Level,
	type Range
} from './band';
import {
	ALL_KEYS,
	STRING_KEYS,
	noteName,
	parseNoteName,
	type Clef,
	type KeyId,
	type NoteValue,
	type Position
} from './music';
import {
	ALL_INSTRUMENTS,
	BASS_POSITIONS,
	ALL_POSITION_SYSTEMS,
	DEFAULT_BASS_POSITIONS,
	FINGER_SETS,
	INSTRUMENTS,
	playableRange,
	SYSTEM_POSITIONS,
	type FingeringOptions,
	type FingerId,
	type Instrument,
	type PositionId,
	type PositionSystem
} from './strings';
import { ALL_PIANO_CLEFS, type PianoClefs } from './piano';

/**
 * What the activity is for, which decides who picks the instrument: the
 * teacher (strings), each student (band), or nobody (piano).
 */
export type ActivityType = 'strings' | 'band' | 'piano';

export const ALL_ACTIVITY_TYPES: ActivityType[] = ['strings', 'band', 'piano'];

export const ACTIVITY_TYPE_NAMES: Record<ActivityType, string> = {
	strings: 'Strings',
	band: 'Band',
	piano: 'Piano'
};

export interface Settings {
	activity: ActivityType;
	// Shown to the student and printed on their PDF, so the activity can be
	// handed out as homework. Empty for an ordinary practice link.
	title: string;
	clefs: Clef[];
	rangeLow: string; // e.g. 'A3'
	rangeHigh: string; // e.g. 'C6'
	positions: Position;
	noteValues: NoteValue[];
	helpers: boolean;
	// The instrument being practised — it fixes the clef and the fingerings.
	instrument: Instrument;
	key: KeyId; // the key signature on the staff
	// Write sharps, flats and naturals in front of some notes, on top of the
	// key signature, and ask the student to name them.
	accidentals: boolean;
	askString: boolean;
	askFinger: boolean;
	// The bass alone has a position to ask about, and a teacher who only wants
	// the finger named can switch that question off.
	askPosition: boolean;
	positionSystem: PositionSystem; // Simandl or Rabbath position names
	bassPositions: PositionId[]; // which positions bass answers may use
	fingers: FingerId[]; // which fingers the student may be asked for
	// Answer string and finger by tapping the spot on a drawn fingerboard, or
	// with the original buttons. The teacher's choice; students cannot change it.
	answerMode: AnswerMode;
	// Challenge mode
	questionLimit: number; // 0 = off, else 1..1000
	timeLimitSec: number; // 0 = off, else 1..3600 (an hour)
	// End the challenge with a breakdown of the notes that went wrong, so the
	// teacher can see what a student is struggling with and not just how much.
	detailedReport: boolean;

	// --- band and piano ---
	level: Level;
	// Ask the student to name the note before they play it. Bells never ask:
	// striking the bar already names it.
	askName: boolean;
	concertKey: ConcertKey; // band: each instrument reads it in its own key
	bandInstruments: BandInstrument[]; // the instruments the student may pick
	// A teacher's own range for an instrument, in place of the level's.
	rangeOverrides: Partial<Record<BandInstrument, Range>>;
	pianoClefs: PianoClefs;
}

export const MAX_TITLE_LENGTH = 80;

export type AnswerMode = 'draw' | 'buttons';

/** Naming the note is on by default for band and off for piano. */
export function defaultAskName(activity: ActivityType): boolean {
	return activity !== 'piano';
}

const ALL_VALUES: NoteValue[] = ['whole', 'half', 'quarter'];
const ALL_POSITIONS: PositionId[] = BASS_POSITIONS.map((p) => p.id);

const DEFAULT_INSTRUMENT: Instrument = 'violin';

/** The three inputs the fingering engine needs, pulled out of the settings. */
export function fingeringOptions(s: Settings): FingeringOptions {
	return { key: s.key, positions: s.bassPositions, fingers: s.fingers };
}

const DEFAULT_RANGE = playableRange(
	DEFAULT_INSTRUMENT,
	defaultFingerSettings(DEFAULT_INSTRUMENT, 'C')
);

// The baseline the customizer opens with.
export const DEFAULT_SETTINGS: Settings = {
	clefs: [INSTRUMENTS[DEFAULT_INSTRUMENT].clef],
	rangeLow: DEFAULT_RANGE.low,
	rangeHigh: DEFAULT_RANGE.high,
	positions: 'both',
	noteValues: ['whole'],
	helpers: false,
	instrument: DEFAULT_INSTRUMENT,
	key: 'C',
	accidentals: false,
	askString: true,
	askFinger: true,
	askPosition: true,
	positionSystem: 'simandl',
	bassPositions: DEFAULT_BASS_POSITIONS,
	fingers: [...FINGER_SETS[DEFAULT_INSTRUMENT]],
	questionLimit: 0,
	timeLimitSec: 0,
	detailedReport: false,
	activity: 'strings',
	answerMode: 'draw',
	title: '',
	level: 'beginner',
	askName: true,
	concertKey: 'Bb',
	bandInstruments: [...ALL_BAND_INSTRUMENTS],
	rangeOverrides: {},
	pianoClefs: 'treble'
};

/**
 * Switching activity type keeps everything that still applies — the note
 * values, the challenge limits, the title, and each type's own settings, so
 * switching back finds them as they were. Only the note-name question resets,
 * since band asks it by default and piano does not.
 */
export function applyActivityType(s: Settings, activity: ActivityType): Settings {
	if (activity === s.activity) return s;
	return { ...s, activity, askName: defaultAskName(activity) };
}

function defaultFingerSettings(inst: Instrument, key: KeyId): FingeringOptions {
	return { key, positions: DEFAULT_BASS_POSITIONS, fingers: [...FINGER_SETS[inst]] };
}

/**
 * Switching instrument fixes the clef, offers that instrument's own fingers,
 * and clamps the range to what it can actually reach with them, so the activity
 * never shows a note the student has no way to finger.
 */
export function applyInstrument(s: Settings, choice: Instrument): Settings {
	const next = { ...s, instrument: choice, fingers: [...FINGER_SETS[choice]] };
	const limits = playableRange(choice, fingeringOptions(next));
	return {
		...next,
		clefs: [INSTRUMENTS[choice].clef],
		rangeLow: limits.low,
		rangeHigh: limits.high
	};
}

/**
 * Switching position system keeps whichever positions the new system also has.
 * Only Simandl's 2nd position is lost on the way to Rabbath; the other three
 * shapes are shared, so a teacher's choice normally survives the switch intact.
 */
export function applyPositionSystem(s: Settings, system: PositionSystem): Settings {
	const offered = SYSTEM_POSITIONS[system];
	const kept = s.bassPositions.filter((p) => offered.includes(p));
	return clampRange({
		...s,
		positionSystem: system,
		bassPositions: kept.length ? kept : DEFAULT_BASS_POSITIONS
	});
}

/**
 * Pull the range back inside what is playable, keeping as much of the teacher's
 * choice as still fits. Dropping third position, turning off high 3, or reading
 * in D major each take notes out of reach at one end or the other.
 */
export function clampRange(s: Settings): Settings {
	const limits = playableRange(s.instrument, fingeringOptions(s));
	const low = Math.max(parseNoteName(s.rangeLow), parseNoteName(limits.low));
	const high = Math.min(parseNoteName(s.rangeHigh), parseNoteName(limits.high));
	if (low > high) return { ...s, rangeLow: limits.low, rangeHigh: limits.high };
	return { ...s, rangeLow: noteName(low), rangeHigh: noteName(high) };
}

/** Whether string and finger are answered on the drawn fingerboard. */
export function usesFingerboard(s: Settings): boolean {
	return s.activity === 'strings' && s.answerMode === 'draw' && s.askFinger;
}

/** Does this configuration ask anything beyond the note name? */
export function asksFingering(s: Settings): boolean {
	return s.askString || s.askFinger;
}

/**
 * Whether bass positions are part of this activity at all. They are what puts a
 * finger on a pitch, so they shape the fingerings — and the range — whether or
 * not the student is asked to name them.
 */
export function usesPositions(s: Settings): boolean {
	return s.instrument === 'bass' && s.askFinger;
}

/** The bass is the only instrument whose position can be asked about. */
export function asksPosition(s: Settings): boolean {
	return usesPositions(s) && s.askPosition;
}

// Challenge mode is "on" when either limit is active.
export function isChallengeMode(s: Settings): boolean {
	return s.questionLimit > 0 || s.timeLimitSec > 0;
}

export const MAX_QUESTIONS = 1000;
export const MAX_SECONDS = 3600; // one hour

// "3 min 30 sec", "45 sec", "5 min".
export function formatDuration(totalSec: number): string {
	const min = Math.floor(totalSec / 60);
	const sec = totalSec % 60;
	if (!min) return `${sec} sec`;
	if (!sec) return `${min} min`;
	return `${min} min ${sec} sec`;
}

export function settingsToQuery(s: Settings): string {
	const p = new URLSearchParams();
	p.set('clefs', s.clefs.join(','));
	p.set('low', s.rangeLow);
	p.set('high', s.rangeHigh);
	p.set('pos', s.positions);
	p.set('values', s.noteValues.join(','));
	p.set('help', s.helpers ? '1' : '0');
	p.set('inst', s.instrument);
	p.set('key', s.key);
	p.set('acc', s.accidentals ? '1' : '0');
	p.set('askstr', s.askString ? '1' : '0');
	p.set('askfin', s.askFinger ? '1' : '0');
	p.set('askpos', s.askPosition ? '1' : '0');
	p.set('sys', s.positionSystem);
	p.set('bpos', s.bassPositions.join(','));
	p.set('fing', s.fingers.join(','));
	p.set('qlim', String(s.questionLimit));
	p.set('tsec', String(s.timeLimitSec));
	p.set('rep', s.detailedReport ? '1' : '0');
	// String links are written exactly as they always were, so a student's
	// high score for one is still found under the same link. Only the drawing
	// is new, and a link without it means buttons.
	if (s.activity === 'strings' && s.answerMode === 'draw') p.set('mode', 'draw');
	if (s.activity !== 'strings') {
		p.set('act', s.activity);
		p.set('lvl', s.level);
		p.set('askname', s.askName ? '1' : '0');
	}
	if (s.activity === 'band') {
		p.set('ckey', s.concertKey);
		p.set('binst', s.bandInstruments.join(','));
		const overrides = ALL_BAND_INSTRUMENTS.filter((i) => s.rangeOverrides[i]).map(
			(i) => `${i}.${s.rangeOverrides[i]!.low}-${s.rangeOverrides[i]!.high}`
		);
		if (overrides.length) p.set('ovr', overrides.join(','));
	}
	if (s.activity === 'piano') p.set('pclef', s.pianoClefs);
	if (s.title.trim()) p.set('title', s.title.trim());
	return p.toString();
}

export function settingsFromParams(params: URLSearchParams): Settings {
	const d = DEFAULT_SETTINGS;

	const values = csv(params.get('values')).filter((v): v is NoteValue =>
		ALL_VALUES.includes(v as NoteValue)
	);
	const pos = params.get('pos');

	const rawInst = params.get('inst');
	const instrument: Instrument = ALL_INSTRUMENTS.includes(rawInst as Instrument)
		? (rawInst as Instrument)
		: d.instrument;

	const rawSystem = params.get('sys');
	const positionSystem: PositionSystem = ALL_POSITION_SYSTEMS.includes(rawSystem as PositionSystem)
		? (rawSystem as PositionSystem)
		: d.positionSystem;

	// Links written before the systems existed carry Simandl positions, which is
	// also what an unnamed system falls back to.
	const bassPositions = csv(params.get('bpos')).filter(
		(p): p is PositionId =>
			ALL_POSITIONS.includes(p as PositionId) &&
			SYSTEM_POSITIONS[positionSystem].includes(p as PositionId)
	);

	const rawActivity = params.get('act');
	const activity: ActivityType = ALL_ACTIVITY_TYPES.includes(rawActivity as ActivityType)
		? (rawActivity as ActivityType)
		: d.activity;

	// A piano reads in any key; the string activities offer their own seven.
	const rawKey = params.get('key');
	const keys = activity === 'piano' ? ALL_KEYS : STRING_KEYS;
	const key: KeyId = keys.includes(rawKey as KeyId) ? (rawKey as KeyId) : d.key;

	const bandInstruments = csv(params.get('binst')).filter((i): i is BandInstrument =>
		ALL_BAND_INSTRUMENTS.includes(i as BandInstrument)
	);

	// Only fingers this instrument has; links written before an instrument's
	// fingers were nameable simply get the whole set.
	const fingers = csv(params.get('fing')).filter((f) => FINGER_SETS[instrument].includes(f));

	const fallback = playableRange(instrument, {
		key,
		positions: bassPositions.length ? bassPositions : d.bassPositions,
		fingers: fingers.length ? fingers : [...FINGER_SETS[instrument]]
	});

	return {
		clefs: [INSTRUMENTS[instrument].clef],
		rangeLow: params.get('low') ?? fallback.low,
		rangeHigh: params.get('high') ?? fallback.high,
		positions: pos === 'lines' || pos === 'spaces' ? pos : 'both',
		noteValues: values.length ? values : d.noteValues,
		helpers: bool(params.get('help'), d.helpers),
		instrument,
		key,
		accidentals: bool(params.get('acc'), d.accidentals),
		askString: bool(params.get('askstr'), d.askString),
		askFinger: bool(params.get('askfin'), d.askFinger),
		// Links shared before the position question could be switched off ask it.
		askPosition: bool(params.get('askpos'), d.askPosition),
		positionSystem,
		bassPositions: bassPositions.length ? bassPositions : d.bassPositions,
		fingers: fingers.length ? fingers : [...FINGER_SETS[instrument]],
		questionLimit: clampLimit(params.get('qlim')),
		timeLimitSec: readTimeLimit(params),
		detailedReport: bool(params.get('rep'), d.detailedReport),
		activity,
		// String links made before the fingerboard drawing existed stay on
		// buttons. Band and piano links never carry it, and keep the default.
		answerMode: params.get('mode') === 'draw' || activity !== 'strings' ? d.answerMode : 'buttons',
		title: (params.get('title') ?? '').trim().slice(0, MAX_TITLE_LENGTH),
		level: oneOf(params.get('lvl'), ALL_LEVELS, d.level),
		askName: bool(params.get('askname'), defaultAskName(activity)),
		concertKey: oneOf(params.get('ckey'), ALL_CONCERT_KEYS, d.concertKey),
		// Keep the list in the picker's order, whatever order the link has it in.
		bandInstruments: bandInstruments.length
			? ALL_BAND_INSTRUMENTS.filter((i) => bandInstruments.includes(i))
			: d.bandInstruments,
		rangeOverrides: readOverrides(params.get('ovr')),
		pianoClefs: oneOf(params.get('pclef'), ALL_PIANO_CLEFS, d.pianoClefs)
	};
}

// "trumpet.C4-C6,horn.F4-F5" → a range per instrument, kept inside what the
// instrument plays. Anything unreadable, or entirely out of reach, is dropped,
// leaving that instrument on its level's range.
function readOverrides(v: string | null): Partial<Record<BandInstrument, Range>> {
	const out: Partial<Record<BandInstrument, Range>> = {};
	for (const part of csv(v)) {
		const m = part.match(/^(\w+)\.([A-G]\d)-([A-G]\d)$/);
		if (!m || !ALL_BAND_INSTRUMENTS.includes(m[1] as BandInstrument)) continue;
		const inst = m[1] as BandInstrument;
		const reach = chartRange(inst);
		const [a, b] = [parseNoteName(m[2]), parseNoteName(m[3])].sort((x, y) => x - y);
		const low = Math.max(a, parseNoteName(reach.low));
		const high = Math.min(b, parseNoteName(reach.high));
		if (low < high) out[inst] = { low: noteName(low), high: noteName(high) };
	}
	return out;
}

function oneOf<T extends string>(v: string | null, allowed: T[], fallback: T): T {
	return allowed.includes(v as T) ? (v as T) : fallback;
}

/**
 * Read settings out of parsed JSON, for a file someone has imported. Every
 * field is funnelled through the same checks a shareable link goes through, so
 * a file that is out of date, hand-edited or simply not ours cannot produce a
 * broken activity — anything unrecognised falls back to the default.
 */
export function settingsFromJson(raw: unknown): Settings {
	// A file may hold the settings on their own or wrapped alongside a name.
	const outer = (raw ?? {}) as Record<string, unknown>;
	const o = (
		outer.settings && typeof outer.settings === 'object' ? outer.settings : outer
	) as Record<string, unknown>;

	const p = new URLSearchParams();
	const put = (key: string, value: unknown) => {
		if (value === undefined || value === null) return;
		p.set(key, Array.isArray(value) ? value.join(',') : String(value));
	};
	const putBool = (key: string, value: unknown) => {
		if (typeof value === 'boolean') p.set(key, value ? '1' : '0');
	};

	put('clefs', o.clefs);
	put('low', o.rangeLow);
	put('high', o.rangeHigh);
	put('pos', o.positions);
	put('values', o.noteValues);
	putBool('help', o.helpers);
	put('inst', o.instrument);
	put('key', o.key);
	putBool('acc', o.accidentals);
	putBool('askstr', o.askString);
	putBool('askfin', o.askFinger);
	putBool('askpos', o.askPosition);
	put('sys', o.positionSystem);
	put('bpos', o.bassPositions);
	put('fing', o.fingers);
	put('qlim', o.questionLimit);
	put('tsec', o.timeLimitSec);
	putBool('rep', o.detailedReport);
	put('act', o.activity);
	put('mode', o.answerMode);
	put('title', o.title);
	put('lvl', o.level);
	putBool('askname', o.askName);
	put('ckey', o.concertKey);
	put('binst', o.bandInstruments);
	put('pclef', o.pianoClefs);
	if (o.rangeOverrides && typeof o.rangeOverrides === 'object') {
		const entries = Object.entries(o.rangeOverrides as Record<string, Partial<Range>>);
		put(
			'ovr',
			entries.filter(([, r]) => r && r.low && r.high).map(([i, r]) => `${i}.${r.low}-${r.high}`)
		);
	}

	// A range from an older file may name notes this instrument cannot reach.
	return clampRange(settingsFromParams(p));
}

/** The name an imported file carried, if it had one. */
export function nameFromJson(raw: unknown): string {
	const outer = (raw ?? {}) as Record<string, unknown>;
	return typeof outer.name === 'string' ? outer.name.trim() : '';
}

function csv(v: string | null): string[] {
	return (v ?? '').split(',').filter(Boolean);
}
function bool(v: string | null, fallback: boolean): boolean {
	if (v === '1') return true;
	if (v === '0') return false;
	return fallback;
}
function clampLimit(v: string | null): number {
	return clampCount(Number(v), MAX_QUESTIONS);
}
function clampCount(n: number, max: number): number {
	if (!Number.isFinite(n) || n <= 0) return 0;
	return Math.min(max, Math.max(1, Math.round(n)));
}
// Links shared before the time limit gained seconds carry `tlim` in minutes.
function readTimeLimit(params: URLSearchParams): number {
	if (params.has('tsec')) return clampCount(Number(params.get('tsec')), MAX_SECONDS);
	return clampCount(Number(params.get('tlim')) * 60, MAX_SECONDS);
}
