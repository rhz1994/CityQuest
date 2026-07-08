---
title: "[Tech debt] Stabilize local checks"
labels:
  - tech-debt
  - backend
  - mobile
  - priority-high
---

## Goal

Make the project start from a clean local quality baseline before adding more
features.

## Why is this useful?

When lint, build, and tests are green, future changes become easier to trust.
Right now backend build passes and mobile lint passes, but backend lint has a
small test-file cleanup left.

## Proposed solution

Fix the remaining backend lint errors, then document the commands that should be
run before committing larger changes.

## Acceptance criteria

- [ ] `backend/src/tests/puzzles.test.ts` has no `prefer-const` lint errors.
- [ ] `cd backend && npm run build` passes.
- [ ] `cd backend && npm run lint` passes.
- [ ] `cd mobile-app && npm run lint` passes.
- [ ] Backend tests are run against a local test database or documented if not
      runnable yet.

