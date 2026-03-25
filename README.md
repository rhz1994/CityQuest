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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (for MySQL)
- [Expo Go](https://expo.dev/go) on your phone (iOS or Android)

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

Scan the QR code with Expo Go on your phone.

> **Important:** Your phone and computer must be on the same Wi-Fi network. Use `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your LAN IP.

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
| Mobile app | React Native, Expo SDK 53, expo-router, react-native-maps |
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
