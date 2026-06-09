import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { solvePuzzle } from "../services/puzzlesService";
import { database } from "../../database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

let userId: number;
let cityId: number;
let questId: number;
let locationIds: number[] = [];
let clueIds: number[] = [];
let puzzleIds: number[] = [];

const testLatitude = 57.708278;
const testLongitude = 11.966889;
const testRunId = Date.now();

describe("solvePuzzle", () => {
  beforeAll(async () => {
    const [userResult] = await database.query<ResultSetHeader>(
      "INSERT INTO users (userName, userEmail, authProvider, authProviderUserId) VALUES (?, ? ,?, ?)",
      [
        `test-user-${testRunId}`,
        `test-user-${testRunId}@example.com`,
        "email",
        `test-provider-user-${testRunId}`,
      ],
    );

    userId = userResult.insertId;

    const [cityResult] = await database.query<ResultSetHeader>(
      "INSERT INTO cities (cityName, latitude, longitude) VALUES (?, ?, ?)",
      ["Test City", testLatitude, testLongitude],
    );

    cityId = cityResult.insertId;

    const [questResult] = await database.query<ResultSetHeader>(
      "INSERT INTO quests (cityId, questName, questShortDescription) VALUES (?, ?, ?)",
      [cityId, "Test Quest", "Quest used by solvePuzzle integration tests"],
    );

    questId = questResult.insertId;

    for (let i = 0; i < 3; i++) {
      const [locationResult] = await database.query<ResultSetHeader>(
        "INSERT INTO locations (cityId, locationName, locationDescription, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
        [
          cityId,
          `Test Location ${i + 1}`,
          `Test location ${i + 1}`,
          testLatitude,
          testLongitude,
        ],
      );
      locationIds.push(locationResult.insertId);
    }
    expect(locationIds).toHaveLength(3);

    for (let i = 0; i < 3; i++) {
      const [clueResults] = await database.query<ResultSetHeader>(
        "INSERT INTO clues (questId, locationId, clueDescription, clueOrder) VALUES (?, ?, ?, ?)",
        [questId, locationIds[i], `Test clues ${i + 1} `, i + 1],
      );
      clueIds.push(clueResults.insertId);
    }
    expect(clueIds).toHaveLength(3);

    const answers = ["answer-one", "answer-two", "answer-three"];

    for (let i = 0; i < 3; i++) {
      const [puzzleResult] = await database.query<ResultSetHeader>(
        "INSERT INTO puzzles (clueId, puzzleName, puzzleDescription, puzzleAnswer) VALUES (?, ?, ?, ?)",
        [
          clueIds[i],
          `Test puzzle ${i + 1}`,
          `Test puzzle description ${i + 1}`,
          answers[i],
        ],
      );

      puzzleIds.push(puzzleResult.insertId);
    }

    expect(puzzleIds).toHaveLength(3);
  });

  beforeEach(async () => {
    await database.query(
      "DELETE FROM rewards WHERE userId = ? AND questId = ?",
      [userId, questId],
    );

    await database.query(
      "DELETE FROM userProgress WHERE userId = ? AND questId = ?",
      [userId, questId],
    );
  });
  afterAll(async () => {
    await database.query(
      "DELETE FROM rewards WHERE userId = ? AND questId = ?",
      [userId, questId],
    );

    await database.query(
      "DELETE FROM userProgress WHERE userId = ? AND questId = ?",
      [userId, questId],
    );

    await database.query(
      "DELETE FROM puzzles WHERE puzzleId IN (?, ?, ?)",
      puzzleIds,
    );

    await database.query(
      "DELETE FROM clues WHERE clueId IN (?, ?, ?)",
      clueIds,
    );

    await database.query(
      "DELETE FROM locations WHERE locationId IN (?, ?, ?)",
      locationIds,
    );

    await database.query("DELETE FROM quests WHERE questId = ?", [questId]);

    await database.query("DELETE FROM cities WHERE cityId = ?", [cityId]);

    await database.query("DELETE FROM users WHERE userId = ?", [userId]);

    await database.end();
  });
  it("wrong answer does not save progress", async () => {
    const result = await solvePuzzle({
      userId,
      puzzleId: puzzleIds[0],
      answer: "wrong-answer",
      latitude: testLatitude,
      longitude: testLongitude,
    });

    expect(result).toEqual({
      solved: false,
      progressId: null,
      questComplete: false,
    });

    const [progressRows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM userProgress WHERE userId = ? AND questId = ?",
      [userId, questId],
    );

    expect(progressRows).toHaveLength(0);
  });
  it("correct answer saves progress", async () => {
    const result = await solvePuzzle({
      userId,
      puzzleId: puzzleIds[0],
      answer: "answer-one",
      latitude: testLatitude,
      longitude: testLongitude,
    });

    expect(result.solved).toBe(true);
    expect(result.progressId).toBeGreaterThan(0);
    expect(result.questComplete).toBe(false);

    const [progressRows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM userProgress WHERE userId = ? AND questId = ? AND clueId = ?",
      [userId, questId, clueIds[0]],
    );
    expect(progressRows).toHaveLength(1);
  });

  it("later clues cannot be solved before earlier clues", async () => {
    await expect(
      solvePuzzle({
        userId,
        puzzleId: puzzleIds[1],
        answer: "answer-two",
        latitude: testLatitude,
        longitude: testLongitude,
      }),
    ).rejects.toThrow("Previous clues must be solved first");

    const [progressRows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM userProgress WHERE userId = ? AND questId = ?",
      [userId, questId],
    );

    expect(progressRows).toHaveLength(0);
  });

  it("duplicate solve does not duplicate progress", async () => {
    await solvePuzzle({
      userId,
      puzzleId: puzzleIds[0],
      answer: "answer-one",
      latitude: testLatitude,
      longitude: testLongitude,
    });

    const result = await solvePuzzle({
      userId,
      puzzleId: puzzleIds[0],
      answer: "answer-one",
      latitude: testLatitude,
      longitude: testLongitude,
    });

    expect(result.solved).toBe(true);
    expect(result.progressId).toBeNull();

    const [progressRows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM userProgress WHERE userId = ? AND questId = ? AND clueId = ?",
      [userId, questId, clueIds[0]],
    );

    expect(progressRows).toHaveLength(1);
  });

  it("completing all clues creates one reward", async () => {
    await solvePuzzle({
      userId,
      puzzleId: puzzleIds[0],
      answer: "answer-one",
      latitude: testLatitude,
      longitude: testLongitude,
    });

    await solvePuzzle({
      userId,
      puzzleId: puzzleIds[1],
      answer: "answer-two",
      latitude: testLatitude,
      longitude: testLongitude,
    });

    const result = await solvePuzzle({
      userId,
      puzzleId: puzzleIds[2],
      answer: "answer-three",
      latitude: testLatitude,
      longitude: testLongitude,
    });

    expect(result.solved).toBe(true);
    expect(result.questComplete).toBe(true);

    const [rewardRows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM rewards WHERE userId = ? AND questId = ?",
      [userId, questId],
    );

    expect(rewardRows).toHaveLength(1);
  });

  it("location check rejects far-away solves when dev bypass is disabled", async () => {
    await expect(
      solvePuzzle({
        userId,
        puzzleId: puzzleIds[0],
        answer: "answer-one",
        latitude: 0,
        longitude: 0,
      }),
    ).rejects.toThrow("Not close enough to solve this puzzle");

    const [progressRows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM userProgress WHERE userId = ? AND questId = ?",
      [userId, questId],
    );

    expect(progressRows).toHaveLength(0);
  });
});
