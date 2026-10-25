# 1. Band activities are set in concert pitch, and students pick their instrument

Date: 2026-10-25

## Status

Accepted

## Context

Until now an activity was tied to one string instrument: the link fixed the
instrument, its clef and its key. A band room is different. Flutes, clarinets,
trumpets, saxes and horns practise together, and most of them are transposing
instruments, so "the first five notes" are different written notes on each
(concert B♭–F is C–G on clarinet, G–D on alto sax, F–C on horn). Directors think
and speak in concert pitch, and asked for the app to handle the transposing.

## Decision

A band activity is set up in concert pitch — a concert key and a level — and is
not tied to an instrument. When a student opens the link they choose their
instrument, and the app works out that instrument's written key and notes.

Existing string links keep working exactly as they do now, with the instrument
already chosen.

## Consequences

- One link serves the whole band; the teacher never transposes by hand.
- The range can no longer be a single pair of notes chosen by the teacher, since
  a flute and a tuba share no notes. How range is chosen per instrument has to be
  settled separately.
- Every wind instrument needs its transposition recorded alongside its
  fingerings.
