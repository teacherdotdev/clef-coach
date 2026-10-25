<script lang="ts">
	// Every note each band instrument is asked about, on the staff beside every
	// fingering the app accepts for it — the first one listed is the one shown
	// when a student misses. A band teacher checks this page before students
	// use the instruments (docs/adr/0005).
	import FingeringPicture from '$lib/FingeringPicture.svelte';
	import Staff from '$lib/Staff.svelte';
	import {
		ALL_BAND_INSTRUMENTS,
		BAND_INSTRUMENTS,
		bandFingerings,
		chartPitches,
		describeBandFingering,
		type BandInstrument
	} from '$lib/band';
	import { instrumentArt } from '$lib/instrumentArt';
	import type { Accidental, Note } from '$lib/music';

	// Bells are answered by the bar itself, so there is nothing to check.
	const CHECKED = ALL_BAND_INSTRUMENTS.filter((i) => i !== 'bells');

	let shown = $state<BandInstrument>('trumpet');

	// Black keys are spelled as sharps here; a flat plays the same way.
	const SPELLING: [string, Accidental | null][] = [
		['C', null],
		['C', 'sharp'],
		['D', null],
		['D', 'sharp'],
		['E', null],
		['F', null],
		['F', 'sharp'],
		['G', null],
		['G', 'sharp'],
		['A', null],
		['A', 'sharp'],
		['B', null]
	];

	function noteFor(pitch: number): Note {
		const [letter, accidental] = SPELLING[((pitch % 12) + 12) % 12];
		return { letter, octave: Math.floor(pitch / 12), value: 'whole', accidental };
	}

	function name(pitch: number): string {
		const [letter, accidental] = SPELLING[((pitch % 12) + 12) % 12];
		return `${letter}${accidental ? '♯' : ''}${Math.floor(pitch / 12)}`;
	}

	const rows = $derived(
		chartPitches(shown).map((pitch) => ({ pitch, ways: bandFingerings(shown, pitch) }))
	);
	const def = $derived(BAND_INSTRUMENTS[shown]);
	const levels = $derived(def.levels);
</script>

<svelte:head><title>Fingering charts · Clef Coach</title></svelte:head>

<div class="page">
	<h1>Fingering charts</h1>
	<p class="lead">
		Every written note each instrument can be asked about, with every fingering accepted as right.
		The first one listed is the one shown to a student who misses it. Please let us know about
		anything that doesn't match how you teach it.
	</p>

	<div class="tabs" role="tablist">
		{#each CHECKED as inst (inst)}
			<button
				type="button"
				role="tab"
				aria-selected={shown === inst}
				class:on={shown === inst}
				onclick={() => (shown = inst)}
			>
				<img src={instrumentArt(inst)} alt="" />
				{BAND_INSTRUMENTS[inst].name}
			</button>
		{/each}
	</div>

	<p class="levels">
		Written ranges — Beginner {levels.beginner.low}–{levels.beginner.high} · Intermediate {levels
			.intermediate.low}–{levels.intermediate.high} · Advanced {levels.advanced.low}–{levels
			.advanced.high}
	</p>

	<ul class="chart">
		{#each rows as row (row.pitch)}
			<li>
				<div class="note">
					<Staff clef={def.clef} note={noteFor(row.pitch)} />
					<span class="name">{name(row.pitch)}</span>
				</div>
				<div class="ways">
					{#each row.ways as way, i (way)}
						<figure class:first={i === 0}>
							<FingeringPicture
								controls={def.controls}
								fingering={way}
								span={{ low: 0, high: 0 }}
							/>
							<figcaption>{describeBandFingering(shown, way)}</figcaption>
						</figure>
					{/each}
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.page {
		max-width: 52rem;
		margin: 0 auto;
		padding: 1.5rem 1.25rem 3rem;
	}
	h1 {
		font-size: 1.6rem;
		font-weight: 800;
	}
	.lead {
		color: #444;
		margin: 0.5rem 0 1.25rem;
	}
	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.tabs button {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem 0.35rem 0.4rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: #fff;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}
	.tabs button.on {
		border-color: var(--blue);
		background: var(--blue-soft);
		color: var(--blue-dark);
	}
	.tabs img {
		width: 2rem;
		height: 1.6rem;
		object-fit: contain;
	}
	.levels {
		margin: 1rem 0;
		font-size: 0.85rem;
		color: #555;
	}
	.chart {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
		gap: 0.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.chart li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: #fff;
	}
	.note {
		flex: 0 0 7.5rem;
		text-align: center;
	}
	.name {
		font-weight: 700;
		font-size: 0.9rem;
	}
	.ways {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
	}
	figure {
		margin: 0;
		width: 6.5rem;
		text-align: center;
		opacity: 0.75;
	}
	figure.first {
		opacity: 1;
	}
	figcaption {
		font-size: 0.75rem;
		color: #444;
	}
</style>
