<script lang="ts">
	// A woodwind's keys and tone holes, laid out where they sit on the
	// instrument but enlarged to click. Clicking one presses or releases it; the
	// parent decides when the answer is played. The layout comes from the
	// instrument's own data file, so every woodwind is drawn by this one piece.
	//
	// The same drawing shows a fingering read-only, small, in the report.
	import type { WoodwindLayout } from './woodwinds';

	let {
		layout,
		held,
		want = null,
		ontoggle,
		small = false,
		label = 'Keys'
	}: {
		layout: WoodwindLayout;
		/** Keys drawn pressed down. */
		held: Set<string>;
		/** After a miss: the keys that should have been down. */
		want?: Set<string> | null;
		/** Leave out for a picture that cannot be clicked. */
		ontoggle?: (key: string) => void;
		/** Drawn small, as in the report. */
		small?: boolean;
		label?: string;
	} = $props();

	const interactive = $derived(!!ontoggle);

	// After a miss: green for every key that should be down, red for one
	// pressed that should not have been.
	function state(id: string): 'right' | 'wrong' | null {
		if (!want) return null;
		if (want.has(id)) return 'right';
		if (held.has(id)) return 'wrong';
		return null;
	}

	function onkey(event: KeyboardEvent, id: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		event.stopPropagation();
		ontoggle?.(id);
	}
</script>

<svg
	class="woodwind"
	class:small
	class:landscape={layout.width > layout.height}
	viewBox="0 0 {layout.width} {layout.height}"
	role="group"
	aria-label={label}
>
	{#each layout.body as part, i (i)}
		<rect class="body" x={part.x} y={part.y} width={part.w} height={part.h} rx={part.r} />
	{/each}
	{#each layout.keys as k (k.id)}
		{@const s = state(k.id)}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<g
			class={k.shape}
			class:down={held.has(k.id)}
			class:right={s === 'right'}
			class:wrong={s === 'wrong'}
			class:clickable={interactive}
			transform={k.angle ? `rotate(${k.angle} ${k.x} ${k.y})` : undefined}
			role={interactive ? 'button' : 'img'}
			tabindex={interactive ? 0 : undefined}
			aria-pressed={interactive ? held.has(k.id) : undefined}
			aria-label={k.name}
			onclick={() => ontoggle?.(k.id)}
			onkeydown={(e) => onkey(e, k.id)}
		>
			{#if k.shape === 'hole'}
				<circle cx={k.x} cy={k.y} r={k.w / 2} />
			{:else}
				<rect
					x={k.x - k.w / 2}
					y={k.y - k.h / 2}
					width={k.w}
					height={k.h}
					rx={Math.min(k.w, k.h) / 2}
				/>
			{/if}
			{#if !small}
				<text x={k.x} y={k.y}>{k.label}</text>
			{/if}
		</g>
	{/each}
</svg>

<style>
	/* Upright instruments are limited by height, the flute by width; either
	   way the keys come out about a fingertip wide. */
	.woodwind {
		display: block;
		width: 100%;
		max-width: 24rem;
		max-height: 34rem;
		margin: 0 auto;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	.woodwind.landscape {
		max-width: 38rem;
	}
	.woodwind.small {
		max-width: 7rem;
		max-height: 9rem;
	}
	.body {
		fill: #e5e7eb;
		stroke: #3b2a10;
		stroke-width: 2;
	}
	circle,
	.key rect {
		stroke: #3b2a10;
		stroke-width: 2;
		transition: fill 80ms;
	}
	.hole circle {
		fill: #fff;
	}
	.key rect {
		fill: #c9ced8;
	}
	.down circle,
	.down rect {
		fill: #2563eb;
	}
	.right circle,
	.right rect {
		fill: #22c55e;
		stroke: #15803d;
		stroke-width: 3;
	}
	.wrong circle,
	.wrong rect {
		fill: #f87171;
		stroke: #b91c1c;
		stroke-width: 3;
	}
	text {
		font-size: 9px;
		font-weight: 700;
		text-anchor: middle;
		dominant-baseline: central;
		fill: #1f2937;
		pointer-events: none;
	}
	.down text,
	.right text,
	.wrong text {
		fill: #fff;
	}
	.clickable {
		cursor: pointer;
	}
	.clickable:focus {
		outline: none;
	}
	.clickable:focus-visible circle,
	.clickable:focus-visible rect {
		stroke: var(--blue);
		stroke-width: 4;
	}
</style>
