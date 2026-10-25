<script lang="ts">
	// The student's view. In Challenge Mode it runs: ready → running → results
	// (with a progress report). Without a challenge limit it's endless practice.
	//
	// Each staff image is one question, which may take several steps: name the
	// note, then which string, then — on the bass — which position, then which
	// finger. Steps are asked one at a time, but the answers already given stay
	// on screen so the student sees the whole fingering come together. A wrong
	// answer at any step ends the question there and shows what it should have
	// been.
	//
	// Band and piano questions end with the student playing the note on a
	// drawing of their instrument instead. A wrong fingering stays on the drawing
	// until they move on, since a fingering takes longer to take in than a word.
	import { onDestroy, onMount, tick } from 'svelte';
	import Fingerboard from './Fingerboard.svelte';
	import FingeringPicture from './FingeringPicture.svelte';
	import PlayPad from './PlayPad.svelte';
	import Staff from './Staff.svelte';
	import { CONTROLS, describeBandFingering, type BandInstrument } from './band';
	import { bandPractice, keyboardSpan, pianoPractice, type Practice } from './practice';
	import {
		ACCIDENTAL_NAMES,
		ACCIDENTAL_SYMBOLS,
		ALL_ACCIDENTALS,
		fromDiatonicIndex,
		noteAt,
		noteLabel,
		notesToAsk,
		parseNoteName,
		pitchInKey,
		pitchName,
		soundingAccidental,
		writableAccidentals,
		type Accidental,
		type Clef,
		type Note
	} from './music';
	import {
		asksFingering,
		asksPosition,
		fingeringOptions,
		formatDuration,
		isChallengeMode,
		settingsToQuery,
		usesFingerboard,
		type Settings
	} from './settings';
	import {
		FINGERS,
		FINGER_SETS,
		fingeringsFor,
		INSTRUMENTS,
		isOpen,
		playableRange,
		positionLabel,
		positionName,
		preferredFingering,
		spotOf,
		spotsFor,
		stringName,
		type Fingering,
		type PositionId
	} from './strings';

	let {
		settings,
		title = 'Clef Coach',
		bandInstrument = null
	}: {
		settings: Settings;
		title?: string;
		/** The instrument a band student picked. */
		bandInstrument?: BandInstrument | null;
	} = $props();

	// What a band or piano student reads and plays; null for the strings, whose
	// questions work from the settings directly.
	const practice: Practice | null = $derived(
		settings.activity === 'band' && bandInstrument
			? bandPractice(settings, bandInstrument)
			: settings.activity === 'piano'
				? pianoPractice(settings)
				: null
	);
	// The key every staff is drawn in and every note is read in.
	const keySig = $derived(practice?.key ?? settings.key);
	// The keys or bars a keyboard instrument draws. The strings never draw
	// any; the two octaves from middle C only keep the type simple.
	const span = $derived(
		practice ? keyboardSpan(practice.staves, practice.key) : { low: 48, high: 71 }
	);

	const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	// How long the right answer stays up after a miss. Short enough to keep the
	// run moving, long enough that a student reads it rather than glimpses it.
	const REVEAL_MS = 1800;

	// How long "Correct!" stays up before the next step. A right answer needs far
	// less time than a wrong one — there is nothing to read but the word itself —
	// but it does need long enough to be read at all.
	const CORRECT_MS = 700;

	const challenge = $derived(isChallengeMode(settings));
	const instrument = $derived(settings.instrument);
	const def = $derived(INSTRUMENTS[instrument]);
	// The key, the positions and the fingers on the menu — everything the
	// fingering engine needs to answer "how could this note be played".
	const fingering = $derived(fingeringOptions(settings));

	// Range as diatonic indices (low ≤ high), never reaching past what the
	// instrument can actually finger with the fingerings being taught.
	const bounds = $derived.by(() => {
		let low = Math.min(parseNoteName(settings.rangeLow), parseNoteName(settings.rangeHigh));
		let high = Math.max(parseNoteName(settings.rangeLow), parseNoteName(settings.rangeHigh));
		const playable = playableRange(instrument, fingering);
		low = Math.max(low, parseNoteName(playable.low));
		high = Math.min(high, parseNoteName(playable.high));
		if (low > high) [low, high] = [parseNoteName(playable.low), parseNoteName(playable.high)];
		return { low, high };
	});
	const lowIndex = $derived(bounds.low);
	const highIndex = $derived(bounds.high);

	function pick<T>(items: T[]): T {
		return items[Math.floor(Math.random() * items.length)];
	}

	type StepId = 'note' | 'accidental' | 'string' | 'spot' | 'finger' | 'position' | 'play';

	// A string student on the drawing taps the spot on the fingerboard, which
	// answers string and finger at once (and, on the bass, where the hand is).
	const boardMode = $derived(usesFingerboard(settings));
	const spots = $derived(boardMode ? spotsFor(settings.instrument, fingering) : []);
	interface Given {
		step: StepId;
		label: string;
		ok: boolean;
	}

	function optionsFor(index: number, accidental: Accidental | null = null): Fingering[] {
		return fingeringsFor(settings.instrument, index, fingering, accidental);
	}

	/** One question waiting to be asked: a staff position, with or without a sign. */
	interface Ask {
		index: number;
		accidental: Accidental | null;
		/** The staff it is read on — a piano reading both clefs has two. */
		clef: Clef;
	}

	// A string instrument decides the clef, so a run only ever reads in one of
	// them. A piano may read in two.
	const clef = $derived(settings.clefs[0]);

	// Every note this activity can ask about, low to high, with the staff it is
	// read on.
	const pool = $derived.by((): { index: number; clef: Clef }[] => {
		if (practice)
			return practice.staves.flatMap((st) =>
				notesToAsk({
					clef: st.clef,
					lowIndex: st.low,
					highIndex: st.high,
					position: settings.positions,
					playable: (i) => practice!.plays(i).length > 0
				}).map((index) => ({ index, clef: st.clef }))
			);
		return notesToAsk({
			clef,
			lowIndex,
			highIndex,
			position: settings.positions,
			// Restricting the fingerings can leave notes inside the range with no
			// way to play them; don't ask about those.
			playable: asksFingering(settings) ? (i) => optionsFor(i).length > 0 : undefined
		}).map((index) => ({ index, clef }));
	});

	// --- what to ask next ---
	//
	// A run starts by sweeping the range: every note once, in a shuffled order,
	// so the student meets the whole range instead of the same few notes. Then it
	// comes back to the notes they missed on the way through. After that there is
	// nothing left to be systematic about, and notes are drawn at random.
	let sweeping = $state(true);
	let queue = $state<Ask[]>([]);
	let missed = $state<Ask[]>([]);
	startSweep();

	function startSweep() {
		sweeping = true;
		queue = shuffle(pool).map(ask);
		missed = [];
	}

	function nextAsk(): Ask {
		if (!queue.length && sweeping && missed.length) {
			queue = shuffle(missed);
			missed = [];
			sweeping = false;
		}
		if (queue.length) return queue.shift()!;
		sweeping = false;
		return ask(pick(pool));
	}

	// Decide whether a note is asked plain or with a sign in front of it. About
	// half the notes keep a sign when accidentals are on, so the student still
	// has to read the key signature for the rest. A sign that would put the note
	// out of reach of the fingerings being taught is not offered.
	function ask({ index, clef }: { index: number; clef: Clef }): Ask {
		if (!settings.accidentals) return { index, clef, accidental: null };
		const { letter } = fromDiatonicIndex(index);
		const signs = writableAccidentals(keySig, letter).filter((a) =>
			practice
				? practice.plays(index, a).length > 0
				: !asksFingering(settings) || optionsFor(index, a).length > 0
		);
		if (!signs.length || Math.random() < 0.5) return { index, clef, accidental: null };
		return { index, clef, accidental: pick(signs) };
	}

	// Fisher–Yates: each order is as likely as any other.
	function shuffle<T>(items: T[]): T[] {
		const out = [...items];
		for (let i = out.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[out[i], out[j]] = [out[j], out[i]];
		}
		return out;
	}

	function newQuestion(): { clef: Clef; note: Note; index: number } {
		const { index, accidental, clef } = nextAsk();
		return { clef, note: noteAt(index, settings.noteValues, accidental), index };
	}

	// Band and piano students may go straight to playing.
	function firstStep(): StepId {
		return practice && !practice.askName ? 'play' : 'note';
	}

	/** Every right way to play the note being asked, the first-taught first. */
	function playsFor(q: { index: number; note: Note }): string[] {
		return practice ? practice.plays(q.index, q.note.accidental ?? null) : [];
	}

	// --- run state ---
	let phase = $state<'ready' | 'running' | 'done'>(isChallengeMode(settings) ? 'ready' : 'running');
	let current = $state(newQuestion());
	let step = $state<StepId>(firstStep());
	// Every fingering still consistent with what the student has answered so far.
	let options = $state<Fingering[]>(optionsFor(current.index, current.note.accidental));
	// A band or piano note's right answers, and — after a wrong one — what was
	// played against what was right, shown on the drawing until Next.
	let plays = $state<string[]>(playsFor(current));
	let reveal = $state<{ gave: string; want: string } | null>(null);
	let pad = $state<PlayPad>();
	/** The sign in front of the note being asked, if there is one. */
	const written = $derived(current.note.accidental ?? null);
	let given = $state<Given[]>([]);
	let wrongKeys = $state<string[]>([]);
	// The wrong answers given to this question, each paired with the answer that
	// would have been right — which is what the report at the end is built from.
	let wrongAnswers = $state<Miss[]>([]);
	let locked = $state(false);
	let correct = $state(0);
	let attempted = $state(0);
	let completed = $state(0);
	let startTime = Date.now();
	let elapsedMs = $state(0);
	let isHighScore = $state(false);

	/** One wrong answer: what was being asked, what was said, what was right. */
	interface Miss {
		step: StepId;
		gave: string;
		want: string;
		/** A wrong fingering as played and as it should have been, for drawing. */
		played?: { gave: string; want: string };
	}

	/** How one note fared over the run, for the report at the end. */
	interface NoteTally {
		/** The note as it was asked, so the report can draw it back. */
		index: number;
		accidental: Accidental | null;
		clef: Clef;
		asked: number;
		/** Questions with at least one wrong answer in them. */
		wrong: number;
		/** The wrong answers themselves, the same slip counted once with a tally. */
		misses: (Miss & { times: number })[];
	}
	// Keyed by the note *and* its sign: F and F♯ are two different things to get
	// wrong, and the teacher wants to know which one it was.
	let tally = $state<Record<string, NoteTally>>({});

	let ticker: ReturnType<typeof setInterval> | undefined;
	let revealTimer: ReturnType<typeof setTimeout> | undefined;

	const percent = $derived(attempted ? Math.round((correct / attempted) * 100) : 0);
	const timeLimitMs = $derived(settings.timeLimitSec * 1000);
	const remainingMs = $derived(Math.max(0, timeLimitMs - elapsedMs));

	function start() {
		clearTimeout(revealTimer);
		startSweep();
		correct = 0;
		attempted = 0;
		completed = 0;
		tally = {};
		isHighScore = false;
		nextQuestion();
		startTime = Date.now();
		elapsedMs = 0;
		phase = 'running';
		clearInterval(ticker);
		ticker = setInterval(() => {
			elapsedMs = Date.now() - startTime;
			if (settings.timeLimitSec > 0 && elapsedMs >= timeLimitMs) finish();
		}, 250);
	}

	function nextQuestion() {
		wrongKeys = [];
		given = [];
		locked = false;
		wrongAnswers = [];
		reveal = null;
		current = newQuestion();
		step = firstStep();
		options = optionsFor(current.index, current.note.accidental);
		plays = playsFor(current);
		pad?.reset();
	}

	// Which step follows this one. With accidentals on, the letter is followed by
	// its sign. On the bass the position is asked before the finger — the
	// position is what tells you where the finger goes.
	function stepAfter(from: StepId): StepId | null {
		if (from === 'note' && settings.accidentals) return 'accidental';
		if (practice) return from === 'play' ? null : 'play';
		if (boardMode) {
			if (from === 'note' || from === 'accidental') return 'spot';
			// On the bass a spot is a place, not a finger: the position the hand is
			// in says which finger lands there. Without the position question the
			// finger is asked instead.
			if (from === 'spot' && !options.every(isOpen))
				return asksPosition(settings) ? 'position' : def.usesPositions ? 'finger' : null;
			return null;
		}
		if (from === 'note' || from === 'accidental')
			return settings.askString ? 'string' : fingeringStep();
		if (from === 'string') return fingeringStep();
		// Answering "open" at the position step has already named the whole
		// fingering, so there is no finger left to ask for.
		if (from === 'position') return options.every(isOpen) ? null : 'finger';
		return null;
	}

	// The first of the position/finger pair still to ask. The bass skips straight
	// to the finger when every fingering left is an open string, which has no
	// position.
	function fingeringStep(): StepId | null {
		if (!settings.askFinger) return null;
		return asksPosition(settings) && !options.every(isOpen) ? 'position' : 'finger';
	}

	function advance() {
		const next = stepAfter(step);
		if (next === null) {
			completeQuestion();
			return;
		}
		step = next;
		wrongKeys = [];
		locked = false;
	}

	// A question is finished (right, or wrong under single-attempt): tally it and
	// either move on or end the run.
	function completeQuestion() {
		recordNote();
		// A note the student stumbled over on the way through the range comes back
		// once the sweep is done — whichever part of it they got wrong.
		if (wrongAnswers.length && sweeping)
			missed = [...missed, { index: current.index, accidental: written, clef: current.clef }];
		completed += 1;
		if (settings.questionLimit > 0 && completed >= settings.questionLimit) {
			finish();
		} else {
			nextQuestion();
		}
	}

	// Add the question just finished to the note's running record. The same slip
	// made twice is one line in the report with a count, not two lines.
	function recordNote() {
		const key = `${current.clef}:${current.index}:${written ?? ''}`;
		const note = (tally[key] ??= {
			index: current.index,
			accidental: written,
			clef: current.clef,
			asked: 0,
			wrong: 0,
			misses: []
		});
		note.asked += 1;
		if (!wrongAnswers.length) return;
		note.wrong += 1;
		for (const m of wrongAnswers) {
			const same = note.misses.find(
				(x) => x.step === m.step && x.gave === m.gave && x.want === m.want
			);
			if (same) same.times += 1;
			else note.misses.push({ ...m, times: 1 });
		}
	}

	// The buttons for the step being asked.
	const choices = $derived.by((): { key: string; label: string }[] => {
		// Played and tapped answers are given on a drawing, not buttons.
		if (step === 'play' || step === 'spot') return [];
		if (step === 'note') return LETTERS.map((l) => ({ key: l, label: chipLabel(l) }));
		if (step === 'accidental')
			return ALL_ACCIDENTALS.map((a) => ({
				key: a,
				label: `${ACCIDENTAL_SYMBOLS[a]} ${ACCIDENTAL_NAMES[a]}`
			}));
		if (step === 'string')
			return def.strings.map((s, i) => ({
				key: String(i),
				label: `${s.replace(/\d+$/, '')} string`
			}));
		// Only the fingers the teacher put on the menu, low to high.
		if (step === 'finger')
			return FINGER_SETS[instrument]
				.filter((id) => settings.fingers.includes(id))
				.map((id) => ({ key: id, label: FINGERS[id].label }));
		// Without the string step the note may still turn out to be an open one,
		// which is an answer in its own right rather than a position.
		const positions = settings.bassPositions.map((p) => ({
			key: p,
			label: positionLabel(p, settings.positionSystem)
		}));
		return options.some(isOpen) ? [{ key: 'open', label: 'Open' }, ...positions] : positions;
	});

	// The sign asked for is what the note comes out as, key signature included:
	// F in D major is sharp whether or not a sharp is written in front of it.
	const sounding = $derived(soundingAccidental(keySig, current.note.letter, written));

	function isRight(key: string): boolean {
		if (step === 'note') return key === current.note.letter;
		if (step === 'accidental') return key === sounding;
		if (step === 'string') return options.some((o) => o.string === Number(key));
		if (step === 'finger') return options.some((o) => o.finger === key);
		if (step === 'spot') return options.some((o) => spotOf(instrument, o) === key);
		if (key === 'open') return options.some(isOpen);
		return options.some((o) => o.position === key);
	}

	// Keep only the fingerings that agree with the answer just given.
	function narrow(key: string) {
		if (step === 'string') options = options.filter((o) => o.string === Number(key));
		else if (step === 'finger') options = options.filter((o) => o.finger === key);
		else if (step === 'spot') options = options.filter((o) => spotOf(instrument, o) === key);
		else if (step === 'position')
			options = key === 'open' ? options.filter(isOpen) : options.filter((o) => o.position === key);
	}

	function chipLabel(key: string, asked: StepId = step): string {
		// With accidentals on the sign is asked on its own, so the letter stays bare.
		if (asked === 'note') return settings.accidentals ? key : noteLabel(keySig, key);
		if (asked === 'play') return playedLabel(key);
		if (asked === 'spot') return spotLabel(key);
		if (asked === 'accidental') return ACCIDENTAL_NAMES[key as Accidental];
		if (asked === 'string') return `${def.strings[Number(key)].replace(/\d+$/, '')} string`;
		if (asked === 'finger') return key === 'open' ? 'Open' : `Finger ${FINGERS[key].label}`;
		return key === 'open' ? 'Open' : positionName(key as PositionId, settings.positionSystem);
	}

	/**
	 * The answer that would have been right, worded exactly as the student's own
	 * answer is, so the report reads as one against the other. Where a note can be
	 * played several ways this is the fingering a teacher would have written in —
	 * the same one the reveal shows.
	 */
	function rightLabel(asked: StepId, from: Fingering[]): string {
		// A miss on the letter ends the question before the sign is asked, so the
		// right answer is given in full: "B♭", not "B".
		if (asked === 'note') return noteLabel(keySig, current.note.letter, written);
		if (asked === 'accidental') return chipLabel(sounding, asked);
		if (asked === 'play') return playedLabel(plays[0] ?? '');
		const f = preferredFingering(from);
		if (!f) return '';
		if (asked === 'string') return chipLabel(String(f.string), asked);
		if (asked === 'spot') return chipLabel(spotOf(instrument, f), asked);
		if (asked === 'finger') return chipLabel(f.finger, asked);
		return chipLabel(f.position ?? 'open', asked);
	}

	/** A fingerboard spot in words: "A string, low 2nd finger". */
	function spotLabel(id: string): string {
		const [string, where] = id.split(':');
		const name = `${stringName(instrument, Number(string))} string`;
		if (where === 'open' || where === '0') return `${name}, open`;
		if (FINGERS[where] && !def.usesPositions) return `${name}, ${FINGERS[where].name}`;
		return `${name}, ${where} half step${where === '1' ? '' : 's'} up`;
	}

	/** A fingering in words: "valves 1 and 2", "6th position", "the B♭4 key". */
	function playedLabel(answer: string): string {
		if (!practice?.instrument || practice.controls === 'bars') return `the ${keyName(answer)} key`;
		return describeBandFingering(practice.instrument, answer);
	}

	function keyName(answer: string): string {
		const p = Number(answer);
		// The note being asked keeps its own spelling: B♭, not A♯.
		if (p === pitchInKey(current.index, keySig, written))
			return `${noteLabel(keySig, current.note.letter, written)}${current.note.octave}`;
		return pitchName(p);
	}

	const playPrompt = $derived(practice ? CONTROLS[practice.controls].prompt : '');

	const promptText = $derived(
		step === 'play'
			? playPrompt
			: step === 'spot'
				? 'Tap where your finger goes'
				: step === 'note'
					? 'Name this note'
					: step === 'accidental'
						? 'Sharp, natural, or flat?'
						: step === 'string'
							? 'Which string?'
							: step === 'finger'
								? 'Which finger?'
								: 'Which position?'
	);

	// After a wrong answer `options` holds just the fingering a teacher would
	// have written in, so it doubles as the answer key for the reveal.
	const revealText = $derived.by(() => {
		if (step === 'note') return `It was ${noteLabel(keySig, current.note.letter, written)}`;
		if (step === 'play') return reveal ? `It was ${playedLabel(reveal.want)}` : '';
		if (step === 'spot') return reveal ? `It was the ${spotLabel(reveal.want)}` : '';
		if (step === 'accidental')
			return `It was ${current.note.letter}${ACCIDENTAL_SYMBOLS[sounding]}`;
		const f = options[0];
		if (!f) return '';
		if (step === 'string') return `It was the ${def.strings[f.string].replace(/\d+$/, '')} string`;
		if (step === 'finger')
			return isOpen(f) ? 'It was an open string' : `It was the ${FINGERS[f.finger].name}`;
		if (f.position)
			return `It was ${positionName(f.position, settings.positionSystem).toLowerCase()}`;
		return isOpen(f) ? 'It was an open string' : '';
	});

	function choose(key: string) {
		if (locked || phase !== 'running') return;
		attempted += 1;

		if (isRight(key)) {
			correct += 1;
			narrow(key);
			given = [...given, { step, label: chipLabel(key), ok: true }];
			locked = true;
			revealTimer = setTimeout(advance, CORRECT_MS);
			return;
		}

		// One wrong answer ends the question. Everything after it hangs on the part
		// they missed — the finger only means something once the position is right
		// — so the answer is revealed and the next note comes up instead.
		given = [...given, { step, label: chipLabel(key), ok: false }];
		wrongKeys = [...wrongKeys, key];
		wrongAnswers = [
			...wrongAnswers,
			{ step, gave: chipLabel(key), want: rightLabel(step, options) }
		];
		// The reveal reads off the fingering a teacher would have written in.
		if (step !== 'note') {
			const pref = preferredFingering(options);
			if (pref) options = [pref];
		}
		locked = true;
		revealTimer = setTimeout(completeQuestion, REVEAL_MS);
	}

	// Playing the note: right moves on as any step does; wrong shows the right
	// fingering on the drawing and waits for Next.
	function playNote(answer: string) {
		if (locked || phase !== 'running' || step !== 'play') return;
		attempted += 1;
		const label = playedLabel(answer);
		if (plays.includes(answer)) {
			correct += 1;
			given = [...given, { step, label, ok: true }];
			locked = true;
			revealTimer = setTimeout(advance, CORRECT_MS);
			return;
		}
		given = [...given, { step, label, ok: false }];
		wrongKeys = [answer];
		wrongAnswers = [
			...wrongAnswers,
			{
				step,
				gave: label,
				want: rightLabel(step, options),
				played: { gave: answer, want: plays[0] ?? '' }
			}
		];
		reveal = { gave: answer, want: plays[0] ?? '' };
		locked = true;
	}

	// Tapping a spot on the fingerboard. A wrong one stays on the drawing, with
	// the spot a teacher would have written in, until the student moves on.
	function pickSpot(key: string) {
		if (locked || phase !== 'running' || step !== 'spot') return;
		attempted += 1;
		const label = spotLabel(key);
		if (isRight(key)) {
			correct += 1;
			narrow(key);
			given = [...given, { step, label, ok: true }];
			locked = true;
			revealTimer = setTimeout(advance, CORRECT_MS);
			return;
		}
		const pref = preferredFingering(options);
		const want = pref ? spotOf(instrument, pref) : '';
		given = [...given, { step, label, ok: false }];
		wrongKeys = [key];
		wrongAnswers = [
			...wrongAnswers,
			{ step, gave: label, want: rightLabel(step, options), played: { gave: key, want } }
		];
		if (pref) options = [pref];
		reveal = { gave: key, want };
		locked = true;
	}

	function next() {
		if (reveal && phase === 'running') completeQuestion();
	}

	// Space or Enter moves on from a wrong fingering, so a student playing from
	// the keyboard never has to reach for the mouse.
	function nextKey(event: KeyboardEvent) {
		if (!reveal || (event.key !== ' ' && event.key !== 'Enter')) return;
		const el = event.target as HTMLElement | null;
		if (el?.closest('button, input, textarea')) return;
		event.preventDefault();
		next();
	}

	function finish() {
		clearInterval(ticker);
		clearTimeout(revealTimer);
		elapsedMs = Date.now() - startTime;
		locked = true;
		phase = 'done';
		recordHighScore();
	}

	// --- the report at the end ---

	// The steps in the order they are asked, so a note's wrong answers read in
	// the order the student met them.
	const ORDERED_STEPS: StepId[] = [
		'note',
		'accidental',
		'string',
		'spot',
		'position',
		'finger',
		'play'
	];

	/**
	 * The notes that went wrong, the ones missed most often first. This is the
	 * part a teacher reads: not how much a student is struggling, but with what.
	 */
	const report = $derived(
		Object.entries(tally)
			.map(([key, note]) => ({
				key,
				...note,
				// Read back in the order the student met them.
				misses: [...note.misses].sort(
					(a, b) => ORDERED_STEPS.indexOf(a.step) - ORDERED_STEPS.indexOf(b.step)
				)
			}))
			.filter((note) => note.wrong > 0)
			.sort((a, b) => b.wrong - a.wrong || a.index - b.index)
	);

	/**
	 * The missed note as it was read on the staff, sign and all. A picture is
	 * what the student has to recognise — 'A4' is a name for it they have not
	 * learnt yet.
	 */
	function reportNote(note: NoteTally): Note {
		return noteAt(note.index, [], note.accidental);
	}

	function recordHighScore() {
		const pct = attempted ? correct / attempted : 0;
		// A band student's best is their own instrument's.
		const key =
			'noteid:hs:' + settingsToQuery(settings) + (bandInstrument ? `#${bandInstrument}` : '');
		try {
			const prev = Number(localStorage.getItem(key));
			if (!Number.isFinite(prev) || pct > prev) {
				isHighScore = true;
				localStorage.setItem(key, String(pct));
			}
		} catch {
			isHighScore = false;
		}
	}

	// --- saving the results as a PDF ---
	//
	// The student types their name, then the browser's own print window opens,
	// where "Save as PDF" is one of the choices. The page's print styles hide
	// everything but the results.
	let saveDialog = $state<HTMLDialogElement>();
	let studentName = $state('');
	let finishedAt = $state(new Date());

	function openSaveDialog() {
		finishedAt = new Date();
		saveDialog?.showModal();
	}

	async function savePdf(event: SubmitEvent) {
		event.preventDefault();
		saveDialog?.close();
		// Wait for the name to appear on the page before it is printed.
		await tick();
		// Browsers suggest the page title as the file name.
		const pageTitle = document.title;
		document.title = `${studentName.trim()} - ${title} - ${finishedAt.toLocaleDateString()}`;
		window.print();
		document.title = pageTitle;
	}

	// --- score display ---
	//
	// Some students find a running score stressful, so they can hide it. It is
	// theirs to choose and is remembered on their device; the saved PDF still
	// carries the score for the teacher.
	const SHOW_SCORE_KEY = 'noteid:showscore';
	let showScore = $state(true);
	onMount(() => {
		try {
			showScore = localStorage.getItem(SHOW_SCORE_KEY) !== '0';
		} catch {
			showScore = true;
		}
	});
	function toggleScore() {
		showScore = !showScore;
		try {
			localStorage.setItem(SHOW_SCORE_KEY, showScore ? '1' : '0');
		} catch {
			// Still hidden for this run; just not remembered.
		}
	}

	onDestroy(() => {
		clearInterval(ticker);
		clearTimeout(revealTimer);
	});

	function formatTime(ms: number): string {
		const total = Math.round(ms / 1000);
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}
</script>

<svelte:window onkeydown={nextKey} />

<!-- The staff, or for a piano reading both clefs the grand staff, with the
     note on whichever of the two it belongs to. -->
{#snippet reading()}
	{#if practice && practice.staves.length > 1}
		<div class="grand">
			{#each practice.staves as st (st.clef)}
				<Staff
					clef={st.clef}
					{keySig}
					helpers={settings.helpers}
					helperLow={st.low}
					helperHigh={st.high}
					note={st.clef === current.clef ? current.note : null}
				/>
			{/each}
		</div>
	{:else}
		<Staff
			clef={current.clef}
			{keySig}
			helpers={settings.helpers}
			helperLow={practice ? practice.staves[0].low : lowIndex}
			helperHigh={practice ? practice.staves[0].high : highIndex}
			note={current.note}
		/>
	{/if}
{/snippet}

<div class="exercise">
	{#if phase === 'ready'}
		<div class="gate">
			{#if settings.title}
				<p class="assignment">{settings.title}</p>
			{/if}
			<h2>Ready to start</h2>
			<p class="gate-sub">
				{#if settings.questionLimit > 0 && settings.timeLimitSec > 0}
					{settings.questionLimit} questions or {formatDuration(settings.timeLimitSec)}, whichever
					comes first.
				{:else if settings.questionLimit > 0}
					{settings.questionLimit} question{settings.questionLimit === 1 ? '' : 's'}.
				{:else}
					{formatDuration(settings.timeLimitSec)}.
				{/if}
			</p>
			<div class="staff-wrap muted">
				{@render reading()}
			</div>
			<label class="score-choice">
				<input type="checkbox" checked={showScore} onchange={toggleScore} /> Show my score
			</label>
			<button type="button" class="btn-primary big" onclick={start}>Start Challenge</button>
		</div>
	{:else if phase === 'running'}
		<div class="statusbar">
			<div class="score">
				{#if showScore}
					<strong>{correct}/{attempted}</strong>
					<span class="pct">{percent}%</span>
				{/if}
				<button type="button" class="score-toggle" onclick={toggleScore}>
					{showScore ? 'Hide score' : 'Show score'}
				</button>
			</div>
			<div class="progress">
				{#if settings.questionLimit > 0}
					<span
						>Question {Math.min(completed + 1, settings.questionLimit)} of {settings.questionLimit}</span
					>
				{/if}
				{#if settings.timeLimitSec > 0}
					<span class="clock">{formatTime(remainingMs)}</span>
				{/if}
			</div>
		</div>

		<div class="staff-wrap">
			{@render reading()}
		</div>

		{#if given.length}
			<!-- Answers already given for this note, kept on screen as the
			     question builds up its full fingering. -->
			<ol class="given">
				{#each given as g, i (i)}
					<li class="answered" class:bad={!g.ok}>{g.label}</li>
				{/each}
			</ol>
		{/if}

		<!-- Right and wrong are told the same way: a verdict the student can read
		     from across the room, and — when they missed it — the answer under it. -->
		<div class="prompt">
			{#if locked && wrongKeys.length}
				<p class="bad verdict">Not quite</p>
				<p class="bad">{revealText}</p>
			{:else if locked}
				<p class="good verdict">Correct!</p>
			{:else}
				<p>{promptText}</p>
			{/if}
		</div>

		{#if step === 'spot'}
			<Fingerboard
				instrument={settings.instrument}
				{spots}
				struck={reveal?.gave ?? null}
				want={reveal?.want ?? null}
				onpick={reveal || locked ? undefined : pickSpot}
			/>
			{#if reveal}
				<button type="button" class="btn-primary next" onclick={next}>
					Next <span class="enter">Space</span>
				</button>
			{/if}
		{/if}

		{#if step === 'play' && practice}
			<PlayPad
				bind:this={pad}
				controls={practice.controls}
				instrument={practice.instrument}
				{span}
				{reveal}
				{locked}
				onplay={playNote}
			/>
			{#if reveal}
				<button type="button" class="btn-primary next" onclick={next}>
					Next <span class="enter">Space</span>
				</button>
			{/if}
		{/if}

		<div class="letters" class:wide={step !== 'note'}>
			{#each choices as c (c.key)}
				<button
					type="button"
					class="letter"
					class:right={locked && isRight(c.key)}
					class:wrong={wrongKeys.includes(c.key)}
					disabled={locked || wrongKeys.includes(c.key)}
					onclick={() => choose(c.key)}
				>
					{c.label}
				</button>
			{/each}
		</div>

		{#if !challenge}
			<div class="practice-actions">
				<button type="button" class="btn-ghost" onclick={start}>Restart</button>
			</div>
		{/if}
	{:else}
		<div class="results print-area">
			<!-- Only on the saved PDF: who did it, what it was, and when. -->
			<div class="print-only">
				<p class="print-name">{studentName.trim()}</p>
				{#if settings.title}
					<p class="print-assignment">{settings.title}</p>
				{/if}
				<p>{title}</p>
				<p>{finishedAt.toLocaleString()}</p>
				<p>Finished: {completed} note{completed === 1 ? '' : 's'} in {formatTime(elapsedMs)}</p>
				{#if settings.title}
					<p>Assignment goal met ✓</p>
				{/if}
				<!-- The teacher sees the score even when the student hid it. -->
				{#if !showScore}
					<p>Score: {correct}/{attempted} ({percent}% correct)</p>
				{/if}
			</div>
			<!-- Reaching the results means the challenge's limit was reached, which
			     for an assignment is its goal. -->
			{#if settings.title}
				<p class="goal no-print">✓ {settings.title} — goal met</p>
			{/if}
			{#if showScore}
				<h2 class:high={isHighScore}>{isHighScore ? 'New High Score!' : 'Challenge complete'}</h2>
				<p class="bigscore">{correct}/{attempted}</p>
				<p class="detail">{percent}% correct · {formatTime(elapsedMs)}</p>
			{:else}
				<h2>All done!</h2>
				<p class="detail no-print">
					You played {completed} note{completed === 1 ? '' : 's'} in {formatTime(elapsedMs)}.
				</p>
			{/if}

			<!-- With the score hidden, the notes to work on are the feedback. -->
			{#if settings.detailedReport || !showScore}
				<!-- What the student struggled with, note by note, for the teacher to
				     read over their shoulder at the end. -->
				<section class="report">
					<h3>{showScore ? 'Notes missed' : 'Notes to practise'}</h3>
					{#if report.length}
						<ul class="misses">
							{#each report as note (note.key)}
								<li>
									<!-- The note itself, drawn as it was asked. -->
									<div class="missed-staff">
										<Staff clef={note.clef} {keySig} note={reportNote(note)} />
									</div>
									<div class="missed-body">
										<p class="count">Missed {note.wrong} of {note.asked}</p>
										<ul class="diffs">
											{#each note.misses as m, i (i)}
												{#if m.played && practice}
													<!-- A fingering is shown as fingerings, side by side. -->
													<li class="played">
														<figure>
															<figcaption class="gave">
																<span class="mark">✗</span> You played
															</figcaption>
															<FingeringPicture
																controls={practice.controls}
																instrument={practice.instrument}
																fingering={m.played.gave}
																{span}
															/>
														</figure>
														<figure>
															<figcaption class="want">
																<span class="mark">✓</span> It was
															</figcaption>
															<FingeringPicture
																controls={practice.controls}
																instrument={practice.instrument}
																fingering={m.played.want}
																{span}
																right
															/>
														</figure>
														{#if m.times > 1}
															<span class="times">×{m.times}</span>
														{/if}
													</li>
												{:else if m.played && m.step === 'spot'}
													<li class="played">
														<figure>
															<figcaption class="gave">
																<span class="mark">✗</span> You tapped
															</figcaption>
															<Fingerboard
																instrument={settings.instrument}
																{spots}
																struck={m.played.gave}
																small
															/>
														</figure>
														<figure>
															<figcaption class="want">
																<span class="mark">✓</span> It was
															</figcaption>
															<Fingerboard
																instrument={settings.instrument}
																{spots}
																want={m.played.want}
																small
															/>
														</figure>
														{#if m.times > 1}
															<span class="times">×{m.times}</span>
														{/if}
													</li>
												{:else}
													<li>
														<span class="gave"><span class="mark">✗</span> You said {m.gave}</span>
														{#if m.want}
															<span class="want"><span class="mark">✓</span> It was {m.want}</span>
														{/if}
														{#if m.times > 1}
															<span class="times">×{m.times}</span>
														{/if}
													</li>
												{/if}
											{/each}
										</ul>
									</div>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="clean">Nothing missed — every answer was right.</p>
					{/if}
				</section>
			{/if}

			<div class="result-actions no-print">
				<button type="button" class="btn-primary" onclick={start}>Start Challenge</button>
				<button type="button" class="btn-ghost" onclick={openSaveDialog}>Save as PDF</button>
			</div>
		</div>

		<dialog bind:this={saveDialog} class="save-dialog no-print" aria-labelledby="save-title">
			<form onsubmit={savePdf}>
				<h3 id="save-title">Save your results</h3>
				<label>
					Your name
					<!-- svelte-ignore a11y_autofocus -->
					<input type="text" bind:value={studentName} required autocomplete="name" autofocus />
				</label>
				<p class="hint">
					Your browser's print window will open. Choose “Save as PDF” to keep a copy you can share
					with your teacher.
				</p>
				<div class="dialog-actions">
					<button type="button" class="btn-ghost" onclick={() => saveDialog?.close()}>
						Cancel
					</button>
					<button type="submit" class="btn-primary" disabled={!studentName.trim()}>
						Save as PDF
					</button>
				</div>
			</form>
		</dialog>
	{/if}
</div>

<style>
	.exercise {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 32rem;
		margin: 0 auto;
	}
	.staff-wrap {
		background: #fff;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.75rem 1rem;
	}
	.muted {
		opacity: 0.85;
	}
	/* The two staves of a grand staff sit close, as on a piano part. */
	.grand :global(.staff + .staff) {
		margin-top: -18%;
	}
	.goal {
		margin: 0;
		font-weight: 700;
		color: #15803d;
	}
	.assignment {
		margin: 0 0 0.25rem;
		font-weight: 700;
		color: var(--blue-dark);
	}
	.score-choice {
		display: inline-flex;
		gap: 0.4rem;
		align-items: center;
		font-weight: 600;
		cursor: pointer;
	}
	.score-toggle {
		margin-left: 0.6rem;
		padding: 0.15rem 0.5rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: #fff;
		font-size: 0.75rem;
		color: #555;
		cursor: pointer;
	}
	.score-toggle:hover {
		background: var(--card);
	}
	.next {
		align-self: center;
		min-width: 12rem;
		padding: 0.85rem 1.5rem;
		font-size: 1.1rem;
		gap: 0.6rem;
	}
	.next .enter {
		font-size: 0.75rem;
		opacity: 0.75;
	}
	.played {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.75rem 1.25rem;
	}
	.played figure {
		margin: 0;
		min-width: 7rem;
	}
	.played figcaption {
		display: block;
		margin-bottom: 0.2rem;
	}
	.statusbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
	}
	.score strong {
		font-size: 1.15rem;
	}
	.pct {
		color: var(--blue);
		font-weight: 700;
		margin-left: 0.5rem;
	}
	.progress {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		color: #555;
		font-weight: 600;
	}
	.clock {
		font-variant-numeric: tabular-nums;
		background: var(--blue-soft);
		color: var(--blue-dark);
		padding: 0.1rem 0.5rem;
		border-radius: 6px;
	}
	.prompt {
		text-align: center;
		/* Room for the verdict and the answer under it, so the buttons do not shift
		   when they appear. */
		min-height: 3.5rem;
		font-size: 1.05rem;
	}
	.verdict {
		font-size: 1.35rem;
	}
	.good {
		color: #16794a;
		font-weight: 700;
	}
	.bad {
		color: #b3261e;
		font-weight: 700;
	}
	.given {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		justify-content: center;
		list-style: none;
	}
	.answered {
		background: var(--blue-soft);
		border: 1px solid var(--blue-border);
		color: var(--blue-dark);
		border-radius: 999px;
		padding: 0.25rem 0.7rem;
		font-size: 0.85rem;
		font-weight: 700;
	}
	.answered.bad {
		background: #fbdedb;
		border-color: #b3261e;
		color: #842029;
		text-decoration: line-through;
	}
	.letters {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
	}
	/* String, finger and position answers are words rather than single letters. */
	.letters.wide {
		grid-template-columns: repeat(auto-fit, minmax(5.5rem, 1fr));
	}
	.letter {
		padding: 0.9rem 0;
		font-size: 1.15rem;
		font-weight: 600;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: #fff;
		cursor: pointer;
		transition: background 0.1s;
	}
	.letter:hover:not(:disabled) {
		background: var(--blue-soft);
		border-color: var(--blue);
	}
	.letter.right {
		background: #d7f0e2;
		border-color: #16794a;
		color: #0f5132;
	}
	.letter.wrong {
		background: #fbdedb;
		border-color: #b3261e;
		color: #842029;
	}
	button:disabled {
		cursor: default;
	}
	.gate,
	.results {
		text-align: center;
		background: #fff;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.75rem 1.25rem;
	}
	.gate-sub {
		color: #555;
		margin: 0.35rem 0 1rem;
	}
	.gate .staff-wrap {
		margin-bottom: 1.25rem;
	}
	.big {
		font-size: 1.05rem;
		padding: 0.8rem 1.8rem;
	}
	.high {
		color: var(--blue);
	}
	.bigscore {
		font-size: 2.5rem;
		font-weight: 800;
		margin: 0.5rem 0 0.25rem;
	}
	.detail {
		color: #555;
		margin-bottom: 1.25rem;
	}
	/* The report reads as a list of notes rather than more score: quieter than
	   the total above it, and left-aligned so the note names line up. */
	.report {
		text-align: left;
		border-top: 1px solid var(--border);
		padding-top: 1rem;
		margin-bottom: 1.25rem;
	}
	.report h3 {
		font-size: 0.95rem;
		font-weight: 700;
		margin-bottom: 0.6rem;
	}
	.misses {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		list-style: none;
	}
	/* Each miss is the note as a picture, with what went wrong beside it. */
	.misses > li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #fff;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.5rem 0.75rem;
	}
	.missed-staff {
		flex: none;
		/* Wide enough to read the note, never so wide it crowds a phone. */
		width: min(9rem, 40%);
	}
	.missed-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.count {
		color: #b3261e;
		font-weight: 700;
		font-size: 0.85rem;
	}
	.diffs {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		list-style: none;
	}
	/* One slip per line: what was asked, what they said, what it was. */
	.diffs li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem;
		font-size: 0.85rem;
	}
	.gave {
		color: #b3261e;
	}
	.want {
		color: #1b7f4b;
		font-weight: 700;
	}
	/* The tick and cross carry the same meaning as the colours, for anyone who
	   cannot tell the two colours apart. */
	.mark {
		font-weight: 700;
	}
	.times {
		color: #555;
	}
	.clean {
		color: #555;
		font-size: 0.9rem;
	}
	.print-only {
		display: none;
		margin-bottom: 1rem;
		color: #555;
		font-size: 0.9rem;
	}
	.print-name {
		color: #1a1a1a;
		font-size: 1.25rem;
		font-weight: 800;
	}
	@media print {
		.print-only {
			display: block;
		}
		.results {
			border: none;
		}
		/* Keep each missed note whole rather than split across two pages. */
		.misses > li {
			break-inside: avoid;
		}
	}
	.save-dialog {
		margin: auto;
		width: min(24rem, calc(100% - 2rem));
		border: none;
		border-radius: var(--radius);
		padding: 1.5rem;
		box-shadow: 0 10px 40px rgb(0 0 0 / 0.2);
	}
	.save-dialog::backdrop {
		background: rgb(0 0 0 / 0.4);
	}
	.save-dialog h3 {
		font-size: 1.15rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}
	.save-dialog label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-weight: 600;
		font-size: 0.9rem;
	}
	.save-dialog input {
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 400;
	}
	.save-dialog input:focus {
		outline: 2px solid var(--blue);
		border-color: var(--blue);
	}
	.hint {
		color: #555;
		font-size: 0.85rem;
		margin: 0.75rem 0 1.25rem;
	}
	.dialog-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
	.result-actions,
	.practice-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}
</style>
