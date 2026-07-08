# CityQuest Project Overview

This document is the planning entry point for CityQuest. Use it to understand
what already exists, what is planned next, and how to create future issues
without duplicating existing documentation.

## Product Vision

CityQuest is a mobile real-world treasure hunt app. Players explore real cities,
follow historical clues, find physical locations, solve puzzles on-site, and
complete quests to earn rewards.

The intended experience is a historical thriller: the player follows a central
mystery through real places, with each clue revealing another layer of the city.

## Documentation Map

- `README.md` is the main technical and product reference. It explains the app,
  setup, API endpoints, database schema, auth/security, and quest story guide.
- `docs/PROJECT_OVERVIEW.md` is the high-level planning and AI handoff file.
  It should summarize status and direction, not repeat every API or setup detail.
- `docs/issues/README.md` explains issue ordering, labels, and project-board
  conventions.
- `docs/issues/*.md` are draft GitHub issues.
- `backend/README.md` is a short database/migration reference.
- `mobile-app/README.md` is still mostly the default Expo README and is not the
  source of truth for the app.

When updating docs, avoid copying the same long sections into multiple files.
Prefer linking or pointing to the source of truth above.

## Current Working Features

- Expo mobile app with file-based routing.
- Express and MySQL backend.
- Cities, quests, locations, clues, puzzles, users, progress, rewards, and
  refresh token tables.
- Google login flow in the mobile app.
- Backend Google token verification through `POST /auth/exchange`.
- Dev-only email login gated by `ALLOW_DEV_EMAIL_AUTH`.
- Rotating backend access and refresh tokens.
- Protected endpoints through `requireAuth`.
- Admin-only write protection through `requireAdmin` and `ADMIN_USER_IDS`.
- City selection and nearest-city lookup from user location.
- Quest screen with map, current clue marker, clue modal, puzzle modal, and
  distance-based solving.
- Backend puzzle solve validation for answer correctness, user location, clue
  order, duplicate progress, and quest completion.
- Rewards are awarded when all clues in a quest are complete.
- Account screen can display completed quest names from rewards.
- Database migration script and initial schema migration.
- Backend integration tests exist for the puzzle solve service.

## Completed Issues

Use this section as memory for work that has already been handled or removed
from the active backlog. Future issues should not recreate these unless the
requirements change.

- Database migration workflow: migrations exist, the initial schema migration is
  present, and `backend/README.md` explains the migration flow.
- Completed quest names: rewards returned for a user include quest metadata, and
  the Account screen can show readable completed quest names.
- Backend puzzle solve tests: integration tests exist for wrong answers, correct
  answers, clue order, duplicate solves, reward creation, and far-away location
  rejection.
- Local checks baseline: the user reported that everything appears to work.
  Treat this as done unless a future command shows failing build, lint, or test
  output.

## Known Placeholders And Gaps

- Rate limiting is not implemented yet.
- Google login still needs physical-device verification.
- Apple login is not implemented.
- Production email magic-link login is not implemented.
- Admin create endpoints exist for cities and quests, but not yet for locations,
  clues, and puzzles.
- Admin dashboard is not implemented.
- Scoreboard is still placeholder UI.
- Saved quests are still placeholder UI.
- First polished real-world quest content still needs to be created and tested.
- Mobile app README is generic Expo starter documentation.

## Current Priority Order

Follow the issue order in `docs/issues/README.md`.

Current recommended sequence:

1. Stabilize local checks.
2. Add rate limiting.
3. Verify Google login on a physical device.
4. Add admin content endpoints.
5. Create the first complete real-world quest.
6. Build a simple admin dashboard.
7. Add production email magic-link login.
8. Add Apple login.
9. Add leaderboard data and UI.
10. Add saved quests.
11. Finish product and technical documentation.

## AI Planning Rules

The user currently wants AI to help with planning, documentation, and issue
creation, not code implementation.

When an AI assistant works on this project in planning mode:

- Do not write or modify application code unless the user explicitly asks for
  code changes.
- It is OK to edit documentation and issue files when requested.
- Read `README.md`, this file, and `docs/issues/README.md` before creating new
  issues.
- Check existing `docs/issues/*.md` before adding a new issue.
- Remove or update issues that are already completed by the current codebase.
- Keep issues small enough to finish and verify.
- Put issues in a clear order instead of only listing ideas.
- Prefer acceptance criteria that can be checked manually or with commands.
- Do not duplicate long setup, API, or schema details from `README.md`.

## Issue Creation Guide

Use this structure for future issues:

```md
---
title: "[Type] Short actionable title"
labels:
  - feature
  - backend
  - priority-medium
---

## Goal

One clear outcome.

## Why is this useful?

Why this matters for the product, security, content workflow, or user
experience.

## Proposed solution

Short suggested approach without over-specifying implementation.

## Acceptance criteria

- [ ] Observable condition one.
- [ ] Observable condition two.
- [ ] Tests, docs, or manual verification are covered when relevant.
```

Recommended types:

- `[Feature]`
- `[Security]`
- `[Tech debt]`
- `[Bug]`
- `[QA]`
- `[Content]`
- `[Docs]`

Recommended priorities:

- `priority-high`: blocks safety, real testing, content creation, or MVP launch.
- `priority-medium`: important but not blocking the next development step.
- `priority-low`: useful later, but not needed for the next milestone.

## Next Milestone

The next practical milestone is a safer, testable MVP foundation:

- Local checks are green.
- Sensitive endpoints have rate limiting.
- Google login has been verified on a real device.
- Admins can create locations, clues, and puzzles through API endpoints.
- One real quest can be played end-to-end on a physical device.
