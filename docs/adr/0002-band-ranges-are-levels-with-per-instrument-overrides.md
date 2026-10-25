# 2. Band ranges are levels, with optional per-instrument overrides

Date: 2026-10-25

## Status

Accepted

## Context

A band activity is not tied to one instrument (ADR 0001), so the single
low-note/high-note range used by string activities cannot work: a flute and a
tuba share no notes. Directors already think in stages — the first five notes,
then the rest of the beginner book, then the upper register.

## Decision

The teacher picks a level — Beginner, Intermediate or Advanced — and each
instrument has its own built-in written range for that level. The teacher may
also open any instrument and override its range; instruments without an override
follow the level.

## Consequences

- The app needs a curated range per instrument per level, which a band teacher
  should check.
- The link carries the level plus any overrides, so it grows only when a teacher
  actually customises an instrument.
- The settings page needs a per-instrument range editor that is out of the way
  until it is wanted.
