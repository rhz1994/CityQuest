import React from "react";

// Hämta city-data på serversidan
async function getCity(cityName) {
  const res = await fetch(`http://localhost:5000/cities/${cityName}`);

  if (!res.ok) {
    return null; // Returnera null om staden inte hittas
  }

  return res.json();
}

export default async function CityPage({ params }) {
  const { cityName } = await params; // Hämta cityName från URL:en
  const city = await getCity(cityName);

  if (!city) return <p>City not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{city.cityName}</h1>
      <p className="text-gray-700">{city.cityDescription}</p>
    </div>
  );
}
