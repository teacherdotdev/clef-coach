# Phase 1 spec: band brass, mallets and piano

The first of the three phases agreed in the design interview (see `CONTEXT.md`
and `docs/adr/`). Phase 2 adds flute, clarinet and saxophones; Phase 3 adds oboe,
bassoon and the string fingerboard drawings.

## Problem Statement

Clef Coach only knows the four orchestral string instruments. Band directors —
especially elementary band, where students most need engaging practice — have no
way to use it: their students play transposing wind instruments, they think in
concert pitch, and one class holds a dozen different instruments. Directors have
also asked to hand practice out as homework, and some students find a running
score stressful.

## Solution

A teacher can now make three kinds of activity: the existing **string
activity**, a **band activity** and a **piano activity**.

A band activity is set in a **concert key** and a **level**. Each student opens
the same link and picks their instrument — trumpet, horn, trombone, baritone
(bass clef or treble clef), tuba or bells — and the app shows them notes in their
own written key and range. For each note they name it (unless they play bells),
then play it on a drawing of their instrument: press the valves (or move the
slide, or strike the bar) and press **Play**. A miss shows the right fingering on
the drawing until they tap **Next**.

A piano activity shows notes in treble clef, bass clef or both on a grand staff,
and the student clicks the key on a drawn keyboard.

Any activity can be given an assignment title and saved by the student as a PDF
to hand in, and students can hide their score.

## User Stories

1. As a band director, I want to make one link for my whole band, so that I don't have to make a link per section.
2. As a band director, I want to choose the key in concert pitch, so that I never have to transpose for each instrument myself.
3. As a band director, I want to choose Beginner, Intermediate or Advanced, so that the notes match where my students are in the book.
4. As a band director, I want Beginner to be the "first five" notes (concert B♭ to F) on every instrument, so that it matches the first page of every method book.
5. As a band director, I want to adjust one instrument's range without affecting the others, so that I can stretch my strong trumpets without overwhelming the tubas.
6. As a band director, I want to untick instruments, so that I can make a brass-sectional link or a link for just one section.
7. As a band director, I want a link with only one instrument ticked to skip the picker, so that a section-specific link opens straight into practice.
8. As a band director, I want to choose whether students also name the note, so that I can focus on fingerings alone when that is the lesson.
9. As a band director, I want accidentals, lines/spaces, note values, helpers, challenge limits and the detailed report to work as they do for strings, so that I don't have to learn a second set of settings.
10. As a band director, I want to preview the activity as any instrument, so that I can see what each section will get before I share it.
11. As a band student, I want to pick my instrument from pictures, so that I can find it even if I'm unsure of its name.
12. As a band student, I want the app to remember my instrument on this device, so that I don't have to pick it every time.
13. As a band student, I want to change my instrument, so that I can fix a wrong pick or practise a second instrument.
14. As a band student, I want to see notes in my own written key and clef, so that the staff looks like my music.
15. As a trumpet, baritone or tuba student, I want to press valve buttons on a picture of my valves, so that answering feels like playing.
16. As a brass student on a computer, I want to hold J, K and L for valves 1, 2 and 3 (on horn, played left-handed: F, D and S, with Space for the trigger) and press Enter to play, so that it feels like pressing real valves.
17. As a horn student, I want a thumb trigger as well as three valves, so that I can answer with either side of my double horn.
18. As a trombone student, I want to move the slide to a numbered position (or press 1–7), so that I answer in positions as I play.
19. As a bells student, I want to click the bar on a picture of my bells, so that I find the note where it really is.
20. As a student, I want any standard fingering to count, so that I am not marked wrong for a legitimate alternate.
21. As a student who missed a note, I want the right fingering shown on my instrument — what should be down in green, what I pressed by mistake in red — so that I can see exactly what to fix.
22. As a student who missed a note, I want the answer to stay up until I tap Next, so that I have time to study it.
23. As a student, I want to hide my score, so that practice doesn't feel like a test.
24. As a student with my score hidden, I want the end screen to tell me how many notes I played and which to practise, so that I still know how I did.
25. As a teacher, I want the saved PDF to show the score even if the student hid it, so that I can still see how they did.
26. As a teacher, I want to give an activity an assignment title, so that students and their PDFs say which homework it is.
27. As a student, I want the PDF to show the assignment title, my name, the date and my results, so that I can hand it in as homework.
28. As a piano teacher, I want a piano activity in treble, bass or both clefs, so that students practise reading both hands' notes.
29. As a piano student, I want to click the key on a drawn keyboard, so that I connect the note on the staff to its place on the piano.
30. As a piano teacher, I want piano to use the same levels and keys, so that setup works the same way.
31. As a piano teacher, I want to choose whether students also name the note, so that I can add naming practice when I want it.
32. As a band teacher reviewing the app, I want a fingering chart page for each instrument showing every note next to its fingerings, so that I can check them before students use them.
33. As a string teacher, I want my existing links to keep working exactly as they do, so that my classes are not disrupted.
34. As a band director, I want the activity's key choice to list only the seven band keys, so that I am not offered keys my students won't meet.
35. As a band director, I want my activity saved and named like string activities are, so that I can reuse it next year.
36. As a band director, I want to share a band activity by QR code, so that students on tablets can open it quickly.

## Implementation Decisions

- **Activity type** is a new setting with three values: strings, band and piano.
  A link with no type is a string activity, so every existing link and saved
  activity is unchanged.
- **Written keys** grow from seven to ten: A♭, D♭ and E major are added, and the
  key-signature placement tables cover up to five flats and four sharps in every
  clef. The string key picker still offers its original seven keys.
- **A new band module** describes each band instrument: its display name, clef,
  how far its written key sits above concert pitch, the kind of drawing it is
  answered on (valves, horn, slide or bars), its written range per level, and its
  fingering chart. It answers: the written key for a concert key; an instrument's
  range given the level and any override; and the fingerings for a written pitch
  (an empty list means unplayable).
- **Fingering charts** are written as data, one written note per line with every
  standard fingering, the first-taught first (ADR 0005). The baritone in bass
  clef and the tuba use the trumpet's chart moved down to their sounding octaves,
  since all three are three-valve B♭ instruments; the treble-clef baritone uses
  the trumpet's chart as written. The horn's chart lists the F side first and the
  B♭ side (thumb trigger) as alternates.
- **A fingering answer** is a short canonical text: valves pressed in ascending
  order with the trigger first ("T12"), "0" for none pressed; a slide position
  number; or, for keyboards, the pitch of the key. Order of pressing never
  matters. An answer is right when it is in the note's chart entry.
- **Bells** are a band instrument whose written key matches concert pitch, read
  in treble clef, answered on a row of bars like a keyboard; naming is skipped
  for them, since striking the bar names it.
- **A small piano module** gives piano's per-level range for treble and bass
  clef. A piano activity's key is its written key; it may use any of the ten.
- **Settings** gain: activity type, concert key, level, the ticked band
  instruments, per-instrument range overrides, whether to ask for the note name,
  the piano clef choice, and the assignment title. Each goes into the shareable
  link and is validated on the way back in exactly like the existing fields, so a
  stale or hand-edited link can only fall back to defaults.
- **The exercise** works from a resolved "what this student reads" — clef or
  clefs, written key, range and answering instrument — so the same question loop
  serves strings, band and piano. String questions are unchanged. Band and piano
  questions are: name the note (optional), name the sign (if accidentals are on
  and naming is asked), then play.
- **Drawings** are interactive SVG components — valve caps, horn levers with
  trigger, a trombone slide, and a keyboard/bar row — drawn in code in the style
  of the static instrument illustrations shown beside them. The same components
  draw a fingering read-only, small, for the report and the PDF.
- **The miss reveal** on the play step waits for Next (button or Space) instead of
  the timed reveal; the timed reveal stays for the naming steps.
- **Score display** is the student's choice, kept on their device, on by
  default. With it off, the running score and percentage are hidden and the end
  screen counts notes played and lists notes to practise. The printed PDF always
  includes the score.
- **The band picker** remembers the student's choice on the device and is skipped
  when only one instrument is ticked.
- **The fingering chart page** lists every valve and slide instrument (bells
  are answered by the bar itself, so have nothing to check); for each it shows
  every note its chart covers on the staff next to its fingerings drawn small.

## Testing Decisions

- The project has no tests yet. Bun's built-in test runner is used; the only
  addition is its type definitions, as a development dependency.
- Tests check behaviour through the highest seams, the pure modules, never
  component internals:
  - **Band module:** written key for every concert key and transposition; every
    level range is inside the chart; Beginner is concert B♭–F transposed on every
    instrument; known fingerings (trumpet first five, horn first five, trombone
    positions, alternates accepted); unplayable notes return nothing.
  - **Settings link:** round-trips for band and piano activities; an old string
    link reads back exactly as before; junk values fall back to defaults.
  - **Key signatures:** every written key has the right letters altered and a
    placement for each accidental in every clef.
- Components are checked by running the app and driving it in a browser.

## Out of Scope

- Flute, clarinet, saxophones (Phase 2); oboe, bassoon and the string
  fingerboard drawings with the drawing/buttons setting (Phase 3).
- 4-valve tuba and euphonium, the trombone F trigger, and piano finger numbers.
- Sound, a mascot, streaks, celebration animations.
- Accounts, class rosters and a teacher dashboard.
- Range overrides for piano (piano uses the level ranges only).

## Further Notes

- The level ranges and fingering charts are a first draft from standard school
  charts, and a band teacher should check them on the fingering chart page before
  this goes live. The values most worth checking are listed in the report at the
  end of the build.
- Cello in treble clef, raised in the meeting notes, is not part of this phase.
