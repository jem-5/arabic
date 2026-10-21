"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import VerbConjugations from "@/data/VerbConjugations";
import Recorder from "@/components/Recorder";

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

export default function SayVerbPage() {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [scoreFromRecorder, setScoreFromRecorder] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerChoiceType, setAnswerChoiceType] = useState("arabic");
  const [pronounFilter, setPronounFilter] = useState("all");
  const [tenseFilter, setTenseFilter] = useState("all");
  const [recognizedWord, setRecognizedWord] = useState("");
  const [whisperBlob, setWhisperBlob] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionNum, setQuestionNum] = useState(0);

  const filteredQuestions = useMemo(() => {
    const numQuestions = 40;

    const questions = VerbConjugations.flatMap((verbItem) => {
      const tenses = tenseFilter === "all" ? TENSE_KEYS : [tenseFilter];

      const pronouns = pronounFilter === "all" ? PRONOUN_KEYS : [pronounFilter];

      return tenses.flatMap((tense) =>
        pronouns
          .filter((pronoun) => verbItem[tense]?.[pronoun]?.arabic)
          .map((pronoun) => ({
            verbItem,
            tense,
            pronoun,
            direction: "toArabic",
            arabic: verbItem[tense][pronoun].arabic,
            english: verbItem.english || "",
          })),
      );
    });
    return shuffle(questions).slice(0, numQuestions);
  }, [tenseFilter, pronounFilter]);

  const totalQuestions = filteredQuestions.length;

  const handleScoreFromRecorder = (data) => {
    console.log(data);
    setScoreFromRecorder(data);
    data >= 70 ? setIsCorrect(true) : setIsCorrect(false);
    setScore((s) => ({
      correct: s.correct + (data >= 70 ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const handleGrading = () => {
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const makeQuestion = useCallback(
    (questions = filteredQuestions, index = 0) => {
      if (questions.length === 0) return null;
      return questions[index % questions.length];
    },
    [filteredQuestions],
  );

  const [question, setQuestion] = useState(() =>
    makeQuestion(filteredQuestions, 0),
  );

  const handleAudio = (option) => {
    if (!question) return;
    const given = (option || "").toString().trim().toLowerCase();
    const correctArabic = (question.arabic || "")
      .toString()
      .trim()
      .toLowerCase();

    setLastResult({
      isCorrect,
      given: option,
      expected: question.arabic,
    });
    setShowAnswer((prev) => true);
  };

  useEffect(() => {
    handleAudio(recognizedWord);
  }, [recognizedWord]);

  useEffect(() => {
    setQuestion(makeQuestion(filteredQuestions, 0));
    setQuestionNum(0);
    setShowAnswer(false);
    setSelectedOption(null);
    setRecognizedWord("");
    setAnswerText("");
  }, [filteredQuestions, makeQuestion]);

  const formattedTense = question?.tense
    ? question.tense
        .replace("Tense", "")
        .replace(/^./, (char) => char.toUpperCase())
    : "";

  return (
    <main className="p-6 max-w-3xl mx-auto mb-auto">
      <div className="flex justify-between items-baseline">
        {" "}
        <h1 className="text-2xl font-bold mb-4 text-neutral">
          Say the Verb Quiz
        </h1>
        <h3 className=" text-neutral font-bold">
          {questionNum + 1} / {totalQuestions}
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
            Choose pronoun or skip to cycle through all.
          </h3>
          <div className="flex gap-3 text-sm ">
            <select
              className="select text-sm bg-[white] border-1 border-neutral "
              value={pronounFilter}
              onChange={(e) => {
                setPronounFilter(e.target.value);
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
              value={tenseFilter}
              onChange={(e) => {
                setTenseFilter(e.target.value);
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
        <div className="flex items-center w-full mb-3">
          <h2 className="  whitespace-nowrap mr-2 ">Progress</h2>
          <progress
            className="progress progress-primary "
            value={questionNum + 1}
            max={filteredQuestions.length}
          ></progress>
          <div className="badge badge-success whitespace-nowrap ml-2">
            ⭐Score: {score.correct}
          </div>
        </div>
        <div className="mb-3">
          <h2 className="text-lg text-black ">
            Directions: Translate into Arabic
          </h2>
          <div>
            <p>
              <strong>Tense:</strong> {formattedTense}
            </p>
            <p>
              <strong>Pronoun:</strong> {handlePronouns(question?.pronoun)}
            </p>

            <p>
              <strong>Verb:</strong> {question?.english}
            </p>
          </div>
        </div>

        <Recorder
          onRecognized={(word) => {
            setRecognizedWord(word);
          }}
          onBlobReady={(blob) => setWhisperBlob(blob)}
          currentWord={question?.arabic}
          onSendData={handleScoreFromRecorder}
        />
      </div>

      <div className="flex flex-row justify-between w-full">
        <button
          className={` btn btn-sm mt-3    `}
          onClick={() => {
            setScore({ correct: 0, total: 0 });
            setLastResult(null);
          }}
        >
          Reset Game
        </button>

        <button
          className={` btn btn-sm mt-3   `}
          disabled={totalQuestions === 0}
          onClick={() => {
            const nextIndex = (questionNum + 1) % totalQuestions;
            setQuestion(makeQuestion(filteredQuestions, nextIndex));
            setAnswerText("");
            setShowAnswer(false);
            setLastResult(null);
            setQuestionNum(nextIndex);
          }}
        >
          Next Question
        </button>
      </div>
    </main>
  );
}
