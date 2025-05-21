import Link from "next/link";

const cities = ["Gothenburg"];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-[60vh] pt-10">
      <section className="w-full max-w-md bg-gray-900/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-yellow-400 text-2xl font-extrabold mb-8 tracking-wider">
          Choose your city
        </h2>
        {cities.map((city) => (
          <Link
            key={city}
            href={`/city/${city}`}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg mb-4 transition-colors duration-200 text-lg tracking-wide text-center"
          >
            {city}
          </Link>
        ))}
      </section>
      <footer className="mt-12 text-yellow-200 text-sm opacity-80">
        &copy; 2025 CityQuest
      </footer>
    </main>
  );
}
