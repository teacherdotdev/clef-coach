<script lang="ts">
	// The valves a brass student presses: three piston valves seen from the
	// front (trumpet, baritone, tuba), or the horn's three rotary-valve levers
	// with the thumb trigger beside them. Clicking a valve presses or releases
	// it; the parent decides when the answer is played.
	//
	// The same drawing shows a fingering read-only, small, in the report.

	let {
		horn = false,
		held,
		want = null,
		ontoggle,
		hints = null,
		label = 'Valves',
		small = false
	}: {
		horn?: boolean;
		/** Valves drawn pressed down: '1', '2', '3', and 'T' for the trigger. */
		held: Set<string>;
		/** After a miss: the valves that should have been down. */
		want?: Set<string> | null;
		/** Leave out for a picture that cannot be clicked. */
		ontoggle?: (valve: string) => void;
		/** Computer-keyboard keys to print under each valve. */
		hints?: Record<string, string> | null;
		label?: string;
		/** Drawn small, as in the report. */
		small?: boolean;
	} = $props();

	const valves = $derived(horn ? ['T', '1', '2', '3'] : ['1', '2', '3']);
	const interactive = $derived(!!ontoggle);

	// After a miss: green for every valve that should be down, red for one
	// pressed that should not have been.
	function state(v: string): 'right' | 'wrong' | null {
		if (!want) return null;
		if (want.has(v)) return 'right';
		if (held.has(v)) return 'wrong';
		return null;
	}

	function name(v: string): string {
		return v === 'T' ? 'Thumb trigger' : `Valve ${v}`;
	}

	function onkey(event: KeyboardEvent, v: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		// Keep the space bar from also reaching the page's own shortcuts.
		event.stopPropagation();
		ontoggle?.(v);
	}

	// Piston valves: each a casing with a pearl button on a stem. Pressed, the
	// button sinks into the casing.
	const PISTON_X = [50, 120, 190];
	// Horn levers stand side by side; the trigger lies along the bottom left,
	// where the thumb reaches it.
	const LEVER_X = [118, 168, 218];
</script>

<svg
	class="valves"
	class:small
	viewBox={horn ? '0 0 270 160' : '0 0 240 160'}
	role="group"
	aria-label={label}
>
	{#if !horn}
		{#each valves as v, i (v)}
			{@const x = PISTON_X[i]}
			{@const down = held.has(v)}
			{@const top = down ? 44 : 20}
			{@const s = state(v)}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<g
				class="valve"
				class:down
				class:right={s === 'right'}
				class:wrong={s === 'wrong'}
				class:clickable={interactive}
				role={interactive ? 'button' : 'img'}
				tabindex={interactive ? 0 : undefined}
				aria-pressed={interactive ? down : undefined}
				aria-label={name(v)}
				onclick={() => ontoggle?.(v)}
				onkeydown={(e) => onkey(e, v)}
			>
				<rect class="hit" x={x - 32} y="8" width="64" height="146" />
				<rect class="stem" x={x - 5} y={top + 10} width="10" height={66 - top} />
				<rect class="casing" x={x - 24} y="66" width="48" height="66" rx="9" />
				<rect class="band" x={x - 24} y="76" width="48" height="8" />
				<rect class="cap" x={x - 22} y={top} width="44" height="14" rx="5" />
				<ellipse class="cap" cx={x} cy={top} rx="22" ry="8" />
				<text {x} y="152" class="num">{v}</text>
			</g>
		{/each}
	{:else}
		{#each valves as v (v)}
			{@const down = held.has(v)}
			{@const s = state(v)}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<g
				class="valve"
				class:down
				class:right={s === 'right'}
				class:wrong={s === 'wrong'}
				class:clickable={interactive}
				role={interactive ? 'button' : 'img'}
				tabindex={interactive ? 0 : undefined}
				aria-pressed={interactive ? down : undefined}
				aria-label={name(v)}
				onclick={() => ontoggle?.(v)}
				onkeydown={(e) => onkey(e, v)}
			>
				{#if v === 'T'}
					{@const dy = down ? 8 : 0}
					<rect class="hit" x="6" y="70" width="86" height="80" />
					<rect class="stem" x="72" y={100 + dy} width="24" height="10" />
					<rect class="cap" x="12" y={88 + dy} width="70" height="32" rx="16" />
					<text x="47" y="152" class="num">T</text>
				{:else}
					{@const x = LEVER_X[Number(v) - 1]}
					{@const top = down ? 36 : 14}
					<rect class="hit" x={x - 24} y="6" width="48" height="148" />
					<rect class="casing" x={x - 18} y="94" width="36" height="40" rx="18" />
					<rect class="stem" x={x - 5} y={top + 30} width="10" height={100 - top - 30} />
					<rect class="cap" x={x - 18} y={top} width="36" height="46" rx="18" />
					<text {x} y="152" class="num">{v}</text>
				{/if}
			</g>
		{/each}
	{/if}
</svg>

{#if hints && interactive}
	<p class="hints">
		{#each valves as v (v)}
			<span><kbd>{hints[v]}</kbd> {v === 'T' ? 'trigger' : `valve ${v}`}</span>
		{/each}
	</p>
{/if}

<style>
	.valves {
		display: block;
		width: 100%;
		max-width: 22rem;
		margin: 0 auto;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	.valves.small {
		max-width: 7rem;
	}
	.hit {
		fill: transparent;
	}
	.clickable {
		cursor: pointer;
	}
	.clickable:focus {
		outline: none;
	}
	.clickable:focus-visible .cap {
		stroke: var(--blue);
		stroke-width: 4;
	}
	.casing {
		fill: #f2b632;
		stroke: #3b2a10;
		stroke-width: 2.6;
	}
	.band {
		fill: #3b2a10;
		opacity: 0.18;
	}
	.stem {
		fill: #c9ced8;
		stroke: #3b2a10;
		stroke-width: 2;
	}
	.cap {
		fill: #fbf3dc;
		stroke: #3b2a10;
		stroke-width: 2.6;
		transition: fill 80ms;
	}
	.down .cap {
		fill: #93c5fd;
	}
	.right .cap {
		fill: #86efac;
		stroke: #15803d;
		stroke-width: 4;
	}
	.wrong .cap {
		fill: #fca5a5;
		stroke: #b91c1c;
		stroke-width: 4;
	}
	.num {
		font-size: 18px;
		font-weight: 800;
		text-anchor: middle;
		fill: #1f2937;
	}
	.small .num {
		font-size: 22px;
	}
	.hints {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem 0.9rem;
		margin: 0.35rem 0 0;
		font-size: 0.8rem;
		color: #6b7280;
	}
	kbd {
		display: inline-block;
		min-width: 1.4rem;
		padding: 0.05rem 0.3rem;
		border: 1px solid #d1d5db;
		border-bottom-width: 2px;
		border-radius: 5px;
		background: #fff;
		font-family: inherit;
		font-weight: 700;
		color: #374151;
		text-align: center;
	}
</style>
