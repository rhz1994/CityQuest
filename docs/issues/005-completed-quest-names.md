---
title: "[Feature] Show quest names in completed quests"
labels:
  - feature
  - mobile
  - backend
  - ux
  - priority-medium
---

## Goal

Show completed quest names on the Account screen instead of only quest IDs.

## Why is this useful?

Quest IDs are not meaningful to users. Names make completed progress easier to
understand.

## Proposed solution

Update the rewards endpoint to include quest metadata, then render quest names
in `app/(tabs)/account.tsx`.

## Acceptance criteria

- [ ] `GET /rewards/user/:userId` returns quest name or quest summary.
- [ ] Account screen displays readable completed quest titles.
- [ ] Empty state still works when there are no rewards.

