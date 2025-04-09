"use client"; // Klientkomponent

import React, { useState } from "react";

function Clue({ clue }) {
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    setSolved(true);
  };

  return (
    <li>
      <p>{clue.clueDescription}</p>
      {solved ? (
        <p>You have solved this clue!</p>
      ) : (
        <button onClick={handleSolve}>Solve Clue</button>
      )}
    </li>
  );
}

export default Clue;
