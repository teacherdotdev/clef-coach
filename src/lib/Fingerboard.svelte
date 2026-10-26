<script lang="ts">
	// A close-up of a string instrument's fingerboard, the nut at the top and
	// the four strings running down it, lowest on the left as the player sees
	// them. Each spot a finger can land on is drawn like a finger tape; tapping
	// one is the answer.
	//
	// The same drawing shows an answer read-only, small, in the report.
	import { INSTRUMENTS, stringName, type Instrument, type Spot } from './strings';

	let {
		instrument,
		spots,
		struck = null,
		want = null,
		onpick,
		small = false
	}: {
		instrument: Instrument;
		spots: Spot[];
		/** The spot the student tapped. */
		struck?: string | null;
		/** After a miss: the spot that was right. */
		want?: string | null;
		/** Leave out for a picture that cannot be tapped. */
		onpick?: (spot: string) => void;
		small?: boolean;
	} = $props();

	const interactive = $derived(!!onpick);
	const strings = $derived(INSTRUMENTS[instrument].strings);

	// Geometry: a column per string, a row per half step down from the nut.
	const COL = 64;
	const ROW = 38;
	const LEFT = 44;
	const NUT_Y = 64;
	// Two fingers can land on the same half step — the violin's high 2 and low
	// 3 — and are drawn side by side on it.
	const SPLIT = 15;

	const maxDistance = $derived(Math.max(4, ...spots.map((s) => s.distance)));
	const width = $derived(LEFT * 2 + COL * (strings.length - 1));
	const height = $derived(NUT_Y + ROW * maxDistance + 30);

	const placed = $derived.by(() =>
		spots.map((spot) => {
			const sharing = spots.filter((s) => s.string === spot.string && s.distance === spot.distance);
			const i = sharing.indexOf(spot);
			const dx = sharing.length > 1 ? (i - (sharing.length - 1) / 2) * SPLIT * 2 : 0;
			const x = LEFT + spot.string * COL + dx;
			// The open string sits above the nut, where the string is played open.
			const y = spot.distance === 0 ? NUT_Y - 26 : NUT_Y + spot.distance * ROW - ROW / 2;
			return { ...spot, x, y, label: spotLabel(spot) };
		})
	);

	function spotLabel(spot: Spot): string {
		if (spot.distance === 0) return 'O';
		return spot.finger ?? '';
	}

	function state(id: string): 'right' | 'wrong' | 'struck' | null {
		if (want !== null && id === want) return 'right';
		if (want !== null && id === struck) return 'wrong';
		if (id === struck) return 'struck';
		return null;
	}

	function name(spot: Spot): string {
		const string = `${stringName(instrument, spot.string)} string`;
		if (spot.distance === 0) return `${string}, open`;
		if (spot.finger) return `${string}, finger ${spot.finger}`;
		return `${string}, ${spot.distance} half steps up`;
	}

	function onkey(event: KeyboardEvent, id: string) {
		// Once the answer is showing, Space and Enter belong to the Next button.
		if ((event.key !== 'Enter' && event.key !== ' ') || !onpick) return;
		event.preventDefault();
		event.stopPropagation();
		onpick?.(id);
	}
</script>

<svg class="board" class:small viewBox="0 0 {width} {height}" role="group" aria-label="Fingerboard">
	<!-- The fingerboard, widening slightly towards the player. -->
	<path
		class="wood"
		d="M{LEFT - 22} {NUT_Y} L{width - LEFT + 22} {NUT_Y} L{width - LEFT + 30} {height - 4} L{LEFT -
			30} {height - 4} Z"
	/>
	<rect class="nut" x={LEFT - 24} y={NUT_Y - 6} width={width - 2 * LEFT + 48} height="8" rx="3" />

	{#each strings as s, i (s)}
		<line
			class="string"
			x1={LEFT + i * COL}
			y1={NUT_Y - 40}
			x2={LEFT + i * COL + (i - (strings.length - 1) / 2) * 6}
			y2={height}
			stroke-width={3.5 - i * 0.6}
		/>
		{#if !small}
			<text class="stringname" x={LEFT + i * COL} y={NUT_Y - 48}>{stringName(instrument, i)}</text>
		{/if}
	{/each}

	{#each placed as spot (spot.id)}
		{@const s = state(spot.id)}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<g
			class="spot"
			class:open={spot.distance === 0}
			class:right={s === 'right'}
			class:wrong={s === 'wrong'}
			class:struck={s === 'struck'}
			class:clickable={interactive}
			role={interactive ? 'button' : 'img'}
			tabindex={interactive ? 0 : undefined}
			aria-label={name(spot)}
			onclick={() => onpick?.(spot.id)}
			onkeydown={(e) => onkey(e, spot.id)}
		>
			<circle cx={spot.x} cy={spot.y} r={spot.distance === 0 ? 11 : 14} />
			{#if !small}
				<text x={spot.x} y={spot.y}>{spot.label}</text>
			{/if}
		</g>
	{/each}
</svg>

<style>
	.board {
		display: block;
		width: 100%;
		max-width: 20rem;
		max-height: 26rem;
		margin: 0 auto;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	.board.small {
		max-width: 7rem;
		max-height: 8rem;
	}
	.wood {
		fill: #3a3036;
		stroke: #3b2a10;
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.nut {
		fill: #f3ead7;
		stroke: #3b2a10;
		stroke-width: 2;
	}
	.string {
		stroke: #d9dee7;
	}
	.stringname {
		font-size: 15px;
		font-weight: 800;
		text-anchor: middle;
		fill: #1f2937;
	}
	.spot circle {
		fill: #fbf3dc;
		stroke: #3b2a10;
		stroke-width: 2;
		transition: fill 80ms;
	}
	.spot.open circle {
		fill: #fff;
	}
	.spot text {
		font-size: 11px;
		font-weight: 800;
		text-anchor: middle;
		dominant-baseline: central;
		fill: #1f2937;
		pointer-events: none;
	}
	.clickable {
		cursor: pointer;
	}
	.clickable:hover circle {
		fill: #dbeafe;
	}
	.clickable:focus {
		outline: none;
	}
	.clickable:focus-visible circle {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.struck circle {
		fill: #93c5fd;
	}
	.right circle {
		fill: #86efac;
		stroke: #15803d;
		stroke-width: 3;
	}
	.wrong circle {
		fill: #fca5a5;
		stroke: #b91c1c;
		stroke-width: 3;
	}
</style>
