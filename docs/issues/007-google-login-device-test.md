---
title: "[Bug] Verify Google login on physical device"
labels:
  - bug
  - auth
  - mobile
  - priority-medium
---

## What happened?

Google login needs to be verified on a physical iOS or Android device with the
current Expo auth configuration.

## Expected behavior

The user can sign in with Google, backend verifies the access token, and the app
opens the main tabs.

## Steps to reproduce

1. Set Google OAuth client IDs in `mobile-app/.env`.
2. Start backend and Expo.
3. Open the app on a physical device.
4. Tap "Continue with Google".

## Notes

Record whether this works in Expo Go, development build, or simulator/emulator.

