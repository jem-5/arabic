"use client";

import { useEffect, useState, useRef } from "react";
import MyButton from "@/components/Button";
import { AllModules } from "@/data/AllModules";

export default function ListenTapGame() {
  const GAME_TIME = 60;
  const words = Object.values(AllModules).flat();
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const timerRef = useRef(null);

  /* ------------------ GAME START ------------------ */

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameActive(true);
    setFeedback(null);
    nextRound();
  };

  /* ------------------ TIMER ------------------ */

  useEffect(() => {
    if (!gameActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameActive]);

  /* ------------------ ROUND GENERATION ------------------ */

  const nextRound = () => {
    if (!words.length) return;

    const correct = words[Math.floor(Math.random() * words.length)];

    const distractors = [];
    while (distractors.length < 3) {
      const w = words[Math.floor(Math.random() * words.length)];
      if (
        w.arabic !== correct.arabic &&
        !distractors.some((d) => d.arabic === w.arabic)
      ) {
        distractors.push(w);
      }
    }

    const shuffled = [correct, ...distractors].sort(() => Math.random() - 0.5);

    setRound(correct);
    setOptions(shuffled);
    playAudio(correct.audio);
  };

  /* ------------------ AUDIO ------------------ */

  const playAudio = (src) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch(() => {});
  };

  /* ------------------ ANSWER HANDLING ------------------ */

  const handleAnswer = (word) => {
    if (!gameActive) return;

    if (word.arabic === round.arabic) {
      setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    setTimeout(() => {
      setFeedback(null);
      nextRound();
    }, 400);
  };

  /* ------------------ UI ------------------ */

  if (!gameActive && timeLeft === GAME_TIME) {
    return (
      <div className="card bg-neutral p-6 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-4">🎧 Listen & Tap</h2>
        <p className="mb-4">
          Listen to the Arabic audio and tap the correct word. How many can you
          get in 60 seconds?
        </p>
        <MyButton text="Start Game" func={startGame} />
      </div>
    );
  }

  if (!gameActive && timeLeft === 0) {
    return (
      <div className="card bg-neutral p-6 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-2">⏱ Time’s up!</h2>
        <p className="text-xl mb-4">
          You got <span className="font-bold">{score}</span> correct!
        </p>
        <MyButton text="Play Again" func={startGame} />
      </div>
    );
  }

  return (
    <div className="card bg-neutral p-4 shadow-xl w-full max-w-md">
      {/* Top Bar */}
      <div className="flex justify-between mb-2 text-lg font-bold">
        <span>⏱ {timeLeft}s</span>
        <span>Score: {score}</span>
      </div>

      {/* Listen Button */}
      <div className="flex justify-center my-3">
        <button
          onClick={() => playAudio(round?.audio)}
          className="text-4xl bg-black p-3 rounded-full hover:scale-110 transition"
        >
          🔊
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`text-center text-xl mb-2 ${
            feedback === "correct" ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback === "correct" ? "✔ Correct!" : "✖ Try again"}
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="bg-secondary text-2xl py-4 rounded-lg hover:scale-105 transition"
          >
            {opt.arabic}
          </button>
        ))}
      </div>
    </div>
  );
}
