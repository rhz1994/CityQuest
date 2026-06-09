-- ─────────────────────────────────────────────────────────────────────────────
-- Cities
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  cityId    INT AUTO_INCREMENT PRIMARY KEY,
  cityName  VARCHAR(100) NOT NULL,
  latitude  DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  cityImage VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Locations  (physical places in a city)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS locations (
  locationId          INT AUTO_INCREMENT PRIMARY KEY,
  cityId              INT NOT NULL,
  locationName        VARCHAR(100) NOT NULL,
  locationDescription TEXT,
  locationImage       VARCHAR(255),
  latitude            DECIMAL(10, 7) NOT NULL,
  longitude           DECIMAL(10, 7) NOT NULL,
  FOREIGN KEY (cityId) REFERENCES cities(cityId) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Quests
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quests (
  questId              INT AUTO_INCREMENT PRIMARY KEY,
  cityId               INT NOT NULL,
  questName            VARCHAR(100) NOT NULL,
  questShortDescription TEXT,
  questIntroImage      VARCHAR(255),
  FOREIGN KEY (cityId) REFERENCES cities(cityId) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Clues  (one per step of a quest — links to a location to find)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clues (
  clueId          INT AUTO_INCREMENT PRIMARY KEY,
  questId         INT NOT NULL,
  locationId      INT NOT NULL,
  clueDescription TEXT,
  clueOrder       INT NOT NULL DEFAULT 1,
  FOREIGN KEY (questId)    REFERENCES quests(questId)    ON DELETE CASCADE,
  FOREIGN KEY (locationId) REFERENCES locations(locationId) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Puzzles  (optional trivia question attached to a clue)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS puzzles (
  puzzleId          INT AUTO_INCREMENT PRIMARY KEY,
  clueId            INT NOT NULL,
  puzzleName        VARCHAR(100),
  puzzleDescription TEXT,
  puzzleAnswer      VARCHAR(255),
  FOREIGN KEY (clueId) REFERENCES clues(clueId) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Users
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  userId              INT AUTO_INCREMENT PRIMARY KEY,
  userName            VARCHAR(100) NOT NULL UNIQUE,
  userEmail           VARCHAR(255) NOT NULL UNIQUE,
  authProvider        ENUM('email', 'google', 'apple') NOT NULL DEFAULT 'email',
  authProviderUserId  VARCHAR(255) NOT NULL UNIQUE,
  emailVerifiedAt     DATETIME NULL,
  lastLoginAt         DATETIME NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- UserProgress  (tracks which clues a user has completed)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS userProgress (
  progressId  INT AUTO_INCREMENT PRIMARY KEY,
  userId      INT NOT NULL,
  questId     INT NOT NULL,
  clueId      INT NOT NULL,
  completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY user_progress_unique_step (userId, questId, clueId),
  FOREIGN KEY (userId)  REFERENCES users(userId)   ON DELETE CASCADE,
  FOREIGN KEY (questId) REFERENCES quests(questId) ON DELETE CASCADE,
  FOREIGN KEY (clueId)  REFERENCES clues(clueId)   ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Rewards  (awarded when a user finishes a quest)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rewards (
  rewardId   INT AUTO_INCREMENT PRIMARY KEY,
  userId     INT NOT NULL,
  questId    INT NOT NULL,
  rewardName VARCHAR(100) NOT NULL,
  awardedAt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY rewards_unique_quest (userId, questId),
  FOREIGN KEY (userId)  REFERENCES users(userId)   ON DELETE CASCADE,
  FOREIGN KEY (questId) REFERENCES quests(questId) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RefreshTokens (for rotating backend sessions)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refreshTokens (
  tokenId      INT AUTO_INCREMENT PRIMARY KEY,
  userId       INT NOT NULL,
  tokenHash    VARCHAR(64) NOT NULL UNIQUE,
  expiresAt    DATETIME NOT NULL,
  revokedAt    DATETIME NULL,
  createdAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS migrations (
    migrationId INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(64) NOT NULL UNIQUE,
    appliedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
