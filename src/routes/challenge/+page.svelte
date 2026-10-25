<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import BandPicker from '$lib/BandPicker.svelte';
	import Exercise from '$lib/Exercise.svelte';
	import { BAND_INSTRUMENTS, type BandInstrument } from '$lib/band';
	import { bandPractice } from '$lib/practice';
	import { asksFingering, settingsFromParams } from '$lib/settings';
	import { INSTRUMENT_NAMES } from '$lib/strings';

	// Read the challenge settings straight from the link's query string.
	const settings = $derived(settingsFromParams(page.url.searchParams));

	// A band student picks their instrument; it is remembered on their device,
	// and skipped when the teacher has offered only one.
	const INSTRUMENT_KEY = 'noteid:bandinst';
	let picked = $state<BandInstrument | null>(null);
	let ready = $state(false);
	const offered = $derived(settings.bandInstruments);
	const bandInstrument = $derived(
		offered.length === 1 ? offered[0] : picked && offered.includes(picked) ? picked : null
	);

	onMount(() => {
		try {
			picked = localStorage.getItem(INSTRUMENT_KEY) as BandInstrument | null;
		} catch {
			picked = null;
		}
		ready = true;
	});

	function pick(inst: BandInstrument) {
		picked = inst;
		try {
			localStorage.setItem(INSTRUMENT_KEY, inst);
		} catch {
			// Picked for now; just not remembered.
		}
	}

	const title = $derived.by(() => {
		if (settings.activity === 'piano') return 'Piano: Find the Note';
		if (settings.activity === 'band')
			return bandInstrument
				? `${BAND_INSTRUMENTS[bandInstrument].name}: ${bandPractice(settings, bandInstrument).askName ? 'Name & Play' : 'Play the Note'}`
				: 'Band: Notes & Fingering';
		return asksFingering(settings)
			? `${INSTRUMENT_NAMES[settings.instrument]}: Notes & Fingering`
			: `${INSTRUMENT_NAMES[settings.instrument]}: Name the Note`;
	});
</script>

<div class="challenge">
	<header class="no-print">
		<h1>{title}</h1>
		{#if settings.activity === 'band' && bandInstrument && offered.length > 1}
			<button type="button" class="btn-ghost change" onclick={() => (picked = null)}>
				Change instrument
			</button>
		{/if}
	</header>

	{#if settings.activity !== 'band'}
		{#key page.url.search}
			<Exercise {settings} {title} />
		{/key}
	{:else if bandInstrument}
		{#key `${page.url.search}#${bandInstrument}`}
			<Exercise {settings} {title} {bandInstrument} />
		{/key}
	{:else if ready}
		<BandPicker {offered} onpick={pick} />
	{/if}
</div>

<style>
	.challenge {
		max-width: 36rem;
		margin: 0 auto;
		padding: 1.5rem 1.25rem 3rem;
	}
	header {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}
	h1 {
		font-size: 1.6rem;
		font-weight: 800;
	}
	.change {
		padding: 0.4rem 0.8rem;
		font-size: 0.85rem;
	}
</style>
