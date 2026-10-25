/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { parseNoteName } from './music';
import {
	defaultFingeringOptions,
	fingeringsFor,
	preferredFingering,
	spotOf,
	spotsFor
} from './strings';

describe('fingerboard spots', () => {
	test('violin spots are fingers, low and high 2 apart', () => {
		const spots = spotsFor('violin', defaultFingeringOptions('violin'));
		const a = spots.filter((s) => s.string === 2);
		expect(a.map((s) => s.id)).toContain('2:L2');
		expect(a.map((s) => s.id)).toContain('2:H2');
		expect(a.find((s) => s.id === '2:L2')!.distance).toBe(3);
		expect(a.find((s) => s.id === '2:H2')!.distance).toBe(4);
	});

	test('a finger switched off is not drawn', () => {
		const opts = { ...defaultFingeringOptions('violin'), fingers: ['open', '1', 'H2', '3', '4'] };
		expect(spotsFor('violin', opts).some((s) => s.finger === 'L2')).toBe(false);
	});

	test('every fingering lands on a drawn spot', () => {
		for (const inst of ['violin', 'viola', 'cello', 'bass'] as const) {
			const opts = defaultFingeringOptions(inst);
			const ids = new Set(spotsFor(inst, opts).map((s) => s.id));
			for (let i = parseNoteName('C2'); i <= parseNoteName('E6'); i++)
				for (const f of fingeringsFor(inst, i, opts)) expect(ids).toContain(spotOf(inst, f));
		}
	});

	test('bass spots are places on the string, not fingers', () => {
		// The same place on the string is a different finger in each position,
		// so a bass spot names the place and leaves the finger to the position.
		const opts = defaultFingeringOptions('bass');
		const f = preferredFingering(fingeringsFor('bass', parseNoteName('C3'), opts))!;
		expect(spotOf('bass', f)).toMatch(/^\d:\d$/);
		expect(spotsFor('bass', opts).every((s) => s.finger === null)).toBe(true);
	});
});
