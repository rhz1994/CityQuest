import React from "react";
import Clue from "../../../components/clue"; // Importera klientkomponenten för ledtråd

// Serverkomponent som hämtar quest och clues
export default async function QuestPage({ params }) {
  const questId = params.questId;

  try {
    // Hämta questdata från API:et
    const questRes = await fetch(`http://localhost:5000/quests/${questId}`);
    if (!questRes.ok) {
      return <p>Quest not found.</p>;
    }
    const quest = await questRes.json();

    // Hämta ledtrådar från API:et
    const cluesRes = await fetch(
      `http://localhost:5000/clues/quest/${questId}`
    );
    if (!cluesRes.ok) {
      return <p>No clues found for this quest.</p>;
    }
    const clues = await cluesRes.json();

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">{quest.questName}</h1>
        <p className="text-gray-700">{quest.questDescription}</p>

        <div>
          <h2 className="text-xl font-semibold mt-4">Clues:</h2>
          <ul>
            {/* Skapa en klientkomponent för varje ledtråd */}
            {clues.map((clue) => (
              <Clue key={clue.clueId} clue={clue} />
            ))}
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <p>Error loading data.</p>;
  }
}
