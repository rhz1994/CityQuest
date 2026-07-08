---
title: "[Security] Add rate limiting to sensitive endpoints"
labels:
  - tech-debt
  - security
  - backend
  - priority-high
---

## Goal

Protect auth and puzzle-solving endpoints from spam and repeated guessing.

## Why is this useful?

Auth endpoints and puzzle solve endpoints are sensitive. Without rate limiting,
users or bots can repeatedly hit login and answer-submission routes.

## Proposed solution

Add Express rate limiting middleware with stricter limits for auth and puzzle
solve routes.

## Acceptance criteria

- [ ] Auth endpoints have sensible request limits.
- [ ] `POST /puzzles/:puzzleId/solve` has sensible request limits.
- [ ] Rate limit responses return a clear `429` response.
- [ ] Local development remains easy to test.
- [ ] Limits can be configured through environment variables if needed.

