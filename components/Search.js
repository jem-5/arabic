"use client";

// import { searchableModules } from "@/data/AllModules";
import { useState, useEffect } from "react";
import { Search, Volume2 } from "lucide-react";

export default function SearchFloatingButton({ searchableModules = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  function searchVocab(query) {
    if (!Array.isArray(searchableModules)) return [];
    const q = query.toLowerCase().trim();
    return searchableModules.filter(
      (item) =>
        item &&
        ((item.english && item.english.toLowerCase().includes(q)) ||
          (item.arabic && item.arabic.includes(q)) ||
          (item.transliteration &&
            item.transliteration.toLowerCase().includes(q)))
    );
  }

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    setResults(searchVocab(q));
  };

  // 🔊 Speak Arabic text
  const playAudio = (src) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  // ✅ Keyboard Shortcut: Ctrl + K or /
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "/" && !isOpen && e.target.tagName !== "INPUT") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-white/60 text-white p-4 rounded-full shadow-lg hover:bg-white/20 transition-all z-50"
        aria-label="Search"
      >
        <Search size={24} />
      </button>

      {/* Shortcut Hint */}
      <p className="fixed bottom-20 right-5 text-xs text-[gray]-400 bg-[black]/60 backdrop-blur-md px-2 py-1 rounded-lg hidden md:block">
        Press <kbd className="bg-[gray]-200 px-1 rounded">⌘K</kbd> or{" "}
        <kbd className="bg-[gray]-200 px-1 rounded">/</kbd>
      </p>

      {/* Modal */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-gradient-to-br from-[#fff8e7] to-[#fff2d5] border-2 border-neutral
            rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-neutral mb-3 text-center">
              Search Arabic Vocabulary
            </h2>

            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Type in Arabic, English, or transliteration..."
              className="w-full p-3 border border-neutral bg-white/90 rounded-lg mb-4 
              text-neutral placeholder-[white] focus:outline-none  "
            />

            <div className="max-h-64 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-yellow-50 hover:bg-yellow-100 
                      border border-neutral p-3 rounded-lg transition"
                    >
                      <div>
                        <p className="text-xl font-semibold text-neutral">
                          {item.arabic}
                        </p>
                        <p className="text-sm text-neutral">
                          {item.english} —{" "}
                          <span className="italic text-neutral">
                            {item.transliteration}
                          </span>
                        </p>
                        <p className="text-sm text-neutral italic opacity-85 ">
                          Module Name: {item.module}
                        </p>
                      </div>
                      <button
                        onClick={() => playAudio(item.audio)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-neutral rounded-full p-2 shadow-md transition"
                      >
                        🔊
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query ? (
                <p className="text-neutral text-center font-medium">
                  No results found.
                </p>
              ) : (
                <p className="text-neutral text-center">
                  Start typing to search...
                </p>
              )}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
