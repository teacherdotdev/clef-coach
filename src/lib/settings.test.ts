/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
	DEFAULT_SETTINGS,
	applyActivityType,
	settingsFromJson,
	settingsFromParams,
	settingsToQuery,
	type Settings
} from './settings';
import { KEY_FLATS, KEY_SHARPS, accidentalSteps, ALL_KEYS, type Clef } from './music';

const roundTrip = (s: Settings) => settingsFromParams(new URLSearchParams(settingsToQuery(s)));

describe('links', () => {
	// A link a string teacher shared before band activities existed.
	const OLD_LINK =
		'clefs=bass&low=C2&high=D4&pos=both&values=whole&help=0&inst=cello&key=D&acc=0&askstr=1&askfin=1&askpos=1&sys=simandl&bpos=half%2CI%2CIII&fing=open%2Cx1%2C1%2C2%2Cx2%2C3%2C4%2Cx4&qlim=10&tsec=0&rep=0';

	test('an old string link reads back unchanged and is written the same way', () => {
		const s = settingsFromParams(new URLSearchParams(OLD_LINK));
		expect(s.activity).toBe('strings');
		expect(s.instrument).toBe('cello');
		expect(s.key).toBe('D');
		expect(settingsToQuery(s)).toBe(OLD_LINK);
	});

	test('a band activity round-trips', () => {
		const band: Settings = {
			...applyActivityType(DEFAULT_SETTINGS, 'band'),
			concertKey: 'Eb',
			level: 'intermediate',
			bandInstruments: ['trumpet', 'tuba'],
			rangeOverrides: { trumpet: { low: 'C4', high: 'C6' } },
			title: 'Week 3 homework',
			askName: false
		};
		expect(roundTrip(band)).toEqual(band);
	});

	test('a piano activity round-trips with any written key', () => {
		const piano: Settings = {
			...applyActivityType(DEFAULT_SETTINGS, 'piano'),
			key: 'Ab',
			pianoClefs: 'both',
			level: 'advanced'
		};
		expect(piano.askName).toBe(false);
		expect(roundTrip(piano)).toEqual(piano);
	});

	test('string activities stay on the string keys', () => {
		const s = settingsFromParams(new URLSearchParams('key=Db'));
		expect(s.key).toBe(DEFAULT_SETTINGS.key);
	});

	test('junk falls back to defaults', () => {
		const s = settingsFromParams(
			new URLSearchParams(
				'act=band&ckey=H&lvl=expert&binst=kazoo,trumpet&ovr=kazoo.C4-C5,trumpet.nope,tuba.F2-B1'
			)
		);
		expect(s.concertKey).toBe('Bb');
		expect(s.level).toBe('beginner');
		expect(s.bandInstruments).toEqual(['trumpet']);
		// A range written high-to-low is put the right way round.
		expect(s.rangeOverrides).toEqual({ tuba: { low: 'B1', high: 'F2' } });
	});

	test('a band activity survives export and import as a file', () => {
		const band: Settings = {
			...applyActivityType(DEFAULT_SETTINGS, 'band'),
			concertKey: 'F',
			bandInstruments: ['horn'],
			rangeOverrides: { horn: { low: 'C4', high: 'C5' } },
			title: 'Horn sectional'
		};
		const imported = settingsFromJson(JSON.parse(JSON.stringify({ name: 'x', settings: band })));
		expect(imported.activity).toBe('band');
		expect(imported.concertKey).toBe('F');
		expect(imported.bandInstruments).toEqual(['horn']);
		expect(imported.rangeOverrides).toEqual({ horn: { low: 'C4', high: 'C5' } });
		expect(imported.title).toBe('Horn sectional');
	});
});

describe('key signatures', () => {
	test('the new keys alter the right letters', () => {
		expect(KEY_SHARPS.E).toEqual(['F', 'C', 'G', 'D']);
		expect(KEY_FLATS.Ab).toEqual(['B', 'E', 'A', 'D']);
		expect(KEY_FLATS.Db).toEqual(['B', 'E', 'A', 'D', 'G']);
		expect(KEY_SHARPS.D).toEqual(['F', 'C']);
	});

	test('every accidental of every key has a place on every staff', () => {
		const clefs: Clef[] = ['treble', 'bass', 'alto', 'tenor'];
		for (const key of ALL_KEYS)
			for (const clef of clefs) {
				const count = KEY_SHARPS[key].length + KEY_FLATS[key].length;
				expect(accidentalSteps(key, clef).length).toBeGreaterThanOrEqual(count);
			}
	});
});

describe('range overrides', () => {
	test('a range the instrument cannot reach is kept inside its chart, or dropped', () => {
		const s = settingsFromParams(
			new URLSearchParams('act=band&ovr=trumpet.C1-C2,tuba.A1-C6,horn.C4-C5')
		);
		expect(s.rangeOverrides.trumpet).toBeUndefined();
		expect(s.rangeOverrides.tuba).toEqual({ low: 'A1', high: 'B3' });
		expect(s.rangeOverrides.horn).toEqual({ low: 'C4', high: 'C5' });
	});
});

describe('answer mode', () => {
	test('new string activities use the drawing; links without it stay on buttons', () => {
		expect(DEFAULT_SETTINGS.answerMode).toBe('draw');
		expect(roundTrip(DEFAULT_SETTINGS).answerMode).toBe('draw');
		expect(settingsFromParams(new URLSearchParams('inst=viola')).answerMode).toBe('buttons');
	});
});
