// How a woodwind is described: the keys and tone holes a student can press,
// laid out where they sit on the instrument, and the chart of which ones play
// each written note. One file per instrument under ./woodwinds/ fills these in;
// the key diagram draws whatever layout it is given.

/** One thing a finger can press: an open tone hole or a metal key. */
export interface WoodwindKey {
	/** Short id used in the chart: 'L1', 'T', 'Eb', 'oct'. */
	id: string;
	/** Read back to a student: 'left first finger', 'octave key'. */
	name: string;
	/** Printed on or beside it, three characters at most: '1', 'T', 'E♭'. */
	label: string;
	/** A round tone hole the finger covers, or a key it presses. */
	shape: 'hole' | 'key';
	/** Centre, in the layout's units. */
	x: number;
	y: number;
	/** Size. For a hole, w = h = its diameter. */
	w: number;
	h: number;
	/** Turn a key this many degrees about its centre, for levers set at an angle. */
	angle?: number;
}

/** The instrument's body, drawn behind the keys: one rounded rectangle per part. */
export interface BodyPart {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
}

export interface WoodwindLayout {
	/** The viewBox: 0 0 width height. */
	width: number;
	height: number;
	body: BodyPart[];
	/**
	 * Every key and hole, in reading order. Fingerings are written in this
	 * order, so the same set of keys always reads the same way.
	 */
	keys: WoodwindKey[];
}

/**
 * Written note name (sharps only: 'C#4', 'F#5') → every standard fingering,
 * the first-taught first. A fingering is the ids of the keys held down,
 * separated by spaces, in layout order: 'T L1 L2 L3 Eb'. "0" means nothing
 * held down.
 */
export type WoodwindChart = Record<string, string[]>;

export interface Woodwind {
	layout: WoodwindLayout;
	chart: WoodwindChart;
}

/** Keys held down, written the way the charts write them. */
export function woodwindAnswer(layout: WoodwindLayout, pressed: Iterable<string>): string {
	const held = new Set(pressed);
	const ids = layout.keys.filter((k) => held.has(k.id)).map((k) => k.id);
	return ids.length ? ids.join(' ') : '0';
}

/** The keys a written fingering holds down. */
export function keysIn(fingering: string): Set<string> {
	return new Set(fingering === '0' ? [] : fingering.split(' '));
}
