import React from "react";

// Hämta quest-data på serversidan
async function getQuest(questId) {
  const res = await fetch(`http://localhost:5000/quests/${questId}`);

  if (!res.ok) {
    return null; // Returnera null om questen inte hittas
  }

  return res.json();
}

export default async function QuestPage({ params }) {
  const { questId } = await params; // Hämta questId från URL:en
  const quest = await getQuest(questId);

  if (!quest) return <p>Quest not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{quest.questName}</h1>
      <p className="text-gray-700">{quest.questDescription}</p>
    </div>
  );
}
