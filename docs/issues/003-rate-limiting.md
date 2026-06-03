---
title: "[Tech debt] Add rate limiting to auth and puzzle solve"
labels:
  - tech-debt
  - security
  - backend
  - priority-high
---

## Problem

The backend does not currently rate limit sensitive endpoints.

## Why it matters

Auth and puzzle solve endpoints can be spammed. This creates security, abuse,
and operational risk.

## Suggested fix

Add rate limiting middleware for auth routes and `POST /puzzles/:puzzleId/solve`.

## Acceptance criteria

- [ ] Auth endpoints have sensible request limits.
- [ ] Puzzle solve endpoint has sensible request limits.
- [ ] Rate limit responses return a clear `429` response.
- [ ] Local development remains easy to test.

