<script lang="ts">
	// Where a band or piano student plays the note: the instrument's controls,
	// with its picture beside them, and — for valves and slide — a Play button,
	// since a fingering is several things held at once. A key or bar is played
	// the moment it is struck.
	//
	// Brass can also be played from the computer keyboard: hold the valve keys
	// and press Enter, which feels more like playing than clicking does.
	import { onDestroy } from 'svelte';
	import Keys from './Keys.svelte';
	import Slide from './Slide.svelte';
	import Valves from './Valves.svelte';
	import WoodwindKeys from './WoodwindKeys.svelte';
	import {
		CONTROLS,
		valveAnswer,
		valvesIn,
		woodwindOf,
		type BandInstrument,
		type Controls
	} from './band';
	import { instrumentArt } from './instrumentArt';
	import { keysIn, woodwindAnswer } from './woodwinds';

	let {
		controls,
		instrument,
		span,
		reveal = null,
		locked = false,
		onplay
	}: {
		controls: Controls | 'piano';
		instrument: BandInstrument | null;
		/** The keys to draw, for piano and bells. */
		span: { low: number; high: number };
		/** After a miss: what was played and what was right. */
		reveal?: { gave: string; want: string } | null;
		/** True while a verdict is showing; nothing can be pressed. */
		locked?: boolean;
		onplay: (answer: string) => void;
	} = $props();

	const info = $derived(CONTROLS[controls]);
	const keyMap = $derived(info.keyboard);
	const woodwind = $derived(controls === 'woodwind' ? woodwindOf(instrument) : null);
	const wide = $derived(
		info.wide || (!!woodwind && woodwind.layout.width > woodwind.layout.height)
	);
	const hints = $derived(
		Object.fromEntries(
			Object.entries(keyMap).map(([k, v]) => [v, k === ' ' ? 'Space' : k.toUpperCase()])
		)
	);

	// Valves clicked down, and valves held down on the keyboard. Either counts.
	let clicked = $state<Set<string>>(new Set());
	let keyHeld = $state<Set<string>>(new Set());
	let position = $state<number | null>(null);

	const held = $derived(new Set([...clicked, ...keyHeld]));

	const art = $derived(instrumentArt(instrument ?? 'piano'));
	const usesPlay = $derived(info.playButton);

	function toggle(v: string) {
		if (locked) return;
		clicked = clicked.has(v)
			? new Set([...clicked].filter((x) => x !== v))
			: new Set([...clicked, v]);
	}

	function play() {
		if (locked) return;
		if (controls === 'slide') {
			if (position !== null) onplay(String(position));
			return;
		}
		onplay(woodwind ? woodwindAnswer(woodwind.layout, held) : valveAnswer(held));
	}

	/** Start the next note with everything released. */
	export function reset() {
		clicked = new Set();
		keyHeld = new Set();
		position = null;
	}

	function isTyping(event: KeyboardEvent): boolean {
		const el = event.target as HTMLElement | null;
		return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
	}

	function keydown(event: KeyboardEvent) {
		if (isTyping(event) || event.metaKey || event.ctrlKey || event.altKey) return;
		const key = event.key.toLowerCase();
		if (locked) return;
		if (keyMap[key]) {
			event.preventDefault();
			if (!keyHeld.has(keyMap[key])) keyHeld = new Set([...keyHeld, keyMap[key]]);
			return;
		}
		if (controls === 'slide' && /^[1-7]$/.test(key)) {
			event.preventDefault();
			position = Number(key);
			return;
		}
		if (key === 'enter' && usesPlay) {
			// A focused button handles its own Enter; a focused key or valve does
			// not, so Enter plays whatever is held down.
			const el = event.target as HTMLElement | null;
			if (el && el !== document.body && el.closest('button')) return;
			event.preventDefault();
			play();
		}
	}

	function keyup(event: KeyboardEvent) {
		const v = keyMap[event.key.toLowerCase()];
		if (!v || !keyHeld.has(v)) return;
		keyHeld = new Set([...keyHeld].filter((x) => x !== v));
	}

	// Letting go of the window (switching tabs mid-press) releases every key.
	function blur() {
		keyHeld = new Set();
	}

	onDestroy(() => {
		keyHeld = new Set();
	});

	// After a miss the drawing shows what was played against what was right.
	const readKeys = $derived(woodwind ? keysIn : valvesIn);
	const shownHeld = $derived(reveal ? readKeys(reveal.gave) : held);
	const wantValves = $derived(reveal ? readKeys(reveal.want) : null);
</script>

<svelte:window onkeydown={keydown} onkeyup={keyup} onblur={blur} />

<div class="pad" class:wide>
	<!-- A keyboard, or a flute's keys, need the whole width; the picture would
	     only crowd them. -->
	{#if art && !wide}
		<img class="art" src={art} alt="" />
	{/if}

	<div class="controls">
		{#if controls === 'valves' || controls === 'horn'}
			<Valves
				horn={controls === 'horn'}
				held={shownHeld}
				want={wantValves}
				ontoggle={reveal || locked ? undefined : toggle}
				{hints}
			/>
		{:else if woodwind}
			<WoodwindKeys
				layout={woodwind.layout}
				held={shownHeld}
				want={wantValves}
				ontoggle={reveal || locked ? undefined : toggle}
			/>
		{:else if controls === 'slide'}
			<Slide
				position={reveal ? Number(reveal.gave) : position}
				want={reveal ? Number(reveal.want) : null}
				onset={reveal || locked ? undefined : (p) => (position = p)}
			/>
			<p class="hint">Drag the slide or click a position — or press <kbd>1</kbd>–<kbd>7</kbd>.</p>
		{:else}
			<Keys
				low={span.low}
				high={span.high}
				bars={controls === 'bars'}
				struck={reveal ? Number(reveal.gave) : null}
				want={reveal ? Number(reveal.want) : null}
				onstrike={reveal || locked ? undefined : (p) => onplay(String(p))}
			/>
		{/if}
	</div>

	{#if usesPlay && !reveal}
		<button
			type="button"
			class="btn-primary play"
			disabled={locked || (controls === 'slide' && position === null)}
			onclick={play}
		>
			Play <span class="enter">⏎ Enter</span>
		</button>
	{/if}
</div>

<style>
	.pad {
		display: grid;
		grid-template-columns: 5.5rem 1fr;
		grid-template-areas:
			'art controls'
			'play play';
		align-items: center;
		gap: 0.75rem 1rem;
		margin-top: 0.5rem;
	}
	.pad.wide {
		grid-template-columns: 1fr;
		grid-template-areas:
			'controls'
			'play';
	}
	.art {
		grid-area: art;
		width: 100%;
		height: auto;
	}
	.controls {
		grid-area: controls;
		min-width: 0;
	}
	.play {
		grid-area: play;
		justify-self: center;
		min-width: 12rem;
		padding: 0.85rem 1.5rem;
		font-size: 1.1rem;
		gap: 0.6rem;
	}
	.enter {
		font-size: 0.75rem;
		font-weight: 600;
		opacity: 0.75;
	}
	.hint {
		margin: 0.35rem 0 0;
		text-align: center;
		font-size: 0.8rem;
		color: #6b7280;
	}
	kbd {
		padding: 0 0.3rem;
		border: 1px solid #d1d5db;
		border-bottom-width: 2px;
		border-radius: 4px;
		background: #fff;
		font-family: inherit;
		font-weight: 700;
	}
	@media (max-width: 30rem) {
		.pad {
			grid-template-columns: 1fr;
			grid-template-areas:
				'controls'
				'play';
		}
		.art {
			display: none;
		}
		.enter {
			display: none;
		}
	}
</style>
