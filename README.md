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
    ├── context/      React contexts (Auth, Location, Language)
    ├── services/     API/auth services
    ├── styles/       Theme & map styles
    └── utilities/    Secure token storage, Haversine distance, helpers
```

## How It Works

1. **Login screen** — signs the player in with Google, or dev email login for local testing
2. **Home screen** — detects your location, shows the nearest city, or lets you pick one
3. **City screen** — lists available quests for that city
4. **Quest screen** — shows a map with clues. Walk to each location in order:
   - A **clue** tells you where to go
   - When you're within 30 meters, a **puzzle** appears
   - The app sends the answer and position to the backend
   - The backend validates the answer, location, clue order, and saves progress
5. **Complete all puzzles** to finish the quest and receive a reward

## Current Auth & Security

- **Google sign-in** is the production-ready auth path currently implemented. The mobile app sends a Google access token to `POST /auth/exchange`, and the backend verifies it with Google before issuing CityQuest access and refresh tokens.
- **Dev email login** exists only for local testing. Enable it with `ALLOW_DEV_EMAIL_AUTH=true` in `backend/.env`. Keep it disabled in production.
- **Apple login** and **email magic link** are planned but not implemented yet.
- Access tokens are short-lived JWTs. Refresh tokens are rotated, stored in the database as hashes, and can be revoked.
- Protected endpoints use `requireAuth`; admin-only content writes use `requireAdmin` and `ADMIN_USER_IDS`.
- Puzzle answers are no longer returned to the mobile app. Solving happens through `POST /puzzles/:puzzleId/solve`.
- The backend checks answer correctness, location distance, clue order, duplicate progress, and reward uniqueness.

## Product Roadmap

- Email magic-link login for production email auth
- Apple login before iOS release if social login is offered
- Admin dashboard for cities, locations, quests, clues, and puzzles
- Content workflow with draft/review/publish status
- Leaderboards, XP, badges, and saved quests
- Rate limiting, audit logging, and stronger anti-cheat signals
- Database migrations instead of relying only on `init.sql`

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
| `backend/` | `cp .env.example .env` | DB credentials, JWT secrets, optional `ADMIN_USER_IDS`, and dev-only flags. |
| `mobile-app/` | `cp .env.example .env` | Set `EXPO_PUBLIC_API_URL` to your LAN IP + port `5000` for a physical device, or `http://127.0.0.1:5000` for simulator/emulator on the same Mac. Add Google OAuth client IDs for Google login. |

After copying, **edit `.env`** if your network, ports, or Docker passwords differ.

Useful development flags:

- `ALLOW_DEV_EMAIL_AUTH=true` lets you test email login locally without passwords.
- `ALLOW_DEV_QUEST_SOLVE=true` lets you test puzzle solving without being physically near the clue location.
- `ADMIN_USER_IDS=1,2` marks local users as admins for content-write endpoints.

Keep these disabled or carefully configured in production.

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

| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| POST | `/auth/exchange` | No | No | Exchange a verified provider login for CityQuest tokens. Google is verified server-side; email is dev-only. |
| POST | `/auth/refresh` | No | No | Rotate refresh token and return a new access/refresh pair. |
| POST | `/auth/logout` | No | No | Revoke one refresh token. |
| POST | `/auth/logout-all` | Yes | No | Revoke all refresh tokens for the current user. |
| GET | `/auth/me` | Yes | No | Current authenticated user. |
| GET | `/cities` | No | No | All cities. |
| GET | `/cities/:cityName` | No | No | City by name. |
| GET | `/cities/id/:id` | No | No | City by ID. |
| POST | `/cities` | Yes | Yes | Create a city. |
| GET | `/quests` | No | No | All quests. |
| GET | `/quests/city/:cityName` | No | No | Quests for a city. |
| GET | `/quests/:questId` | No | No | Quest by ID, including city coordinates. |
| POST | `/quests` | Yes | Yes | Create a quest. |
| GET | `/locations` | No | No | All locations. |
| GET | `/locations/city/:cityId` | No | No | Locations in a city. |
| GET | `/locations/:locationId` | No | No | Location by ID. |
| GET | `/clues` | No | No | All clues. Does not return puzzle answers. |
| GET | `/clues/quest/:questId` | No | No | Clues for a quest, including location and puzzle metadata. Does not return puzzle answers. |
| GET | `/clues/:clueId` | No | No | Clue by ID. |
| GET | `/puzzles` | No | No | All puzzles without answers. |
| GET | `/puzzles/clue/:clueId` | No | No | Puzzles for a clue without answers. |
| GET | `/puzzles/:puzzleId` | No | No | Puzzle by ID without answer. |
| POST | `/puzzles/:puzzleId/solve` | Yes | No | Validate answer, location, clue order, progress, and quest completion. |
| GET | `/users/:name` | Yes | No | User profile by name. Current user or admin only. |
| GET | `/users/id/:id` | Yes | No | User profile by ID. Current user or admin only. |
| POST | `/users` | Yes | Yes | Manually create a user. Normal users are created through auth exchange. |
| PUT | `/users/:id` | Yes | No | Update own user profile. |
| GET | `/userProgress` | Yes | Yes | All user progress. |
| GET | `/userProgress/user/:userId` | Yes | No | Current user's progress. |
| POST | `/userProgress` | Yes | No | Save progress manually. Prefer puzzle solve flow. |
| GET | `/rewards` | Yes | Yes | All rewards. |
| GET | `/rewards/user/:userId` | Yes | No | Current user's rewards. |

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
- **users** — local CityQuest user profiles linked to auth providers
- **userProgress** — tracks which clues a user has completed; unique per user, quest, and clue
- **rewards** — awarded when a user finishes a quest; unique per user and quest
- **refreshTokens** — hashed refresh tokens for backend-issued sessions

If `init.sql` changes after you already created the Docker volume, recreate the local database:

```bash
cd backend
docker compose down -v
docker compose up -d
```

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
