"use client";

import React, { useCallback, useMemo, useState } from "react";
import VerbConjugations from "@/data/VerbConjugations";

const TENSE_KEYS = ["presentTense", "pastTense", "futureTense"];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function handlePronouns(pronoun) {
  const pronounMap = {
    youM: "You (masculine)",
    youF: "You (feminine)",
    he: "He",
    she: "She",
    we: "We",
    they: "They",
    I: "I",
    youPl: "You (plural)",
  };
  return pronounMap[pronoun] || pronoun;
}

export default function VerbsQuizPage() {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [lastResult, setLastResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const makeQuestion = useCallback(() => {
    const verbItem = pickRandom(VerbConjugations);
    const tense = pickRandom(TENSE_KEYS);
    const pronounKeys = Object.keys(verbItem[tense] || {});
    const pronoun = pickRandom(pronounKeys);
    // Ask either for english (show arabic) or for arabic (show english)
    const direction = Math.random() < 0.5 ? "toEnglish" : "toArabic";

    return {
      verbItem,
      tense,
      pronoun,
      direction,
      // values for checking
      arabic: (verbItem[tense] && verbItem[tense][pronoun]?.arabic) || "",
      transliteration:
        (verbItem[tense] && verbItem[tense][pronoun]?.transliteration) || "",
      english: verbItem.english || "",
    };
  }, []);

  const [question, setQuestion] = useState(() => makeQuestion());

  const nextQuestion = useCallback(() => {
    setAnswerText("");
    setShowAnswer(false);
    setLastResult(null);
    setQuestion(makeQuestion());
  }, [makeQuestion]);

  const normalize = (s) => (s || "").toString().trim().toLowerCase();

  const checkAnswer = useCallback(
    (e) => {
      e?.preventDefault();
      const given = normalize(answerText);
      const correctEnglish = normalize(question.english);
      const correctArabic = normalize(question.arabic);
      const correctTrans = normalize(question.transliteration);
      const correctWithoutTo = correctEnglish.replace(/^to\s+/, "");

      let isCorrect = false;
      if (question.direction === "toEnglish") {
        // user should give the English infinitive (e.g. "to drink")
        if (given === correctEnglish || given === correctWithoutTo)
          isCorrect = true;
      } else {
        // user should give the Arabic conjugation OR transliteration
        if (given === correctArabic || given === correctTrans) isCorrect = true;
      }

      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
      setLastResult({
        isCorrect,
        given,
        expected:
          question.direction === "toEnglish"
            ? question.english
            : question.arabic,
      });
      setShowAnswer(true);
    },
    [answerText, question]
  );

  // Multiple-choice options for English->Arabic direction
  const mcOptions = useMemo(() => {
    if (!question || question.direction !== "toArabic") return [];
    const opts = new Set();
    const correctA = question.arabic;
    const correctT = question.transliteration;
    if (correctA) opts.add(correctA);
    if (correctT) opts.add(correctT);

    let tries = 0;
    while (opts.size < 4 && tries < 200) {
      const other = pickRandom(VerbConjugations);
      const val =
        other[question.tense] && other[question.tense][question.pronoun];
      if (val) {
        if (Math.random() < 0.5) opts.add(val.arabic);
        else opts.add(val.transliteration);
      }
      tries++;
    }

    const arr = shuffle(Array.from(opts)).slice(0, 4);
    if (!arr.some((o) => o && (o === correctA || o === correctT))) {
      arr[arr.length - 1] = correctA || correctT;
    }
    return arr;
  }, [question]);

  const handleChooseOption = useCallback(
    (option) => {
      if (!question) return;
      const given = (option || "").toString().trim().toLowerCase();
      const correctArabic = (question.arabic || "")
        .toString()
        .trim()
        .toLowerCase();
      const correctTrans = (question.transliteration || "")
        .toString()
        .trim()
        .toLowerCase();
      const isCorrect = given === correctArabic || given === correctTrans;
      setSelectedOption(option);
      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
      setLastResult({
        isCorrect,
        given: option,
        expected:
          question.direction === "toEnglish"
            ? question.english
            : question.arabic,
      });
      setShowAnswer(true);
    },
    [question]
  );

  const hint = useMemo(() => {
    if (!question) return null;
    return question.direction === "toEnglish"
      ? `Arabic: ${question.arabic} — (${question.transliteration})`
      : `English: ${question.english}`;
  }, [question]);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-neutral">
        Verb Conjugation Quiz
      </h1>

      <div className="bg-white p-6 rounded-lg shadow mb-4 bg-neutral">
        <div className="mb-3">
          <p>
            <strong>Tense:</strong>{" "}
            {question.tense.replace("Tense", "").charAt(0).toUpperCase() +
              question.tense.replace("Tense", "").slice(1)}
          </p>
          <p>
            <strong>Pronoun:</strong> {handlePronouns(question.pronoun)}
          </p>

          {question.direction === "toEnglish" ? (
            <p>
              <p className="">
                <strong>Arabic: </strong>
                {question.arabic} - {question.transliteration}
              </p>

              <p className="text-sm text-gray-500">
                Directions: Provide the English infinitive form of the verb.
              </p>
            </p>
          ) : (
            <>
              <p>
                <strong>Verb:</strong> {question.english}
              </p>
              <div className="text-sm text-gray-500">
                Directions: Translate into Arabic (transliteration accepted)
              </div>
            </>
          )}
        </div>

        {question.direction === "toEnglish" ? (
          <form onSubmit={checkAnswer} className="flex gap-1">
            <input
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="flex-1 input input-bordered w-fit"
              placeholder={
                question.direction === "toEnglish"
                  ? "Type English (e.g. to drink)"
                  : "Type Arabic or transliteration"
              }
            />
            <button type="submit" className="btn btn-primary">
              Check
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {mcOptions.map((opt, i) => {
                const isSelected = selectedOption === opt;
                let extra = "btn-ghost";
                if (showAnswer) {
                  const correctArabic = (question.arabic || "")
                    .toString()
                    .trim();
                  const correctTrans = (question.transliteration || "")
                    .toString()
                    .trim();
                  if (opt === correctArabic || opt === correctTrans)
                    extra = "bg-green-200";
                  else if (
                    isSelected &&
                    !(opt === correctArabic || opt === correctTrans)
                  )
                    extra = "bg-red-200";
                } else if (isSelected) extra = "btn-primary";

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleChooseOption(opt)}
                    className={`btn min-h-[48px] ${extra}`}
                    disabled={showAnswer}
                  >
                    <span className="text-lg border border-[white] p-2 rounded-xl">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showAnswer && lastResult && (
          <div
            className={`mt-4 p-3 rounded ${
              lastResult.isCorrect ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div>
              <strong>{lastResult.isCorrect ? "Correct" : "Incorrect"}</strong>
            </div>
            <div className="text-sm mt-1">
              Expected:{" "}
              {question.direction === "toEnglish"
                ? question.english
                : question.arabic}{" "}
              ({question.transliteration})
            </div>
            <div className="text-sm text-gray-600">
              You answered: {lastResult.given || "(no answer)"}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="badge badge-primary p-4">
            <strong>Score: </strong> {score.correct} / {score.total}
          </div>
        </div>
        <div>
          <button
            className="btn btn-sm mr-2"
            onClick={() => {
              setScore({ correct: 0, total: 0 });
              setLastResult(null);
            }}
          >
            Reset
          </button>
          <button
            className="btn btn-sm"
            onClick={() => {
              setQuestion(makeQuestion());
              setAnswerText("");
              setShowAnswer(false);
              setLastResult(null);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
