---
title: "[Bug] EAS Android builds fail in the Install dependencies phase"
labels:
  - bug
  - mobile
  - tech-debt
  - priority-high
---

## Goal

Get a successful EAS Android `development` build so a dev client APK can be
installed on a physical device.

## Why is this useful?

This blocks `003-google-login-device-test.md`. Google login cannot be verified
on a device until we can build and install a dev client. Right now every
Android build fails.

## Current findings

- The last several Android builds all show status `ERRORED`, failing in the
  **Install dependencies** build phase (EAS error: "See logs of the Install
  dependencies build phase for more information").
- `npm ci` runs cleanly **locally** (`up to date`), so the dependency tree
  itself resolves fine on this machine.
- No Node version is pinned anywhere: `package.json` has no `engines` field,
  there is no `.nvmrc`, and `eas.json` has no `node` setting. Local machine runs
  Node v24; EAS falls back to its own default Node.
- Stack is recent: Expo ~55, React Native 0.83, React 19 — needs a modern Node.

Most likely cause: the Node version EAS uses does not match what the stack
needs, so `npm ci` fails on the build server even though it passes locally.
Second possibility: a registry / peer-dependency conflict that only surfaces on
a clean CI install.

### Additional observations (2026-07-08)

- Logs from the old failed builds are **gone** ("Logs do not exist", artifacts
  expired). We cannot post-mortem the old errors — we need a fresh build's logs.
- Old builds sat in queue a very long time before failing (e.g. wait time
  ~51 min) on the free tier. Long queue time is a separate annoyance from the
  actual failure and should not be confused with it.
- A fresh build (`ce37f13`) is currently `IN_QUEUE` and has not started running,
  so no readable logs exist yet. Diagnosis must wait until it actually runs.

Next diagnostic step: let the current queued build run to completion (or
failure) and read its live "Install dependencies" log. Do NOT rely on the old,
expired builds.

## Proposed solution

1. Open the failing build log and read the **Install dependencies** phase to
   confirm the exact error (Node version mismatch vs. npm/peer-dep error).
   Log URL example:
   `https://expo.dev/accounts/rasmus1994/projects/Cityquest/builds/<build-id>`
2. Pin the Node version EAS should use. Options (pick one, keep it consistent):
   - Add `"node": "<version>"` under the relevant profile(s) in `eas.json`, or
   - Add an `engines.node` field to `package.json`, or
   - Add a `.nvmrc`.
   Match the Node version to what Expo 55 / RN 0.83 expects (Node 20 LTS is a
   safe starting point).
3. Re-run `eas build --profile development --platform android` and confirm the
   build reaches `FINISHED` and produces an APK artifact.

## Acceptance criteria

- [ ] Root cause of the Install-dependencies failure is confirmed from the build log.
- [ ] Node version is pinned so local and EAS use the same major version.
- [ ] An Android `development` build completes with status `FINISHED`.
- [ ] The build produces a downloadable APK artifact.
- [ ] The APK installs and opens on a physical Android device.
