<script lang="ts">
	// One fingering drawn small and read-only — "You played" or "It was" in the
	// report. The right answer is drawn in green, so the two read as a pair.
	import Keys from './Keys.svelte';
	import Slide from './Slide.svelte';
	import Valves from './Valves.svelte';
	import { valvesIn, type Controls } from './band';

	let {
		controls,
		fingering,
		right = false,
		span
	}: {
		controls: Controls | 'piano';
		fingering: string;
		/** Draw it as the right answer (green) rather than as what was played. */
		right?: boolean;
		span: { low: number; high: number };
	} = $props();

	const valves = $derived(valvesIn(fingering));
</script>

{#if controls === 'valves' || controls === 'horn'}
	<Valves
		horn={controls === 'horn'}
		held={valves}
		want={right ? valves : null}
		label={right ? 'The right valves' : 'The valves played'}
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
