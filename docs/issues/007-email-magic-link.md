---
title: "[Feature] Implement email magic link login"
labels:
  - feature
  - auth
  - backend
  - mobile
  - priority-medium
---

## Goal

Replace dev email login with production-ready passwordless email login.

## Why is this useful?

Users should be able to sign in without Google and without creating a password.
The current email flow is only safe for local development.

## Proposed solution

Implement email magic links through a trusted auth provider or a backend-issued
one-time token flow.

## Acceptance criteria

- [ ] User can request a login link or code by email.
- [ ] Backend verifies the email login token before issuing CityQuest tokens.
- [ ] `ALLOW_DEV_EMAIL_AUTH` is not needed for production email login.
- [ ] Returning users keep their existing CityQuest profile.
- [ ] Failed or expired login links are rejected.

