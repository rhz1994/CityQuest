CREATE DATABASE IF NOT EXISTS cityquest;
USE cityquest;

-- ─────────────────────────────────────────────────────────────────────────────
-- Drop tables in reverse FK order
-- ─────────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS userProgress;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS puzzles;
DROP TABLE IF EXISTS clues;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS quests;
DROP TABLE IF EXISTS cities;

-- ─────────────────────────────────────────────────────────────────────────────
-- Cities
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE cities (
  cityId    INT AUTO_INCREMENT PRIMARY KEY,
  cityName  VARCHAR(100) NOT NULL,
  latitude  DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  cityImage VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Locations  (physical places in a city)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE locations (
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
CREATE TABLE quests (
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
CREATE TABLE clues (
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
CREATE TABLE puzzles (
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
CREATE TABLE users (
  userId    INT AUTO_INCREMENT PRIMARY KEY,
  userName  VARCHAR(100) NOT NULL UNIQUE,
  userEmail VARCHAR(255) NOT NULL UNIQUE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- UserProgress  (tracks which clues a user has completed)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE userProgress (
  progressId  INT AUTO_INCREMENT PRIMARY KEY,
  userId      INT NOT NULL,
  questId     INT NOT NULL,
  clueId      INT NOT NULL,
  completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId)  REFERENCES users(userId)   ON DELETE CASCADE,
  FOREIGN KEY (questId) REFERENCES quests(questId) ON DELETE CASCADE,
  FOREIGN KEY (clueId)  REFERENCES clues(clueId)   ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Rewards  (awarded when a user finishes a quest)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE rewards (
  rewardId   INT AUTO_INCREMENT PRIMARY KEY,
  userId     INT NOT NULL,
  questId    INT NOT NULL,
  rewardName VARCHAR(100) NOT NULL,
  awardedAt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId)  REFERENCES users(userId)   ON DELETE CASCADE,
  FOREIGN KEY (questId) REFERENCES quests(questId) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data  (English — translated from original Stadspusslet)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO cities (cityName, latitude, longitude) VALUES
  ('Gothenburg', 57.7089, 11.9746),
  ('Prague',     50.0755, 14.4378),
  ('Rome',       41.9028, 12.4964);

-- Gothenburg locations
INSERT INTO locations (cityId, locationName, locationDescription, latitude, longitude) VALUES
  (1, 'Feskekôrka',             'Historic fish market — looks like a church but has sold fish since 1874.',           57.7010821, 11.9578305),
  (1, 'Skansen Kronan',         'Historic defence tower built in 1687 as part of the city fortifications.',           57.6960493, 11.9553523),
  (1, 'Gothenburg Art Museum',  'Opened in 1923, the museum holds over 7,000 works of Nordic and international art.', 57.6965210, 11.9805977),
  (1, 'Haga Nygata',            'Charming cobblestone street known for cafés, cinnamon buns, and vintage architecture.',57.6984879, 11.9570220);

-- Gothenburg quests
INSERT INTO quests (cityId, questName, questShortDescription) VALUES
  (1, 'Gothenburg Adventure', 'Explore Gothenburg through 4 iconic historical sites.'),
  (1, 'The Lost Treasure',    'Follow clues through the old city to find a forgotten treasure.');

-- Prague quests (no locations yet — placeholder)
INSERT INTO quests (cityId, questName, questShortDescription) VALUES
  (2, 'Prague Mysteries', 'Discover Prague''s hidden historical secrets.');

-- Rome quests (no locations yet — placeholder)
INSERT INTO quests (cityId, questName, questShortDescription) VALUES
  (3, 'Rome Riddles', 'Follow clues through ancient and modern Rome.');

-- Clues for quest 1 (Gothenburg Adventure)
INSERT INTO clues (questId, locationId, clueDescription, clueOrder) VALUES
  (1, 1, 'Start where the fish once entered the city.',               1),
  (1, 2, 'Climb up to the old stone tower on the hill.',             2),
  (1, 3, 'Seek out the home of art in the heart of the city.',       3),
  (1, 4, 'Stroll along the street famous for its cinnamon buns.',    4);

-- Puzzles for quest 1 clues
INSERT INTO puzzles (clueId, puzzleName, puzzleDescription, puzzleAnswer) VALUES
  (1, 'The Architect',       'What is the name of the architect who designed Feskekyrkan — as well as many other iconic Gothenburg landmarks?',                       'Victor Von Gegerfelt'),
  (2, 'Highest Point',       'What is the name of Gothenburg''s highest point?',                                                                                     'Vättlefjäll'),
  (3, 'The Painter',         'Which famous Gothenburg artist exhibited here, who also wrote the children''s book "The Cat Journey" (Kattresan)?',                     'Ivar Arosenius'),
  (4, 'The Building Style',  'What are the characteristic Gothenburg building type found on this street, with wooden top floors on stone ground floors, called?',     'Landshövdingshus');
