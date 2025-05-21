import React from "react";
import Link from "next/link";

// Hämta city-data på serversidan
async function getCity(cityName) {
  const res = await fetch(`http://localhost:5000/cities/${cityName}`);
  if (!res.ok) {
    return null;
  }
  const cityData = await res.json();
  return cityData;
}

export default async function CityPage(props) {
  const { cityName } = await props.params;
  const city = await getCity(cityName);

  if (!city) {
    return (
      <div className="p-6 text-center text-red-400 font-semibold">
        <p>City not found</p>
        <Link
          href="/"
          className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-6 rounded-lg shadow transition-colors inline-block"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const res = await fetch(`http://localhost:5000/quests/city/${cityName}`);
  if (!res.ok) {
    return (
      <main className="flex flex-col items-center mt-10">
        <p className="text-yellow-400 font-semibold">
          No quests found for this city.
        </p>
        <Link
          href="/"
          className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-6 rounded-lg shadow transition-colors"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }
  const quests = await res.json();

  return (
    <main className="max-w-xl mx-auto mt-10 bg-gray-900/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
      <Link
        href="/"
        className="mb-6 bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-6 rounded-lg shadow transition-colors self-start"
      >
        ← Back to Home
      </Link>
      <h1 className="text-yellow-400 text-3xl font-extrabold mb-2 tracking-wider">
        {city.cityName}
      </h1>
      <p className="text-yellow-100 mb-6 text-center">{city.cityDescription}</p>

      <h2 className="text-yellow-300 text-xl font-bold mb-4">
        Available Quests:
      </h2>

      {quests.length > 0 ? (
        <ul className="w-full space-y-4">
          {quests.map((quest) => (
            <li key={quest.questId}>
              <Link
                href={`/quest/${quest.questId}`}
                className="block bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-3 px-6 rounded-lg shadow transition-colors text-center"
              >
                {quest.questName}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">
          No quests available for this city.
        </p>
      )}
    </main>
  );
}
