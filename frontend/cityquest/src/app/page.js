// src/app/page.tsxdddddddddssssggggggggg

import Link from "next/link"; // För att använda Next.js routing

const cities = ["Gothenburg"];

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <header>
        <h1>Welcome to CityQuest!</h1>
        <p>Your adventure begins here...</p>
      </header>

      <main>
        {cities.map((city) => (
          <Link key={city} href={`/city/${city}`}>
            <button
              style={{ padding: "10px 20px", fontSize: "16px" }}
              className="cursor-pointer"
            >
              {city}
            </button>
          </Link>
        ))}
      </main>

      <footer>
        <p>&copy; 2025 CityQuest</p>
      </footer>
    </div>
  );
}
