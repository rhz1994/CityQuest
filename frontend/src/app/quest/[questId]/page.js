import React from "react";
import Link from "next/link";
import CluesModal from "../../../components/CluesModal"; // Ny client component

export default async function QuestPage({ params }) {
  const { questId } = await params;

  // Hämta quest och clues på serversidan
  const questRes = await fetch(`http://localhost:5000/quests/${questId}`);
  if (!questRes.ok) {
    return (
      <main className="flex flex-col items-center mt-10">
        <p className="text-red-400 font-semibold">Quest not found.</p>
      </main>
    );
  }
  const quest = await questRes.json();

  const cluesRes = await fetch(`http://localhost:5000/clues/quest/${questId}`);
  const clues = await cluesRes.json();

  return (
    <main className="max-w-xl mx-auto mt-10 bg-gray-900/90 rounded-xl shadow-xl p-8 flex flex-col items-center">
      <Link
        href={`/city/${quest.cityName}`}
        className="mb-6 bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-6 rounded-lg shadow transition-colors self-start"
      >
        ← Back to Quests
      </Link>
      <h1 className="text-yellow-400 text-2xl font-extrabold mb-2 tracking-wider">
        {quest.questName}
      </h1>
      <p className="text-yellow-100 mb-6 text-center">
        {quest.questDescription}
      </p>
      {/* Modal-knapp och modal */}
      <CluesModal clues={clues} />
    </main>
  );
}
