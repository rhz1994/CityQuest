---
title: "[Tech debt] Add database migration workflow"
labels:
  - tech-debt
  - database
  - backend
  - priority-high
---

## Problem

The project relies on `backend/database/init.sql` for schema setup and seed
data. Existing databases need manual reset when schema changes.

## Why it matters

As the app grows, schema changes need to be repeatable and safe without wiping
local or production data.

## Suggested fix

Introduce a simple migration workflow and separate schema changes from seed
data.

## Acceptance criteria

- [ ] Migrations can be run in order.
- [ ] Existing databases can be upgraded without full reseed.
- [ ] Seed data is separated from schema migrations.
- [ ] README explains how to run migrations.

