import React from "react";

export default function WordList({ words, playAudio, removeWord }) {
  return (
    <>
      {words ? (
        <ul className="space-y-2">
          {words.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-yellow-50 hover:bg-yellow-100 
                      border border-yellow-300 p-3 rounded-lg transition"
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
                <button
                  onClick={() => playAudio(item.audio)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-accent rounded-full p-2 shadow-md transition "
                >
                  🔊
                </button>
              </div>

              <button
                onClick={() => removeWord(item)}
                // disabled={removingIndex === index}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition disabled:opacity-50"
                title="Remove from review"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      ) : (
        "There are no words to review in your profile."
      )}
    </>
  );
}
