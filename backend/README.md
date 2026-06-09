## Databas

### Setup

1. Start the database: 'docker compose up -d'
2. Run migratiobs: 'npm run migrate'

### Migrations

Migration files live in `database/migrations/`. Each file is named with a number prefix, e.g. `001-initial-schema.sql`.

To add a schema change, create a new file: `002-your-change.sql`. Run `npm run migrate` to apply it. Each file runs exactly once.

### Seed data

Test data lives in 'database/seed.sql'. Run it manually against the database when needed.
