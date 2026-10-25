<script lang="ts">
	// A piano keyboard, or a row of bells laid out the same way: the naturals in
	// a row in front and the sharps and flats in a row behind them. Clicking a
	// key or bar is the whole answer.
	//
	// The same drawing shows a key read-only, small, in the report.

	let {
		low,
		high,
		bars = false,
		struck = null,
		want = null,
		onstrike,
		small = false
	}: {
		/** Lowest and highest keys to draw, as pitches. `low` should be a C. */
		low: number;
		high: number;
		/** Draw silver bars, as on bells, rather than piano keys. */
		bars?: boolean;
		/** The key the student pressed, shown after they press it. */
		struck?: number | null;
		/** After a miss: the key that was right. */
		want?: number | null;
		/** Leave out for a picture that cannot be clicked. */
		onstrike?: (pitch: number) => void;
		/** Drawn small, as in the report. */
		small?: boolean;
	} = $props();

	const interactive = $derived(!!onstrike);

	// Which keys of an octave are black, and which white key each black one sits
	// to the right of.
	const BLACK = new Set([1, 3, 6, 8, 10]);
	const isBlack = (p: number) => BLACK.has(((p % 12) + 12) % 12);

	const WHITE_W = 24;
	const WHITE_H = $derived(bars ? 70 : 110);
	const BLACK_W = $derived(bars ? 18 : 15);
	const BLACK_H = $derived(bars ? 52 : 68);
	// Bells keep the two rows apart, as the bars are on the instrument.
	const WHITE_Y = $derived(bars ? 58 : 0);

	const keys = $derived.by(() => {
		const whites: { pitch: number; x: number }[] = [];
		const blacks: { pitch: number; x: number }[] = [];
		let n = 0;
		for (let p = low; p <= high; p++) {
			if (isBlack(p)) blacks.push({ pitch: p, x: n * WHITE_W - BLACK_W / 2 });
			else whites.push({ pitch: p, x: n++ * WHITE_W });
		}
		return { whites, blacks, width: n * WHITE_W };
	});

	const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
	function name(p: number): string {
		return `${NAMES[((p % 12) + 12) % 12]}${Math.floor(p / 12)}`;
	}

	function state(p: number): 'right' | 'wrong' | 'struck' | null {
		if (want !== null && p === want) return 'right';
		if (want !== null && p === struck) return 'wrong';
		if (p === struck) return 'struck';
		return null;
	}

	function onkey(event: KeyboardEvent, p: number) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		event.stopPropagation();
		onstrike?.(p);
	}

	// Bars shorten as they rise in pitch, as on the instrument.
	function barShrink(p: number): number {
		if (!bars) return 0;
		return Math.round(((p - low) / Math.max(1, high - low)) * 16);
	}
</script>

<svg
	class="keys"
	class:small
	viewBox="-2 -2 {keys.width + 4} {WHITE_Y + WHITE_H + 4}"
	role="group"
	aria-label={bars ? 'Bells' : 'Piano keyboard'}
>
	{#each keys.whites as k (k.pitch)}
		{@const s = state(k.pitch)}
		{@const shrink = barShrink(k.pitch)}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<rect
			class="white"
			class:bar={bars}
			class:right={s === 'right'}
			class:wrong={s === 'wrong'}
			class:struck={s === 'struck'}
			class:clickable={interactive}
			x={k.x + (bars ? 2 : 0)}
			y={WHITE_Y + shrink / 2}
			width={WHITE_W - (bars ? 4 : 0)}
			height={WHITE_H - shrink}
			rx={bars ? 4 : 3}
			role={interactive ? 'button' : 'img'}
			tabindex={interactive ? 0 : undefined}
			aria-label={name(k.pitch)}
			onclick={() => onstrike?.(k.pitch)}
			onkeydown={(e) => onkey(e, k.pitch)}
		/>
	{/each}
	{#each keys.blacks as k (k.pitch)}
		{@const s = state(k.pitch)}
		{@const shrink = barShrink(k.pitch)}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<rect
			class="black"
			class:bar={bars}
			class:right={s === 'right'}
			class:wrong={s === 'wrong'}
			class:struck={s === 'struck'}
			class:clickable={interactive}
			x={k.x}
			y={shrink / 2}
			width={BLACK_W}
			height={BLACK_H - shrink}
			rx={bars ? 4 : 2}
			role={interactive ? 'button' : 'img'}
			tabindex={interactive ? 0 : undefined}
			aria-label={name(k.pitch)}
			onclick={() => onstrike?.(k.pitch)}
			onkeydown={(e) => onkey(e, k.pitch)}
		/>
	{/each}
</svg>

<style>
	.keys {
		display: block;
		width: 100%;
		max-width: 34rem;
		margin: 0 auto;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	.keys.small {
		max-width: 10rem;
	}
	rect {
		stroke: #3b2a10;
		stroke-width: 2;
	}
	.white {
		fill: #fff;
	}
	.black {
		fill: #262833;
	}
	.white.bar,
	.black.bar {
		fill: #d9dee7;
	}
	.black.bar {
		fill: #c3cad6;
	}
	.clickable {
		cursor: pointer;
	}
	.clickable:hover {
		fill: #dbeafe;
	}
	.black.clickable:hover:not(.bar) {
		fill: #3b4a6b;
	}
	.clickable:focus {
		outline: none;
	}
	.clickable:focus-visible {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.struck {
		fill: #93c5fd !important;
	}
	.right {
		fill: #86efac !important;
		stroke: #15803d;
		stroke-width: 3;
	}
	.wrong {
		fill: #fca5a5 !important;
		stroke: #b91c1c;
		stroke-width: 3;
	}
</style>
