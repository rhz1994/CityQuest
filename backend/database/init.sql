CREATE DATABASE IF NOT EXISTS cityquest;
USE cityquest;

-- ─────────────────────────────────────────────────────────────────────────────
-- Drop tables in reverse FK order
-- ─────────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS refreshTokens;
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
-- RefreshTokens (for rotating backend sessions)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE refreshTokens (
  tokenId      INT AUTO_INCREMENT PRIMARY KEY,
  userId       INT NOT NULL,
  tokenHash    VARCHAR(64) NOT NULL UNIQUE,
  expiresAt    DATETIME NOT NULL,
  revokedAt    DATETIME NULL,
  createdAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data  (story-rich baseline content)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO cities (cityName, latitude, longitude) VALUES
  ('Gothenburg', 57.7089, 11.9746),
  ('Prague',     50.0755, 14.4378),
  ('Rome',       41.9028, 12.4964);

-- Gothenburg locations
INSERT INTO locations (cityId, locationName, locationDescription, latitude, longitude) VALUES
  (1, 'Gustaf Adolfs Torg',     'Här invigdes den nya staden Göteborg 1621. Torget markerar början på projektet att skapa Sveriges västliga port mot världen.', 57.7082780, 11.9668890),
  (1, 'Kronhuset',              'Ett av Göteborgs äldsta bevarade hus, uppfört på 1650-talet. Här förvarades militär materiel när staden ännu var en befäst gränsstad.', 57.7067350, 11.9690900),
  (1, 'Ostindiska huset',       'Byggdes på 1700-talet för Svenska Ostindiska Kompaniet. Härifrån organiserades handel med Asien som gjorde Göteborg till en global handelsstad.', 57.7076600, 11.9663200),
  (1, 'Eriksbergskranen',       'Den röda kranen vid Göta älv minner om 1900-talets varvsindustri, när Göteborg byggde fartyg för hela världen.',       57.7079200, 11.9147400);

-- Prague locations
INSERT INTO locations (cityId, locationName, locationDescription, latitude, longitude) VALUES
  (2, 'Old Town Square',        'Prags medeltida hjärta, omgivet av färgstarka fasader, kyrkor och århundraden av stadshistoria.',                     50.0874654, 14.4212535),
  (2, 'Charles Bridge',         'En 1300-talsbro i sten över Moldau, kantad av barockstatyer och legender.',                                           50.0865131, 14.4114361),
  (2, 'Prague Astronomical Clock', 'Orloj-klockan från 1410, berömd för sina rörliga apostlar och sin symboliska kalenderurtavla.',                   50.0870186, 14.4206390),
  (2, 'Prague Castle',          'Ett av världens största borgkomplex, säte för kungar, kejsare och dagens presidenter.',                               50.0909765, 14.4006162);

-- Rome locations
INSERT INTO locations (cityId, locationName, locationDescription, latitude, longitude) VALUES
  (3, 'Colosseum',              'Den antika amfiteatern där gladiatorer en gång kämpade inför tusentals åskådare.',                                     41.8902102, 12.4922309),
  (3, 'Pantheon',               'Ett ovanligt välbevarat romerskt tempel med enorm kupol och ett öppet oculus mot himlen.',                             41.8986108, 12.4768724),
  (3, 'Trevi Fountain',         'Roms ikoniska barockfontän där besökare kastar mynt för att lova sin återkomst.',                                      41.9009325, 12.4833137),
  (3, 'Roman Forum',            'Ruiner av tempel, basilikor och politiska rum som utgjorde hjärtat i det antika Rom.',                                41.8924626, 12.4853254);

-- Quests
INSERT INTO quests (cityId, questName, questShortDescription) VALUES
  (1, 'Gothenburg Adventure', 'Mysterium: Ett förseglat stadsbrev antyder att Göteborgs verkliga uppdrag dolts sedan 1621. Avkoda spåren mellan grundandet, Ostindiska handeln och varvsepokens fall.'),
  (1, 'The Lost Treasure',    'Mysterium: En försvunnen lastjournal från Ostindiska Kompaniet innehåller en kod som pekar mot en dold förmögenhet och en mörklagd maktstrid i Göteborg.'),
  (2, 'Prague Mysteries',     'Mysterium: En astronomisk kod i Orloj kopplar samman uppror, kungamakt och hemliga ordnar i Prag. Följ spåren innan sanningen försvinner igen.'),
  (3, 'Rome Riddles',         'Mysterium: En romersk historiker gömde en varning om maktens återkomst i stadens monument. Tolkningen finns i Colosseum, Forum, Pantheon och Trevifontänen.');

-- Clues for quest 1 (Gothenburg Adventure)
INSERT INTO clues (questId, locationId, clueDescription, clueOrder) VALUES
  (1, 1, 'Ett förseglat dokument från 1621 bär samma symbol som på din karta. Starta vid Gustaf Adolfs Torg och identifiera varför staden grundades just här - vid rikets västliga handelsport.', 1),
  (1, 2, 'På dokumentets baksida syns en markering i krutsvart bläck. Spåret leder till Kronhuset, där du måste koppla militär logistik och stormaktspolitik till stadens överlevnad.', 2),
  (1, 3, 'Ett sigill med drake och våg leder dig vidare. I Ostindiska huset avslöjas hur Svenska Ostindiska Companiet band Göteborg till Kanton och global handel på 1700-talet.', 3),
  (1, 4, 'Sista koden är ristad i stål: "När handeln ändrade form bytte staden hjärta." Vid Eriksbergskranen löser du hur varvsindustrin tog över och varför dess fall förändrade Göteborg för alltid.', 4);

-- Clues for quest 2 (The Lost Treasure)
INSERT INTO clues (questId, locationId, clueDescription, clueOrder) VALUES
  (2, 1, 'Journalen öppnar med en latinsk rad och koordinater till stadens centrum. Vid Gustaf Adolfs Torg hittar du första nyckeln: vem gav handelseliten sitt mandat?', 1),
  (2, 2, 'Nästa sida är märkt med ett vapen och ordet custodia. I Kronhuset måste du avgöra hur våldskapital och statsmakt skyddade varuflödena.', 2),
  (2, 3, 'Ett kodord upprepas i marginalen: Canton. I Ostindiska huset knäcker du kopplingen mellan te, siden, silver och Göteborgs sociala hierarkier.', 3),
  (2, 4, 'Sista ledtråden är nästan utbränd men läsbar: "Fråga järnet vem som betalade priset." Vid Eriksbergskranen avslöjar du skattens sista hemlighet - den handlade aldrig bara om pengar.', 4);

-- Clues for quest 3 (Prague Mysteries)
INSERT INTO clues (questId, locationId, clueDescription, clueOrder) VALUES
  (3, 1, 'Ett pergament markerat med en sol och ett svärd leder till Staromestske namesti. Här börjar jakten på frågan: vem kontrollerade tid, tro och lag i Prag?', 1),
  (3, 3, 'När klockspelet slår i Orloj framträder nästa mönster. Du måste läsa symbolerna som förenar astronomi, kristen världsbild och politisk legitimitet.', 2),
  (3, 2, 'På Karlsbron väntar kod tre, gömd bland helgonstatyerna. Spåret binder samman Karl IV:s maktbygge, pilgrimsvägar och stadens offentliga teater.', 3),
  (3, 4, 'I Pragborgen låses allt upp: mysteriet visar hur dynastier och idéer använde historia som verktyg för att styra framtiden.', 4);

-- Clues for quest 4 (Rome Riddles)
INSERT INTO clues (questId, locationId, clueDescription, clueOrder) VALUES
  (4, 1, 'I Colosseums valv hittar du första kodordet: panem et circenses. Jakten börjar med hur imperiet gjorde underhållning till politiskt vapen.', 1),
  (4, 4, 'Forum Romanum avslöjar nästa lager: lag, ritual och propaganda i samma rum. Här måste du avgöra när republiken blev ett skådespel.', 2),
  (4, 2, 'I Pantheon läser du den tredje nyckeln i sten och ljus. Kupolen avslöjar hur teknik, religion och kejsarmakt samverkade för att skapa evighet.', 3),
  (4, 3, 'Vid Trevifontänen möter antiken den moderna myten. Sista svaret visar hur Rom fortfarande kodar om sitt förflutna för nya generationer.', 4);

-- Puzzles for all clues (1 clue -> 1 puzzle)
INSERT INTO puzzles (clueId, puzzleName, puzzleDescription, puzzleAnswer) VALUES
  (1,  'Stadens födelseår', 'Vilket år fick Göteborg sina stadsprivilegier av Gustav II Adolf? Historisk referens: https://sv.wikipedia.org/wiki/G%C3%B6teborg', '1621'),
  (2,  'Det äldsta huset', 'Vad heter byggnaden från 1600-talet som är en av Göteborgs äldsta bevarade? Referens: https://sv.wikipedia.org/wiki/Kronhuset', 'Kronhuset'),
  (3,  'Global handel', 'Vad hette handelsbolaget som bedrev Sveriges handel med Asien från Göteborg på 1700-talet? Referens: https://sv.wikipedia.org/wiki/Svenska_Ostindiska_Companiet', 'Svenska Ostindiska Companiet'),
  (4,  'Varvsepoken', 'Vad heter den röda kranen som blivit symbol för Göteborgs varvshistoria? Referens: https://sv.wikipedia.org/wiki/Eriksbergskranen', 'Eriksbergskranen'),
  (5,  'Grundarens namn', 'Vilken kung förknippas med grundandet av Göteborg och har gett namn åt torget? Referens: https://sv.wikipedia.org/wiki/Gustav_II_Adolf', 'Gustav II Adolf'),
  (6,  'Stormaktens logik', 'Under vilket århundrade uppfördes Kronhuset? Referens: https://sv.wikipedia.org/wiki/Kronhuset', '1600-talet'),
  (7,  'Handelns nav', 'Vilken byggnad i Göteborg kopplas direkt till Ostindiska handelns administration? Referens: https://sv.wikipedia.org/wiki/Ostindiska_huset,_G%C3%B6teborg', 'Ostindiska huset'),
  (8,  'Industrins arv', 'I vilken stadsdel ligger Eriksbergskranen, ett tydligt minnesmärke från varvstiden? Referens: https://sv.wikipedia.org/wiki/Eriksbergskranen', 'Eriksberg'),
  (9,  'Maktens torg', 'Vad heter torget där mysteriet i Prag börjar? Referens: https://en.wikipedia.org/wiki/Old_Town_Square_(Prague)', 'Old Town Square'),
  (10, 'Tidens maskin', 'Vad kallas Prags astronomiska klocka från 1410? Referens: https://en.wikipedia.org/wiki/Prague_astronomical_clock', 'Orloj'),
  (11, 'Kungens bro', 'Under vilken härskare började Karlsbron byggas år 1357? Referens: https://en.wikipedia.org/wiki/Charles_Bridge', 'Charles IV'),
  (12, 'Borgen och riket', 'Vad heter borgområdet där böhmiska och habsburgska maktspår möts? Referens: https://en.wikipedia.org/wiki/Prague_Castle', 'Prague Castle'),
  (13, 'Bröd och skådespel', 'Vad heter amfiteatern som invigdes under Titus år 80 e.Kr.? Referens: https://en.wikipedia.org/wiki/Colosseum', 'Colosseum'),
  (14, 'Republikens hjärta', 'Vilken plats var centrum för politik och religion i det antika Rom? Referens: https://en.wikipedia.org/wiki/Roman_Forum', 'Roman Forum'),
  (15, 'Kupolens gåta', 'Vilken byggnad från Hadrianus tid är känd för sitt oculus? Referens: https://en.wikipedia.org/wiki/Pantheon,_Rome', 'Pantheon'),
  (16, 'Det moderna lagret', 'Vilken 1700-talsfontän avslutar mysteriet och visar hur antikens symboler lever vidare i turism? Referens: https://en.wikipedia.org/wiki/Trevi_Fountain', 'Trevi Fountain');
