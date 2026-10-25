// The pictures of each instrument, for the band picker and beside the
// controls a student plays on. Drawn in the logo's cartoon style.

import type { BandInstrument } from './band';

const files = import.meta.glob('./assets/instruments/*.svg', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

function art(name: string): string {
	return files[`./assets/instruments/${name}.svg`] ?? '';
}

// Both baritones are the same instrument; only the part they read differs.
const PICTURE: Record<BandInstrument | 'piano', string> = {
	trumpet: 'trumpet',
	horn: 'horn',
	trombone: 'trombone',
	baritone: 'baritone',
	baritoneTC: 'baritone',
	tuba: 'tuba',
	bells: 'bells',
	piano: 'piano'
};

export function instrumentArt(inst: BandInstrument | 'piano'): string {
	return art(PICTURE[inst]);
}
