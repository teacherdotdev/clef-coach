# Clef Coach — Glossary

The words we use for this app's ideas, so code, docs and conversations mean the
same thing by them. Add a term when a decision gives it a fixed meaning.

## Activity

The practice exercise a teacher sets up and shares as a link. Everything about
it lives in the link's settings; nothing is stored on a server.

## Band activity

An activity for a whole band at once. The teacher chooses it in **concert
pitch**; each student picks their own instrument when they open the link, and
the app transposes the activity into that instrument's **written pitch**. One
link serves the whole class. See [ADR 0001](docs/adr/0001-band-activities-are-set-in-concert-pitch.md).

## Concert pitch

The pitch a note actually sounds. A band director names keys this way: "Concert
B♭" is the same sound on every instrument, even though each one reads it
differently.

## Written pitch

The note printed on the student's part, and the note the student reads, names
and fingers. For a non-transposing instrument (flute, oboe, trombone, piano) it
is the concert pitch.

## Transposing instrument

An instrument whose written pitch differs from its concert pitch: B♭
instruments (clarinet, trumpet, tenor sax) read a whole step above concert, E♭
instruments (alto and baritone sax) a major sixth above, F horn a fifth above.

## Level

How far into an instrument's range an activity reaches: **Beginner**,
**Intermediate** or **Advanced**. Each instrument has its own written range for
each level, built into the app. Beginner is the "first five" notes — concert
B♭, C, D, E♭, F, transposed for the instrument. The key signature applies on top
of the level's range.

## Range override

A teacher's adjustment to one instrument's range in a band activity, replacing
the level's range for that instrument only. Instruments without an override use
the level.

## Question and steps

A **question** is one note on the staff. It may take several **steps**, asked
one at a time: name the letter, name the sharp or flat, then give the
fingering. The teacher can switch steps off. On piano and mallets the click on
the keyboard is the answer, so naming is off by default there.

## Fingering

How a note is played. On a string instrument it is a string, a finger and — on
the bass — a position. On a wind or brass instrument it is the **set of keys or
valves held down** (or, on trombone, a slide position); the order they were
pressed in does not matter. On piano and mallets it is the key or bar struck.

## Instrument drawing

The clickable picture of an instrument that the student answers on. Clicking a
key or valve presses or releases it; **Play** submits what is held down. Brass
can also be played from the computer keyboard: hold J K L for valves 1 2 3 (the
horn, played left-handed, uses F D S and Space for the thumb trigger) and press
Enter to play. Piano keys and bells are played the moment they are clicked. The string instruments keep their button answers as an alternative to
their drawings.

## Instrument choices

What a student can pick in a band activity. Some instruments appear more than
once because they are read differently: **Baritone (bass clef)** at concert
pitch and **Baritone T.C.**, read in treble clef as a B♭ instrument like the
trumpet. Alto, tenor and baritone sax share one set of fingerings but transpose
differently. The **horn** is a double horn: three valves plus the thumb trigger
for the B♭ side, with both sides' fingerings accepted. Tuba and euphonium have
three valves and the trombone has no F trigger, for now.

## Score display

Whether the student sees their running score and percentage. It is the
**student's** choice, made on the start screen and changeable in the top bar,
and on by default. With it off the end screen counts what was practised and
lists the notes to work on, without grading. The saved PDF report always has the
full score for the teacher.

## Concert key

The key of a band activity, named by its concert pitch: B♭, E♭, F, A♭, C, D♭ or
G. Each instrument reads it as its own **written key** — concert B♭ is C major
on clarinet and G major on alto sax. See [ADR 0003](docs/adr/0003-band-concert-keys.md).

## Answer mode

Whether a string activity is answered on the **instrument drawing** or with
**buttons** (the original string/finger buttons). The teacher sets it on the
activity; the student cannot change it. New string activities default to the
drawing; links made before drawings existed stay on buttons. Band instruments
are always answered on their drawings.

## Fingerboard

The string instruments' drawing: a close-up of the four strings with a tappable
spot for each finger, like finger tapes, including low and high spots (L2, H2)
and the cello's extensions. One tap answers string and finger together. On the
bass the same spot can be different fingers in different positions, so the
student names the position as a separate step after tapping.

## Assignment

An activity given as homework: a link with an **assignment title**, whose
challenge limits (a number of notes or a practice time) are the **goal**. The
student hands in the saved PDF. There are no accounts. See
[ADR 0004](docs/adr/0004-homework-without-accounts.md).

## Look and feel

The student view keeps its current look. The instrument drawings are the only
visual addition; there is no mascot, streak counter or celebration animation.

## Activity type

What an activity is for, which decides who picks the instrument:

- **String activity** — one string instrument, fixed by the teacher. Links made
  before band activities existed are all string activities.
- **Band activity** — a concert key and level; each student picks a band
  instrument (including mallets) on opening the link.
- **Piano activity** — piano alone. The teacher picks treble clef, bass clef or
  both; with both, notes appear on a grand staff in either clef. The student
  clicks the key on a drawn keyboard sized to the level.

## Sound

There is none. Pressing Play checks the answer silently; sound may come later
as something the student turns on.

The drawing shows the whole instrument small, so it is recognisable, with the
part that is played drawn large beside it: the trumpet's valve caps seen from
the player's side, the trombone's slide, a woodwind's holes and keys laid out
where they really are but enlarged to tap.

## Miss

A wrong answer. On a drawing, the right fingering is shown on the instrument —
keys that should be down in green, keys pressed by mistake in red — and stays
until the student taps **Next** (or presses Space). The detailed report and the
PDF show each miss as two small drawings, "You played" and "It was".

## Picker

Where a student opening a band activity chooses their instrument. The teacher
decides which instruments it offers — all of them by default; unticking some
makes a sectional link. With only one instrument offered, the picker is skipped.
