"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Hämta quest-data på serversidan
async function getQuest(questId) {
  const res = await fetch(`http://localhost:5000/quests/${questId}`);
  if (!res.ok) return null;
  return res.json();
}

// Hämta ledtrådar
async function getCluesByQuest(questId) {
  const res = await fetch(`http://localhost:5000/clues/quest/${questId}`);
  if (!res.ok) return null;
  return res.json();
}

export default function QuestPage() {
  // Ladda in url
  const params = useParams();
  const questId = params.questId;

  const [quest, setQuest] = useState(null);
  const [clues, setClues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!questId) return;
      setLoading(true);
      const questData = await getQuest(questId);
      const cluesData = await getCluesByQuest(questId);
      setQuest(questData);
      setClues(cluesData);
      setLoading(false);
    }

    fetchData();
  }, [questId]);

  if (loading) return <p>Loading...</p>;
  if (!quest) return <p>Quest not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{quest.questName}</h1>
      <p className="text-gray-700">{quest.questDescription}</p>

      <div>
        <h2 className="text-xl font-semibold mt-4">Clues:</h2>
        <ul>
          {clues?.map((clue) => (
            <li key={clue.clueId}>{clue.clueDescription}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
