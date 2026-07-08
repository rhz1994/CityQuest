---
title: "[Feature] Add Apple login support"
labels:
  - feature
  - auth
  - mobile
  - backend
  - priority-medium
---

## Goal

Add Apple sign-in support for iOS users.

## Why is this useful?

Apple sign-in is recommended, and often expected, when an iOS app offers other
social login methods.

## Proposed solution

Add Apple auth in the Expo app and verify Apple identity tokens server-side in
`POST /auth/exchange`.

## Acceptance criteria

- [ ] User can sign in with Apple on iOS.
- [ ] Backend verifies the Apple identity token.
- [ ] Local CityQuest user is created or updated.
- [ ] Access and refresh tokens are returned after verification.

