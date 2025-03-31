// app/quest/page.js
import Link from "next/link";

export default function Quest() {
  return (
    <div>
      <h1>CityQuest: The Mystery Begins!</h1>
      <p>
        Welcome to the quest. Here, you will explore the city and uncover hidden
        secrets.
      </p>

      {/* Lägg till länk till startsidan */}
      <Link href="/">Back to Home</Link>

      {/* Lägg till en länk till nästa steg i questen (kan vara en annan sida) */}
      <Link href="/quest/1">Start Quest</Link>
    </div>
  );
}
