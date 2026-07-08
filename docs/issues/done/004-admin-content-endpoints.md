---
title: "[Feature] Build admin endpoints for locations, clues, and puzzles"
labels:
  - feature
  - backend
  - content
  - priority-high
---

## Goal

Allow admins to create core quest content without editing the database manually.

## Why is this useful?

New quests require cities, locations, clues, and puzzles. Cities and quests
already have create endpoints, but locations, clues, and puzzles still need
admin create routes.

## Proposed solution

Add admin-protected create endpoints for locations, clues, and puzzles.

## Acceptance criteria

- [ ] `POST /locations` creates a location and requires admin.
- [ ] `POST /clues` creates a clue and requires admin.
- [ ] `POST /puzzles` creates a puzzle and requires admin.
- [ ] Request bodies are validated.
- [ ] Non-admin users receive `403`.
- [ ] Created records return their new IDs.

