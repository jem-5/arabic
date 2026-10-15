"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import Sentences from "@/data/sentences/Sentences";
import MyButton from "@/components/Button";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { LucideHeading2 } from "lucide-react";

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const arraysMatch = (arr1, arr2) =>
  arr1.length === arr2.length &&
  arr1.every((value, index) => value === arr2[index]);

function Sortable({ word, index }) {
  const { ref } = useSortable({ id: word.id, index });
  return (
    <li
      ref={ref}
      className="item text-primary font-bold text-lg list-none inline-block mr-4 "
    >
      {word.text}
    </li>
  );
}
export default function SentenceBuilder() {
  const [level, setLevel] = useState("basic");
  const [problem, setProblem] = useState([]);
  const [shuffledSentences, setShuffledSentences] = useState(() =>
    shuffleArray(Sentences),
  );
  const [questionNum, setQuestionNum] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState([]);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const problems = useMemo(
    () => shuffledSentences.filter((item) => item.difficulty === level),
    [level, shuffledSentences],
  );
  const currentProblem = problems[questionNum];

  useEffect(() => {
    if (!currentProblem) {
      setProblem([]);
      return;
    }

    const correctWords = currentProblem.arabic.split(" ");
    let shuffled = shuffleArray(
      correctWords.map((text, index) => ({
        id: `word-$${index}`,
        text,
      })),
    );

    const isAlreadyCorrect = arraysMatch(
      shuffled.map((word) => word.text),
      correctWords,
    );
    if (shuffled.length > 1 && isAlreadyCorrect) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    setProblem(shuffled.toReversed());
    setUserAnswer([]);
    setShowAnswer(false);
    setIsCorrect(false);
  }, [currentProblem]);

  const checkAnswer = () => {
    if (!currentProblem) return;

    const correctAnswer = currentProblem.arabic.split(" ");

    const answerWords = problem.toReversed().map((word) => word.text);
    // const userAnswer = problem.toReversed();
    const correct = arraysMatch(correctAnswer, answerWords);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setUserAnswer(answerWords.join(" "));
    setIsCorrect(correct);
    setShowAnswer(true);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4 text-neutral">
          Sentence Builder
        </h1>
        <h3 className=" text-neutral font-bold">
          {questionNum + 1} / {problems.length}
        </h3>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 text-black flex-col collapse">
        <input id="collapse-1-toggle" type="checkbox" className="peer" />
        <label
          htmlFor="collapse-1-toggle"
          className="fixed inset-0 hidden peer-checked:block z-0"
        ></label>
        <div className="collapse-title text-md">⚙️ Settings</div>
        <div
          className="collapse-content relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-sm font-bold  text-neutral">
            Choose sentence difficulty level
          </h3>
          <div
            className="flex gap-3 text-sm"
            onClick={(e) => {
              setLevel(e.target.value);
              setQuestionNum(0);
              setShowAnswer(false);
              setIsCorrect(false);
            }}
          >
            <label className="flex justify-center">
              <input
                type="radio"
                name="radio-1"
                className="radio"
                value="basic"
                defaultChecked
              />
              <span>Basic</span>
            </label>

            <label className="flex justify-center">
              <input
                type="radio"
                name="radio-1"
                value="intermediate"
                className="radio"
              />
              <span>Intermediate</span>
            </label>

            <label className="flex justify-center">
              <input
                type="radio"
                name="radio-1"
                value="advanced"
                className="radio"
              />
              <span>Advanced</span>
            </label>
          </div>
          <h3 className="text-sm font-bold  text-neutral">
            Provide English translation
          </h3>
          <div
            className="flex gap-3 text-sm  "
            onClick={(e) => {
              setShowEnglish((prev) => !prev);
            }}
          >
            <label className="label">
              <input
                type="checkbox"
                className="toggle"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
              />
              {showEnglish ? "Show" : "Hide"}
            </label>
          </div>

          <h3 className="text-sm font-bold  text-neutral">Provide hint</h3>
          <div
            className="flex gap-3 text-sm  "
            onClick={(e) => {
              setShowHint((prev) => !prev);
            }}
          >
            <label className="label">
              <input
                type="checkbox"
                className="toggle"
                checked={showHint}
                onChange={(e) => setShowHint(e.target.checked)}
              />
              {showHint ? "Show" : "Hide"}
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-4 text-black flex-col flex">
        <div className="flex items-center w-full mb-3">
          <h2 className="  whitespace-nowrap mr-2 ">Progress</h2>
          <progress
            className="progress progress-primary "
            value={questionNum + 1}
            max={problems.length}
          ></progress>
          <div className="badge badge-success whitespace-nowrap ml-2">
            ⭐Score: {score}
          </div>
        </div>
        <div className="mb-3">
          <h2 className="text-lg text-black">
            Directions: Put the words in the right order.
          </h2>
          {showEnglish && (
            <h3 className="text-lg text-black">
              👉English: {problems[questionNum]?.english}
            </h3>
          )}

          {showHint && (
            <h3 className="text-lg text-black">
              💡Hint: The first word is{" "}
              {problems[questionNum]?.arabic.split(" ")[0]}
            </h3>
          )}
        </div>
        <div>
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return;

              const { source } = event.operation;

              if (isSortable(source)) {
                const { initialIndex, index } = source;

                if (initialIndex !== index) {
                  setProblem((items) => {
                    let newItems = [...items];

                    const [removed] = newItems.splice(initialIndex, 1);

                    newItems.splice(index, 0, removed);

                    return newItems;
                  });
                }
              }
            }}
          >
            <ul className="border-b-4 border-black border-double">
              {problem &&
                problem.map((word, index) => {
                  return <Sortable key={word.id} word={word} index={index} />;
                })}
            </ul>
          </DragDropProvider>
        </div>
        <button
          className={` btn btn-sm mt-3 mx-auto  `}
          onClick={() => checkAnswer()}
        >
          Check Answer
        </button>

        {showAnswer && (
          <div
            className={`mt-4 p-3 rounded flex flex-col  ${
              isCorrect ? "bg-green-400" : "bg-red-400"
            }`}
          >
            <div>
              <strong>{isCorrect ? "Correct" : "Incorrect"}</strong>
            </div>
            <div className="text-sm ">You answered: {userAnswer}</div>
            <div className="text-sm mt-1">
              Expected: {problems[questionNum]?.arabic}
            </div>
            <div className="text-sm mt-1">
              English: {problems[questionNum]?.english}
            </div>
            <button
              className={` btn btn-sm mt-3 mx-auto `}
              onClick={() => {
                setShowAnswer(false);
                setIsCorrect(false);
                setUserAnswer([]);
                setQuestionNum((prev) =>
                  prev < problems.length - 1 ? prev + 1 : 0,
                );
              }}
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
