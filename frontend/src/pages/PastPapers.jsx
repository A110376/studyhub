import { useState } from "react";
import papersData from "../data/papersData";

export default function PastPapers() {
  const seats = Object.keys(papersData);

  const [selectedSeat, setSelectedSeat] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-900 drop-shadow-md">
        PPSC Past Papers
      </h1>

      {/* Show list of seats */}
      {!selectedSeat && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {seats.map((seat) => (
            <button
              key={seat}
              onClick={() => setSelectedSeat(seat)}
              className="bg-white rounded-xl shadow-lg p-8 text-center text-xl font-semibold text-blue-900 hover:bg-yellow-400 hover:text-blue-900 transition-transform transform hover:scale-105"
            >
              {/* Optional: You can add an icon or emoji here */}
              <div className="mb-2 text-4xl">📄</div>
              {seat}
            </button>
          ))}
        </div>
      )}

      {/* Show papers for selected seat */}
      {selectedSeat && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <button
            onClick={() => setSelectedSeat(null)}
            className="mb-6 text-yellow-500 hover:underline font-medium flex items-center gap-2"
          >
            <span className="text-2xl">&#8592;</span> Back to Seats
          </button>

          <h2 className="text-3xl font-bold mb-8 text-blue-900 border-b border-yellow-400 pb-3">
            {selectedSeat} Past Papers
          </h2>

          <ul className="space-y-6">
            {papersData[selectedSeat].map(({ year, url }) => (
              <li
                key={year}
                className="flex justify-between items-center bg-indigo-50 rounded-lg px-6 py-4 shadow-inner"
              >
                <span className="text-xl font-semibold text-blue-800">
                  {year} Paper
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-block bg-yellow-400 text-blue-900 font-semibold px-5 py-2 rounded-lg shadow hover:bg-yellow-500 transition"
                >
                  Download PDF
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
