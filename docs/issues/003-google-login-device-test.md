---
title: "[QA] Verify Google login on a physical device"
labels:
  - bug
  - auth
  - mobile
  - priority-high
---

## Goal

Confirm that the current Google login flow works on a real iOS or Android
device.

## Why is this useful?

Google login is the current production-ready auth path. Before adding more auth
providers, the existing path should be verified outside the simulator.

## Steps to test

1. Set Google OAuth client IDs in `mobile-app/.env`.
2. Start the backend.
3. Start the Expo app or development client.
4. Open the app on a physical device.
5. Tap "Continue with Google".

## Acceptance criteria

- [ ] User can complete Google sign-in on a physical device.
- [ ] Backend verifies the Google access token.
- [ ] CityQuest access and refresh tokens are stored.
- [ ] App opens the main tabs after login.
- [ ] Result is documented for Expo Go, development build, or both.

