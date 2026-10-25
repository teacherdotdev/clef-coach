<script lang="ts">
	// One fingering drawn small and read-only — "You played" or "It was" in the
	// report. The right answer is drawn in green, so the two read as a pair.
	import Keys from './Keys.svelte';
	import Slide from './Slide.svelte';
	import Valves from './Valves.svelte';
	import WoodwindKeys from './WoodwindKeys.svelte';
	import { valvesIn, woodwindOf, type BandInstrument, type Controls } from './band';
	import { keysIn } from './woodwinds';

	let {
		controls,
		instrument = null,
		fingering,
		right = false,
		span
	}: {
		controls: Controls | 'piano';
		/** Needed for a woodwind, whose keys are the instrument's own. */
		instrument?: BandInstrument | null;
		fingering: string;
		/** Draw it as the right answer (green) rather than as what was played. */
		right?: boolean;
		span: { low: number; high: number };
	} = $props();

	const woodwind = $derived(controls === 'woodwind' ? woodwindOf(instrument) : null);
	const valves = $derived(woodwind ? keysIn(fingering) : valvesIn(fingering));
</script>

{#if controls === 'valves' || controls === 'horn'}
	<Valves
		horn={controls === 'horn'}
		held={valves}
		want={right ? valves : null}
		label={right ? 'The right valves' : 'The valves played'}
		small
	/>
{:else if woodwind}
	<WoodwindKeys
		layout={woodwind.layout}
		held={valves}
		want={right ? valves : null}
		label={right ? 'The right keys' : 'The keys played'}
		small
	/>
{:else if controls === 'slide'}
	<Slide position={Number(fingering)} want={right ? Number(fingering) : null} small />
{:else}
	<Keys
		low={span.low}
		high={span.high}
		bars={controls === 'bars'}
		struck={right ? null : Number(fingering)}
		want={right ? Number(fingering) : null}
		small
	/>
{/if}
