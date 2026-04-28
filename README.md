# City Quest

A mobile treasure-hunt app where players explore real cities by following clues, finding locations, and solving puzzles on-site. Built with **React Native (Expo)** and an **Express + MySQL** backend.

## Project Structure

```
CityQuest/
├── backend/          Express API (TypeScript)
│   ├── database/     SQL init script
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── database.ts   MySQL connection pool
│   ├── docker-compose.yaml
│   └── index.ts      Server entry point
│
└── mobile-app/       Expo / React Native app
    ├── app/          Screens (file-based routing)
    │   ├── (tabs)/   Tab screens (Home, Map, Scoreboard, Account)
    │   ├── city.tsx  Quest list for a city
    │   └── quest.tsx Game screen (map + clues + puzzles)
    ├── components/   Reusable UI (ClueModal, PuzzleModal)
    ├── config/       API URL config
    ├── context/      React context (Location)
    ├── styles/       Theme & map styles
    └── utilities/    Haversine distance, helpers
```

## How It Works

1. **Home screen** — detects your location, shows the nearest city, or lets you pick one
2. **City screen** — lists available quests for that city
3. **Quest screen** — shows a map with clues. Walk to each location in order:
   - A **clue** tells you where to go
   - When you're within 30 meters, a **puzzle** appears
   - Answer correctly to unlock the next clue
4. **Complete all puzzles** to finish the quest

## Product Roadmap (Suggested)

This is a practical roadmap to expand the app while keeping scope realistic for a small team.

### Phase 1 (MVP+) — 4 to 6 weeks

Focus: improve first-session experience and retention basics.

- Guided onboarding (permissions, how the game works, first quest in <2 minutes)
- Stronger core loop UX (clear clue progression, better success/failure feedback)
- Basic progression (XP, levels, badges, streak)
- One additional quest type (for example timed challenge or photo task)
- Lightweight analytics (new users, quest start/completion, drop-off points)

### Phase 2 (Growth) — 6 to 10 weeks

Focus: replayability and social motivation.

- Daily/weekly quests and seasonal events
- Leaderboards by city and friends
- Quest recommendations based on location and previous activity
- Push notifications for streaks, new quests, and event reminders
- Internal content tools for creating/editing quests without code changes

### Phase 3 (Scale) — 2 to 4 months

Focus: operations, creator workflows, and broader content coverage.

- Admin dashboard for moderation, analytics, and live operations
- Creator workflow (draft, review, publish) for UGC or partner-created quests
- Anti-cheat and location-spoofing mitigation
- Caching + API performance improvements for larger user load
- Localization and city expansion playbook

## Authentication Strategy (Recommended)

Short answer: **do not start with Google-only login**.

For a mobile app, the most practical setup is:

- **Email magic link** as the baseline (works for everyone, low support burden)
- **Google sign-in** as an optional convenience provider
- **Apple sign-in** when shipping iOS (recommended and often required in practice if social sign-in is offered)

### Why this is the best trade-off

- Better conversion than forcing password creation
- Lower implementation and maintenance complexity than a custom auth stack
- Future-proof for adding more providers (Facebook, Microsoft, etc.)
- Easier account recovery and fewer "which login did I use?" issues if email is always available

### Suggested implementation path

1. Add user identity model (`users` table + provider mapping)
2. Implement email magic link login flow
3. Add Google sign-in in the mobile app
4. Add Apple sign-in before iOS release
5. Store auth sessions securely (refresh tokens, logout all devices, token rotation)

### Provider options

- **Supabase Auth**: fast to ship, good DX, supports magic link + social providers
- **Firebase Auth**: mature and well-documented for mobile
- **Clerk/Auth0**: strong managed features, but can be more complex/costly at scale

If you prefer your current Express backend to remain the source of truth, use one provider above only for identity, then issue your own backend session/JWT after successful provider authentication.

### Technical implementation blueprint (CityQuest)

This blueprint is adapted to the current backend schema (`users`, `userProgress`, `rewards`) and route structure.

#### Recommended provider decision

Pick **Supabase Auth** first for fastest time-to-value:

- Native support for magic links + Google + Apple
- Good Expo/React Native support
- Easy to keep Express + MySQL as the game data source of truth

#### Database changes (MySQL)

Keep `users` as the local profile table, but add identity linkage and session metadata.

Suggested migration:

- Add `authProvider` (`email`, `google`, `apple`)
- Add `authProviderUserId` (provider subject ID, unique)
- Add `emailVerifiedAt` (nullable datetime)
- Add `lastLoginAt` (nullable datetime)

Optional but recommended:

- Add `refreshTokens` table for backend-issued sessions (hashed token, device info, expiry, revokedAt)

This lets one user log in safely across multiple devices and supports "logout all devices".

#### Backend API additions (Express)

Add a dedicated `auth` route group:

- `POST /auth/exchange`  
  Accept provider token/session proof from mobile app, verify it, then create/update local `users` row and return backend access + refresh tokens.
- `POST /auth/refresh`  
  Rotate refresh token and return a new short-lived access token.
- `POST /auth/logout`  
  Revoke current refresh token.
- `POST /auth/logout-all`  
  Revoke all active refresh tokens for that user.
- `GET /auth/me`  
  Return current authenticated user profile (from access token).

Keep existing `/users` routes for profile operations, but require auth for user-specific updates.

#### Auth middleware and security baseline

- Verify backend JWT in middleware for protected endpoints (`userProgress`, `rewards`, profile edits)
- Do not trust `userId` from request body when token exists; derive from token subject
- Store refresh tokens hashed in DB (never plaintext)
- Use short access token TTL (for example 15 minutes) and longer refresh TTL (for example 30 days)
- Rotate refresh tokens on each refresh request

#### Mobile app (Expo) flow

Suggested folder additions in `mobile-app/`:

- `services/authService.ts` (provider sign-in + backend token exchange)
- `context/AuthContext.tsx` (session state, sign-in/out, bootstrap)
- `utilities/secureStorage.ts` (token persistence via SecureStore)
- `app/(auth)/` (login and callback screens)

User flow:

1. User taps "Continue with email" or "Continue with Google"
2. Provider auth succeeds in app
3. App calls `POST /auth/exchange`
4. Backend returns app tokens + local profile
5. App stores tokens securely and hydrates `AuthContext`
6. Protected screens use token-authenticated API calls

#### Rollout plan (safe and incremental)

1. Add DB migration + new auth endpoints
2. Implement email magic-link login only
3. Protect write endpoints (`userProgress`, `rewards`, `users/:id`)
4. Add Google login in app
5. Add Apple login before iOS release
6. Remove legacy anonymous flows (if any) after data migration

#### Minimal environment variables

Backend:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TTL`
- `JWT_REFRESH_TTL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (if needed for verification strategy)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to mobile app)

Mobile (`EXPO_PUBLIC_*` only):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_URL`

#### Definition of done for auth v1

- New user can sign in via magic link and reaches app home
- Returning user stays signed in after app restart
- Access token expiry is handled automatically via refresh
- User can sign out and is blocked from protected endpoints
- Backend no longer accepts arbitrary `userId` writes without auth

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19.4+, 22.13.0+, 24.3.0+, or 25+ (Expo SDK 55)
- [Docker](https://www.docker.com/) (for MySQL)
- [Expo](https://expo.dev) account (free) if you use **EAS** for development builds
- Optional: [Expo Go](https://expo.dev/go) for quick tries when its SDK matches the project

### Environment files (`.env`)

There are **no real `.env` files in the repo** on purpose: they are listed in `.gitignore` so secrets and machine-specific values are not committed. You create them locally from the checked-in templates:

| Location | Command | What to set |
|----------|---------|-------------|
| `backend/` | `cp .env.example .env` | DB credentials must match `backend/docker-compose.yaml` (defaults are in `.env.example`). |
| `mobile-app/` | `cp .env.example .env` | Set `EXPO_PUBLIC_API_URL` to your LAN IP + port `5000` for a physical device, or `http://127.0.0.1:5000` for simulator/emulator on the same Mac. |

After copying, **edit `.env`** if your network, ports, or Docker passwords differ.

### 1. Start the database

```bash
cd backend
docker compose up -d
```

This starts MySQL on port 3306 and runs `database/init.sql` to create tables and seed data.

### 2. Start the backend

```bash
cd backend
cp .env.example .env    # edit if needed
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 3. Start the mobile app

```bash
cd mobile-app
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your computer's LAN IP, e.g.:
# EXPO_PUBLIC_API_URL=http://192.168.1.42:5000
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone (only works when the **Expo Go app SDK** matches this project).

> **Important:** Your phone and computer must be on the same Wi-Fi network. Use `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your LAN IP.

> **Expo Go:** Store builds sometimes lag the newest SDK. Prefer a **development build** (below) or the iOS Simulator / Android emulator for day-to-day work.

### 4. Development build (recommended)

A development build is your own “Expo Go” with this app’s native code baked in. After the **first** cloud or local compile, day-to-day work is fast: start Metro with `--dev-client` and open the dev app on the device or simulator.

**One-time — link the app to your Expo account** (from `mobile-app`):

```bash
cd mobile-app
npx eas-cli@latest login
npx eas-cli@latest init
```

**One-time — install the dev client** (pick a platform; repeat if you need both):

```bash
cd mobile-app
npx eas-cli@latest build --profile development --platform ios
# or
npx eas-cli@latest build --profile development --platform android
```

When the build finishes, follow the Expo dashboard link to install the app on a **physical device** (internal distribution).

**iOS Simulator only (no TestFlight/device signing via EAS):**

```bash
cd mobile-app
npx eas-cli@latest build --profile development-simulator --platform ios
```

Install the resulting app into the simulator from the build artifact page, or skip EAS and run locally:

```bash
cd mobile-app
npx expo run:ios
```

**Every day — start the bundler for the dev client:**

```bash
cd mobile-app
npm run start:dev
```

Then open the **Cityquest** dev app (not Expo Go). It loads JavaScript from Metro the same way Expo Go would.

**Local-only alternative (no EAS):** with Xcode / Android Studio set up, `npx expo run:ios` or `npx expo run:android` compiles and installs the dev client once; then use `npm run start:dev` as above.

See Expo’s [development builds introduction](https://docs.expo.dev/develop/development-builds/introduction/) for credentials, Apple Developer Program requirements on physical iPhones, and troubleshooting.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cities` | All cities |
| GET | `/cities/:cityName` | City by name |
| GET | `/cities/id/:id` | City by ID |
| POST | `/cities` | Create a city |
| GET | `/quests` | All quests |
| GET | `/quests/city/:cityName` | Quests for a city |
| GET | `/quests/:questId` | Quest by ID (includes city coords) |
| POST | `/quests` | Create a quest |
| GET | `/clues/quest/:questId` | Clues for a quest (with location + puzzle data) |
| GET | `/locations/city/:cityId` | Locations in a city |
| GET | `/puzzles/clue/:clueId` | Puzzles for a clue |
| GET | `/users/:name` | User profile |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| GET | `/userProgress/user/:userId` | User's progress |
| POST | `/userProgress` | Save progress |
| GET | `/rewards/user/:userId` | User's rewards |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile app | React Native, Expo SDK 55, expo-router, react-native-maps |
| Backend | Express 5, TypeScript, mysql2 |
| Database | MySQL 8 (Docker) |
| Styling | Custom antique/gold theme |

## Database Schema

- **cities** — city name, coordinates, image
- **locations** — physical places within a city (coordinates, description)
- **quests** — a quest belongs to a city
- **clues** — ordered steps in a quest, each linked to a location
- **puzzles** — trivia questions attached to clues
- **users** — player accounts
- **userProgress** — tracks which clues a user has completed
- **rewards** — awarded when a user finishes a quest

## Story Guide (Historical Quest Design)

Use this guide when writing or revising quest stories so the content is consistently educational, vivid, and playable.
Target tone: **historical thriller** (symbol hunting, hidden motives, coded clues, real places, real history).

### Core principle

Each quest must have **one central mystery** that the player can explain in one sentence after finishing.

The player feeling should be:

- "I am chasing a hidden historical truth."
- "Each place reveals a layer of a larger code."
- "The final reveal changes how I understand the city."

Examples:

- "How did Gothenburg transform from fortress city to modern cultural city?"
- "How did science, religion, and political power overlap in medieval Prague?"
- "How did Roman public spaces shape propaganda and identity from antiquity to today?"

### Required structure per quest

1. **Central mystery**  
   Define one historical question, conflict, or unresolved narrative tension.

2. **4 clue arc (beginning -> escalation -> reveal -> synthesis)**  
   - Clue 1: Introduce context and stakes  
   - Clue 2: Raise complexity (power, conflict, economy, religion, etc.)  
   - Clue 3: Reveal contradiction or turning point  
   - Clue 4: Resolve mystery with a modern takeaway

3. **One real place per clue**  
   Every clue must anchor to a real, verifiable location in the city.

4. **One puzzle per clue**  
   Puzzle answer should validate a factual insight (date, person, institution, event, concept).

5. **Thriller progression (mandatory)**
   - Step 1: Discovery (anomaly, symbol, hidden message)
   - Step 2: Pursuit (new evidence increases stakes)
   - Step 3: Confrontation (contradiction or uncomfortable truth)
   - Step 4: Revelation (historical synthesis + why it matters today)

### Historical quality checklist

Before shipping a quest, verify:

- Facts are historically plausible and tied to named people/eras/events.
- Places are real and relevant to the specific historical claim.
- Timeline is coherent (no impossible chronology).
- At least one source link is included for every puzzle or clue context.
- The mystery teaches a broader pattern (not only isolated trivia).

### Writing style rules

- Write in active voice and present tense.
- Keep clue text atmospheric but precise ("why this place matters").
- Avoid generic lines ("go to X and find Y"); connect action to context.
- Keep puzzle wording short and specific; one unambiguous answer.
- Prefer concrete nouns: years, names, institutions, streets, monuments.
- Open clues with a narrative hook (letter, code, seal, inscription, missing document, witness quote).
- End each clue with a purpose ("what insight this location unlocks").
- Balance drama and accuracy: dramatic framing is good, invented facts are not.
- Never claim conspiracies as facts; frame uncertainty explicitly ("suggests", "indicates", "debated").

### Reference policy (links)

Include direct references in puzzle descriptions or clue context using stable public sources:

- Museum and archive pages
- Official city history pages
- Encyclopedic summaries (Wikipedia can be a starting point, not the only source)
- If available, include one primary-source-style reference (archive, original inscription, museum collection text)

Recommended format:

`Historisk referens: https://example.com/page`

### Implementation notes for this project

- Quest story metadata currently lives in `backend/database/init.sql`:
  - `quests.questShortDescription` (quest mystery hook)
  - `clues.clueDescription` (narrative progression)
  - `puzzles.puzzleDescription` (historical fact-check + references)
- If you reseed the database, run:

```bash
cd backend
docker compose down -v
docker compose up -d
```

### Definition of done for a new quest

A quest is complete when:

- The central mystery is explicit and memorable.
- All 4 clues are tied to real locations and advance the same mystery.
- Every puzzle teaches one factual historical insight.
- Historical references are included and readable in the quest content.
- The final clue gives a clear synthesis ("what the player learned").
- The player experiences a clear thriller arc: **code -> chase -> conflict -> reveal**.
