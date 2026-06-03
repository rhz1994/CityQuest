---
title: "[Tech debt] Add backend integration tests for puzzle solve"
labels:
  - tech-debt
  - backend
  - security
  - priority-high
---

## Problem

Puzzle solve now contains important business and security logic but has no
automated tests.

## Why it matters

Regressions could expose puzzle answers, skip clue order, duplicate progress,
or incorrectly award rewards.

## Suggested fix

Add backend integration tests for the solve flow.

## Acceptance criteria

- [ ] Wrong answer does not save progress.
- [ ] Correct answer saves progress.
- [ ] Later clues cannot be solved before earlier clues.
- [ ] Duplicate solve does not duplicate progress.
- [ ] Completing all clues creates one reward.
- [ ] Location check rejects far-away solves when dev bypass is disabled.

