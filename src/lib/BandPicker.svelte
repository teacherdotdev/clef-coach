<script lang="ts">
	// Where a band student picks their instrument, from pictures, so a student
	// unsure of its name can still find it.
	import { BAND_INSTRUMENTS, type BandInstrument } from './band';
	import { instrumentArt } from './instrumentArt';

	let {
		offered,
		onpick
	}: {
		offered: BandInstrument[];
		onpick: (inst: BandInstrument) => void;
	} = $props();
</script>

<div class="picker">
	<h2>What do you play?</h2>
	<ul>
		{#each offered as inst (inst)}
			<li>
				<button type="button" onclick={() => onpick(inst)}>
					<img src={instrumentArt(inst)} alt="" />
					<span>{BAND_INSTRUMENTS[inst].name}</span>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.picker h2 {
		margin: 0 0 1rem;
		font-size: 1.3rem;
		font-weight: 800;
		text-align: center;
	}
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		height: 100%;
		padding: 0.9rem 0.5rem 0.75rem;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		background: #fff;
		font: inherit;
		font-weight: 700;
		color: #1f2937;
		cursor: pointer;
	}
	button:hover {
		border-color: var(--blue-border);
		background: var(--blue-soft);
	}
	button:focus-visible {
		outline: 3px solid var(--blue);
		outline-offset: 2px;
	}
	img {
		width: 100%;
		max-width: 5.5rem;
		height: 4.5rem;
		object-fit: contain;
	}
	span {
		font-size: 0.95rem;
		text-align: center;
	}
</style>
