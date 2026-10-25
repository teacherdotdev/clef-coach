<script lang="ts">
	import { ordinal } from './music';
	// The trombone's slide, drawn as the player sees it stretched out in front
	// of them: the slide tubes run left from the bell section, and the U-shaped
	// crook at the end moves out through the seven positions. Clicking a
	// position — or dragging the crook to it — sets the slide there; the parent
	// decides when it is played.
	//
	// The same drawing shows a position read-only, small, in the report.

	let {
		position,
		want = null,
		onset,
		small = false
	}: {
		/** The position the slide is at, 1–7, or null when not yet moved. */
		position: number | null;
		/** After a miss: where the slide should have been. */
		want?: number | null;
		/** Leave out for a picture that cannot be moved. */
		onset?: (position: number) => void;
		/** Drawn small, as in the report. */
		small?: boolean;
	} = $props();

	const interactive = $derived(!!onset);

	// Where the crook's far end sits in each position. Each is about a hand's
	// width further out than the last; first position is the slide all the way
	// in, its outer tubes covering the inner ones up to the bell section.
	const WIDTH = 460;
	const BELL_X = 420;
	const SLIDE_LENGTH = 170;
	const FIRST_X = BELL_X - SLIDE_LENGTH;
	const STEP = 34;
	const xFor = (p: number) => FIRST_X - (p - 1) * STEP;
	const POSITIONS = [1, 2, 3, 4, 5, 6, 7];

	const crookX = $derived(xFor(position ?? 1));
	// The outer slide's tubes start where the crook's bend ends.
	const tubeX = $derived(crookX + 22);

	let svg = $state<SVGSVGElement>();
	let dragging = false;

	// Where on the drawing the pointer is, in viewBox units, snapped to the
	// nearest position.
	function positionAt(event: PointerEvent): number {
		const box = svg!.getBoundingClientRect();
		const x = ((event.clientX - box.left) / box.width) * WIDTH;
		const p = Math.round((FIRST_X - x) / STEP) + 1;
		return Math.min(7, Math.max(1, p));
	}

	function down(event: PointerEvent) {
		if (!onset) return;
		dragging = true;
		(event.currentTarget as Element).setPointerCapture(event.pointerId);
		onset(positionAt(event));
	}
	function move(event: PointerEvent) {
		if (dragging && onset) onset(positionAt(event));
	}
	function up() {
		dragging = false;
	}

	function onkey(event: KeyboardEvent) {
		if (!onset) return;
		const now = position ?? 1;
		if (event.key === 'ArrowLeft') onset(Math.min(7, now + 1));
		else if (event.key === 'ArrowRight') onset(Math.max(1, now - 1));
		else return;
		event.preventDefault();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<svg
	bind:this={svg}
	class="slide"
	class:small
	class:clickable={interactive}
	viewBox="0 0 {WIDTH} 130"
	role={interactive ? 'slider' : 'img'}
	tabindex={interactive ? 0 : undefined}
	aria-label={interactive
		? 'Trombone slide'
		: position
			? `Slide in ${ordinal(position)} position`
			: 'Slide'}
	aria-valuemin={interactive ? 1 : undefined}
	aria-valuemax={interactive ? 7 : undefined}
	aria-valuenow={interactive ? (position ?? 1) : undefined}
	onpointerdown={down}
	onpointermove={move}
	onpointerup={up}
	onpointercancel={up}
	onkeydown={onkey}
>
	<!-- Position marks: where the crook stops for each one. -->
	{#each POSITIONS as p (p)}
		<g
			class="mark"
			class:at={position === p}
			class:right={want === p}
			class:wrong={want !== null && position === p && want !== p}
		>
			<line x1={xFor(p)} y1="84" x2={xFor(p)} y2="96" />
			<circle cx={xFor(p)} cy="110" r="12" />
			<text x={xFor(p)} y="110">{p}</text>
		</g>
	{/each}

	<!-- The inner slide tubes, fixed to the bell section, showing where the
	     outer slide has moved out past them. -->
	<rect class="inner" x={tubeX} y="30" width={BELL_X - tubeX} height="4" />
	<rect class="inner" x={tubeX} y="64" width={BELL_X - tubeX} height="4" />

	<!-- The bell section's end of the slide, which stays put. -->
	<rect class="brass" x={BELL_X} y="18" width="34" height="62" rx="8" />
	<rect class="shade" x={BELL_X} y="56" width="34" height="24" rx="8" />

	<!-- The outer slide: the crook and the two tubes leading back from it,
	     moving together. -->
	<g class="outer">
		<rect class="brass" x={tubeX} y="28" width={SLIDE_LENGTH - 22} height="8" />
		<rect class="brass" x={tubeX} y="62" width={SLIDE_LENGTH - 22} height="8" />
		<rect class="brass" x={crookX + SLIDE_LENGTH - 8} y="26" width="12" height="12" rx="3" />
		<rect class="brass" x={crookX + SLIDE_LENGTH - 8} y="60" width="12" height="12" rx="3" />
		<path
			class="brass"
			d="M{tubeX} 28 C {crookX - 8} 28, {crookX - 8} 70, {tubeX} 70 L{tubeX} 62 C {crookX +
				8} 62, {crookX + 8} 36, {tubeX} 36 Z"
		/>
		<rect class="grip" x={crookX + 70} y="36" width="10" height="26" rx="3" />
	</g>
</svg>

<style>
	.slide {
		display: block;
		width: 100%;
		max-width: 26rem;
		margin: 0 auto;
		user-select: none;
		touch-action: none;
		-webkit-tap-highlight-color: transparent;
	}
	.slide.small {
		max-width: 9rem;
	}
	.clickable {
		cursor: grab;
	}
	.clickable:focus {
		outline: none;
	}
	.clickable:focus-visible {
		outline: 3px solid var(--blue);
		outline-offset: 2px;
		border-radius: 8px;
	}
	.brass {
		fill: #f2b632;
		stroke: #3b2a10;
		stroke-width: 2.6;
		stroke-linejoin: round;
	}
	.shade {
		fill: #3b2a10;
		opacity: 0.18;
	}
	.inner {
		fill: #c9ced8;
	}
	.grip {
		fill: #fbf3dc;
		stroke: #3b2a10;
		stroke-width: 2;
	}
	.mark line {
		stroke: #9ca3af;
		stroke-width: 2;
	}
	.mark circle {
		fill: #fff;
		stroke: #9ca3af;
		stroke-width: 2;
	}
	.mark text {
		font-size: 14px;
		font-weight: 800;
		text-anchor: middle;
		dominant-baseline: central;
		fill: #374151;
	}
	.small .mark text {
		font-size: 16px;
	}
	.mark.at circle {
		fill: #93c5fd;
		stroke: var(--blue);
	}
	.mark.right circle {
		fill: #86efac;
		stroke: #15803d;
		stroke-width: 3;
	}
	.mark.wrong circle {
		fill: #fca5a5;
		stroke: #b91c1c;
		stroke-width: 3;
	}
</style>
