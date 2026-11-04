# 5. Wind and brass fingerings are hand-entered charts, checked by a band teacher

Date: 2026-10-25

## Status

Accepted

## Context

String fingerings are not typed in anywhere: they are worked out from each
instrument's tuning and hand shapes, which is why every valid answer is accepted
and why they reproduce the method books. Wind and brass fingerings cannot be
worked out this way. Which keys play a note on a clarinet or flute is a fact of
the instrument's design, full of exceptions (throat tones, the break, side
keys), and even brass valve combinations have conventional alternates. The same
goes for each instrument's range at each level.

## Decision

Each band instrument has a hand-entered fingering chart — every written note in
its range, with every standard fingering for it, the first-taught one first —
and a hand-entered range per level. The app gets a fingering chart page for each
instrument that draws every note next to its fingerings on the instrument
drawing. A band teacher checks those pages before each phase is released.

## Consequences

- The charts are data, not code, and can be read and corrected by someone who
  knows the instrument rather than the program.
- Accepting alternates (any fingering in the chart is right) only needs the
  chart to list them.
- A key signature does not need special handling: the note's written pitch,
  sharp or flat included, looks up its fingering directly.
- Each phase waits on a teacher's review.
