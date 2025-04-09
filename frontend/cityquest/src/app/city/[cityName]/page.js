import React from "react";

import Link from "next/link";

// Hämta city-data på serversidan
async function getCity(cityName) {
  const res = await fetch(`http://localhost:5000/cities/${cityName}`);

  if (!res.ok) {
    return null; // Returnera null om staden inte hittas
  }

  const cityData = await res.json(); // Hämta JSON-datan
  console.log(cityData); // Logga hela staden (objektet) här
  return cityData;
}

export default async function CityPage({ params }) {
  const { cityName } = await params; // Hämta cityName från URL:en
  const city = await getCity(cityName);

  if (!city) return <p>City not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{city.cityName}</h1>
      <p className="text-gray-700">{city.cityDescription}</p>

      <h2 className="text-xl font-semibold mt-4">Available Quests:</h2>
      {city.questId ? (
        <ul>
          <li key={city.questId}>
            <Link href={`/quest/${city.questId}`}>
              <button
                style={{ padding: "10px 20px", fontSize: "16px" }}
                className="cursor-pointer bg-blue-500 text-white rounded mt-2"
              >
                Start {city.questName}
              </button>
            </Link>
          </li>
        </ul>
      ) : (
        <p>No quests available for this city.</p>
      )}
    </div>
  );
}
