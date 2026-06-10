"use client";
import React, { useCallback, useMemo, useState } from "react";
import VerbConjugations from "@/data/VerbConjugations";

const TENSE_KEYS = ["presentTense", "pastTense", "futureTense"];
const PRONOUN_KEYS = ["I", "youM", "youF", "he", "she", "we", "they", "youPl"];

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
  const [answerChoiceType, setAnswerChoiceType] = useState("arabic");
  const [pronounFilter, setPronounFilter] = useState("all");
  const [tenseFilter, setTenseFilter] = useState("all");

  const makeQuestion = useCallback(
    (pronFilter = pronounFilter, tensFilter = tenseFilter) => {
      const verbItem = pickRandom(VerbConjugations);
      const tense = tensFilter === "all" ? pickRandom(TENSE_KEYS) : tensFilter;
      const pronoun =
        pronFilter === "all" ? pickRandom(PRONOUN_KEYS) : pronFilter;
      const direction = "toArabic";

      return {
        verbItem,
        tense,
        pronoun,
        direction,
        arabic: (verbItem[tense] && verbItem[tense][pronoun]?.arabic) || "",
        transliteration:
          (verbItem[tense] && verbItem[tense][pronoun]?.transliteration) || "",
        english: verbItem.english || "",
      };
    },
    [pronounFilter, tenseFilter],
  );

  const [question, setQuestion] = useState(() => makeQuestion());

  const mcOptions = useMemo(() => {
    if (!question || question.direction !== "toArabic") return [];
    const opts = new Set();
    const correctA = question.arabic;
    const correctT = question.transliteration;
    const correct = answerChoiceType === "arabic" ? correctA : correctT;
    opts.add(correct);

    let tries = 0;
    while (opts.size < 4 && tries < 200) {
      const otherVerb = pickRandom(VerbConjugations);
      const val =
        otherVerb[question.tense] &&
        otherVerb[question.tense][question.pronoun];

      if (val) {
        answerChoiceType === "arabic"
          ? opts.add(
              question.verbItem[question.tense][pickRandom(PRONOUN_KEYS)]
                .arabic,
            )
          : opts.add(
              question.verbItem[question.tense][pickRandom(PRONOUN_KEYS)]
                .transliteration,
            );
      }
      tries++;
    }

    const arr = shuffle(Array.from(opts)).slice(0, 4);
    if (!arr.some((o) => o && (o === correctA || o === correctT))) {
      arr[arr.length - 1] = correctA || correctT;
    }
    return arr;
  }, [question, answerChoiceType]);

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
    [question],
  );

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-neutral">
        Verb Conjugation Quiz
      </h1>

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
            Choose answer choice type
          </h3>
          <div className="flex gap-3 text-sm ">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="radio-2"
                className="radio radio-sm radio-primary"
                defaultChecked
                onClick={() => setAnswerChoiceType("arabic")}
              />
              <p>Arabic</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="radio-2"
                className="radio radio-sm radio-primary"
                onClick={() => setAnswerChoiceType("transliteration")}
              />
              <p>Transliteration</p>
            </div>
          </div>
          <h3 className="text-sm font-bold  text-neutral">
            Choose pronoun or skip to cycle through all.
          </h3>
          <div className="flex gap-3 text-sm ">
            <select
              className="select text-sm bg-[white] border-1 border-neutral "
              onChange={(e) => {
                const newFilter = e.target.value;
                setPronounFilter(newFilter);
                setQuestion(makeQuestion(newFilter, tenseFilter));
                setShowAnswer(false);
                setSelectedOption(null);
              }}
            >
              <option value="all" defaultChecked>
                All
              </option>
              <option value="I">I</option>
              <option value="youM">You (masculine)</option>
              <option value="youF">You (feminine)</option>
              <option value="he">He</option>
              <option value="she">She</option>
              <option value="we">We</option>
              <option value="they">They</option>
              <option value="youPl">You (plural)</option>
            </select>
          </div>
          <h3 className="text-sm font-bold  text-neutral">
            Choose tense or skip to cycle through all.
          </h3>
          <div className="flex gap-3 text-sm ">
            <select
              className="select text-sm bg-[white] border-1 border-neutral "
              onChange={(e) => {
                const newFilter = e.target.value;
                setTenseFilter(newFilter);
                setQuestion(makeQuestion(pronounFilter, newFilter));
                setShowAnswer(false);
                setSelectedOption(null);
              }}
            >
              <option value="all" defaultChecked>
                All
              </option>
              <option value="presentTense">Present Tense</option>
              <option value="pastTense">Past Tense</option>
              <option value="futureTense">Future Tense</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-4 text-black flex-col">
        <div className="mb-3">
          <h2 className="text-lg text-black ">
            Directions: Translate into Arabic
          </h2>
          <div className={showAnswer ? "blur-text" : ""}>
            <p>
              <strong>Tense:</strong>{" "}
              {question.tense.replace("Tense", "").charAt(0).toUpperCase() +
                question.tense.replace("Tense", "").slice(1)}
            </p>
            <p>
              <strong>Pronoun:</strong> {handlePronouns(question.pronoun)}
            </p>

            <p>
              <strong>Verb:</strong> {question.english}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {mcOptions.map((opt, i) => {
              const isSelected = selectedOption === opt;
              let extra = "btn-ghost";
              if (showAnswer) {
                const correctArabic = (question.arabic || "").toString().trim();
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
                  className={`btn min-h-[48px] ${extra} border border-secondary p-2`}
                  disabled={showAnswer}
                >
                  <span className="text-lg  rounded-xl">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {showAnswer && lastResult && (
          <div
            className={`mt-4 p-3 rounded ${
              lastResult.isCorrect ? "bg-green-400" : "bg-red-400"
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
            <div className="text-sm ">
              You answered: {lastResult.given || "(no answer)"}
            </div>
          </div>
        )}

        <button
          className={
            showAnswer
              ? `w-full btn btn-sm mt-3 mx-auto  `
              : `w-full btn btn-sm mt-3 mx-auto hidden disabled `
          }
          onClick={() => {
            setQuestion(makeQuestion());
            setAnswerText("");
            setShowAnswer(false);
            setLastResult(null);
          }}
        >
          Next Question
        </button>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 ">
        <div className="badge badge-primary p-4">
          <strong>
            Score: {score.correct} / {score.total}
          </strong>
        </div>

        <div>
          <button
            className="btn btn-sm mr-2"
            onClick={() => {
              setScore({ correct: 0, total: 0 });
              setLastResult(null);
            }}
          >
            Reset Game
          </button>
        </div>
      </div>
    </main>
  );
}
