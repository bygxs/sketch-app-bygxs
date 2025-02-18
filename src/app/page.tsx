"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col text-gray-800 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Paper
          </h1>
          {/* Search Bar */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-indigo-200"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Create Button */}

          <div>
            <Link
              href="/art"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition duration-200"
            >
              + ArtTrueArt
            </Link>
          </div>
{/* 
          <div>
            <Link
              href="/draw2flattened"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition duration-200"
            >
              + draw2flattened
            </Link>
          </div>

          <div>
            <Link
              href="/drawRush"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition duration-200"
            >
              + draw RUSH
            </Link>
          </div>

          <div>
            <Link
              href="/drawExport"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition duration-200"
            >
              + draw EXPORT
            </Link>
          </div>

          <div>
            <Link
              href="/draw2"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition duration-200"
            >
              + draw2
            </Link>
          </div>

          <div>
            <Link
              href="/drawing"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition duration-200"
            >
              + New Drawing
            </Link>
          </div>
 */}
          {/* Notebooks Section */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Drawings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg transition duration-200"
              >
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {drawing.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {drawing.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Dummy Data for Drawings
const drawings = [
  {
    id: 1,
    title: "Sketch 1",
    description: "A beautiful landscape sketch.",
  },
  {
    id: 2,
    title: "Idea Board",
    description: "Brainstorming session notes.",
  },
  {
    id: 3,
    title: "Character Design",
    description: "Concept art for a new character.",
  },
];
