# Phases 2 and 3: assumptions

Phase 2 adds flute, clarinet and the saxophones; Phase 3 adds oboe, bassoon and
the string fingerboard drawings (see the Phase 1 spec for the plan). Twelve
questions were left open. Rather than wait on them, each was settled with the
answer a middle or high school band director would most likely give. Each one is
recorded here so a teacher can overturn it, and most can be changed in one
place.

Everything else follows the decisions already made in `CONTEXT.md` and
`docs/adr/`: band activities in concert pitch, levels with per-instrument
overrides, any standard fingering accepted, a miss shown on the drawing until
Next, and every chart checked by a band teacher on the fingering chart page.

## Who the assumptions are for

A middle or high school director, not an elementary one. Their students
already own their instrument, use side and palm keys by the second year, and
read most of their range. So the drawings show the real instrument rather than a
cut-down one, and the Advanced level reaches as far as the staff can show.

## Phase 2: flute, clarinet, saxophones

1. **No computer-keyboard shortcuts for woodwinds.** A woodwind fingering holds
   down up to ten keys at once, more than a home-row mapping can give. Students
   click the keys on the drawing; Enter still plays, and Space still moves on
   after a miss.
2. **The whole key diagram is shown at every level.** A middle schooler has to
   find the right key among all of them, and a wrong side key should be possible
   to press. Keys the activity never needs are still drawn.
3. **Beginner is the first five in each instrument's usual first octave**
   (written pitch):

   | Instrument | First five, written |
   | --- | --- |
   | Flute | B♭4–F5 |
   | Clarinet | C4–G4, below the break |
   | Alto and baritone sax | G4–D5 |
   | Tenor sax | C5–G5, the same octave alto students start in |

   The tenor sax octave is the one most worth a teacher's check. C4–G4 is the
   other choice, but it needs the low C pinky key in the first week.
4. **Clarinet Intermediate crosses the break**, reaching up to E5. Crossing the
   break is the defining skill of a second-year clarinettist. Advanced reaches
   into the upper clarion.
5. **The first-taught fingering**, shown when a student misses, is the one most
   middle school method books start with. Every other standard fingering is
   still accepted.
   - **Flute B♭:** the thumb B♭ lever. One-and-one is also accepted.
   - **Clarinet:** B4 is played with the left pinky and C5 with the right
     pinky, the alternating pinkies taught for chromatic passages.
   - **Saxophone B♭:** the bis key. Side B♭ and one-and-one are also accepted.
6. **Left out for now:**
   - trill keys;
   - the baritone sax's low A key;
   - the flute's B footjoint;
   - clarinet and sax altissimo above the staff's third ledger line.

   Fingerings that need these are not asked about.

## Phase 3: oboe, bassoon, strings

7. **Oboe keeps the real mechanism a middle schooler uses.** That means both
   octave keys, the half-hole, and the F keys. Regular F, with the right F key
   that every oboe has, is first-taught. Left F, which student oboes often
   lack, and forked F are also accepted. (This corrects a first draft that
   named the left F key; all four charts consulted teach right F first.)
   Second octave key notes come in at Advanced.
8. **Bassoon reads bass clef only**, with no tenor clef even at Advanced. The
   drawing includes the whisper key and the flick keys. Flicked notes are
   accepted with or without the flick, since many teachers introduce flicking
   later.
9. **The fingerboard shows only the fingers the teacher has switched on** in
   the finger menu. A spot the student is not being taught would only be a trap.
10. **Cello stays in bass clef.** Treble and tenor clef reading is high school
    cello repertoire, past what these levels cover.
11. **String activities stay one instrument per link.** One link for a whole
    orchestra, as band has, would be a natural next step, but a band director
    did not ask for it. This phase only adds the fingerboard drawing.
12. **String activities keep their original seven keys.** E, A♭ and D♭ major
    exist now for band, but they are rare in school string music.

## Ranges

The written range of each level, per instrument, is in the band module next to
its fingering chart, and on the fingering chart page. Every level stays within
three ledger lines of the staff, as the brass levels do.

## Also in this work

- The string answer mode setting (instrument drawing or buttons) from ADR and
  `CONTEXT.md`: new string activities default to the drawing; links made before
  it stay on buttons.
- A tidy-up before the woodwinds go in: what differs between instrument kinds
  (valves, slide, keys, woodwind keys) moves into one place, so a new
  instrument is one entry rather than edits across many files.
