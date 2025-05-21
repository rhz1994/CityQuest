"use client";
import { useState } from "react";

export default function CluesModal({ clues }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [solved, setSolved] = useState(Array(clues.length).fill(false));
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleSolve = (e) => {
    e.preventDefault();
    if (
      answer.trim().toLowerCase() ===
      (clues[current].puzzleAnswer || "").trim().toLowerCase()
    ) {
      setSolved((prev) => {
        const copy = [...prev];
        copy[current] = true;
        return copy;
      });
      setError("");
      setAnswer("");
    } else {
      setError("Fel svar, försök igen!");
    }
  };

  const next = () => {
    if (current < clues.length - 1) {
      setCurrent((i) => i + 1);
      setError("");
      setAnswer("");
    } else {
      resetModal();
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((i) => i - 1);
      setError("");
      setAnswer("");
    }
  };

  function resetModal() {
    setOpen(false);
    setCurrent(0);
    setAnswer("");
    setError("");
    setSolved(Array(clues.length).fill(false));
  }

  return (
    <>
      <button
        className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg mb-4 transition-colors duration-200 text-lg tracking-wide"
        onClick={() => {
          setCurrent(0);
          setOpen(true);
          setAnswer("");
          setError("");
        }}
      >
        Starta spel
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-md w-full relative">
            <button
              onClick={resetModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              aria-label="Stäng"
            >
              ×
            </button>
            <h2 className="text-yellow-700 dark:text-yellow-400 font-bold mb-2">
              Ledtråd {current + 1} av {clues.length}
            </h2>
            <p className="mb-4 text-gray-800 dark:text-gray-100">
              {clues[current].clueDescription}
            </p>
            <p className="mt-4 font-semibold">{clues[current].puzzleName}</p>
            <p>{clues[current].puzzleDescription}</p>
            {!solved[current] ? (
              <form onSubmit={handleSolve} className="flex flex-col gap-3">
                <input
                  type="text"
                  className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                  placeholder="Ditt svar..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  autoFocus
                />
                {error && <span className="text-red-500">{error}</span>}
                <button
                  type="submit"
                  className="px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Lös pussel
                </button>
              </form>
            ) : (
              <p className="text-green-600 dark:text-green-400 font-semibold mb-4">
                Du har löst denna ledtråd!
              </p>
            )}
            <div className="flex justify-between mt-6">
              <button
                onClick={prev}
                disabled={current === 0}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold disabled:opacity-50"
              >
                Föregående
              </button>
              <button
                onClick={next}
                disabled={!solved[current]}
                className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold disabled:opacity-50"
              >
                {current === clues.length - 1 ? "Avsluta" : "Nästa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
