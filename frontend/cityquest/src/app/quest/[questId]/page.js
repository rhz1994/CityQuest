import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function QuestPage() {
  const params = useParams();
  const questId = params?.questId; // Fallback om useParams() är undefined
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuest() {
      try {
        const res = await fetch(`http://localhost:3000/quests/name/${questId}`); // Säkerställ att backend har denna route
        if (!res.ok) throw new Error("Failed to fetch quest");
        const data = await res.json();
        setQuest(data);
      } catch (error) {
        console.error("Error loading quest:", error);
      } finally {
        setLoading(false);
      }
    }

    if (questId) {
      fetchQuest();
    }
  }, [questId]);

  if (loading) return <p>Loading...</p>;
  if (!quest) return <p>Quest not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{quest.questId}</h1>
      <p className="text-gray-700">{quest.questDescription}</p>
    </div>
  );
}
