# 4. Homework is a link and a saved PDF, with no accounts

Date: 2026-10-25

## Status

Accepted

## Context

A band director asked to assign homework. The app has no accounts and no
server-side storage: nothing leaves the student's browser, and the privacy page
promises that. A class dashboard would need teacher and student accounts, a
database of children's results, and the privacy obligations (COPPA, FERPA) that
come with holding them.

## Decision

The shared link is the assignment. The teacher can give an activity an
assignment title, and its existing challenge limits — a number of notes or a
practice time — are the goal. The student's end screen says when the goal is
met, and the saved PDF shows the title, the student's name, the date, whether
the goal was met and the score, for the student to hand in however the class
already hands work in.

## Consequences

- No accounts, no server, and the privacy page stays true.
- The teacher collects PDFs rather than seeing a dashboard, and has to trust the
  PDF (the existing signed verification code helps here).
- A real dashboard can still be added later; nothing here prevents it.
