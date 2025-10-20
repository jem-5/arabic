"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  setDoc,
  getDoc,
  deleteDoc,
  deleteField,
  arrayRemove,
} from "firebase/firestore";
import Link from "next/link";
import { AllModules } from "@/data/AllModules";
import { useAuthContext } from "@/context/AuthContext";
import { Profile } from "@/components/Profile";
import MyButton from "@/components/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { QuestionAlert } from "@/components/QuestionAlert";

export default function Quiz() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Greetings";

  const [questionNum, setQuestionNum] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questionLang, setQuestionLang] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [questionsWrong, setQuestionsWrong] = useState([]);
  const { user } = useAuthContext();
  const router = useRouter();

  const pathname = usePathname();
  const baseUrl = "https://arabicroad.com";

  useEffect(() => {
    const canonicalUrl = `${baseUrl}${pathname}?topic=${topic}`;
    let link = document.querySelector("link[rel='canonical']");

    if (link) {
      link.setAttribute("href", canonicalUrl);
    } else {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonicalUrl);
      document.head.appendChild(link);
    }
  }, [pathname, topic]);

  let statusWidth = 75;
  let statusHeight = 75;

  const saveProgress = async () => {
    const usersRef = collection(db, "users");
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    if (questionsWrong.length === 0) {
      if (userSnap.exists()) {
        await updateDoc(userDoc, {
          [topic]: deleteField(),
          completedModules: arrayUnion(topic),
        });
      } else {
        await setDoc(doc(usersRef, user.uid), {
          completedModules: [topic],
        });
      }
    } else {
      if (userSnap.exists()) {
        await updateDoc(userDoc, {
          [topic]: questionsWrong,
          completedModules: arrayRemove(topic),
        });
      } else {
        await setDoc(doc(usersRef, user.uid), {
          [topic]: questionsWrong,
        });
      }
    }
  };

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  useEffect(() => {
    shuffleArray(AllModules[topic]);
    getRandomLang();
  }, []);

  useEffect(() => {
    if (questionNum === AllModules[topic].length - 1) saveProgress();
  }, [questionsWrong, questionNum]);

  const getRandomLang = () => {
    const randomLang = ["english", "arabic"][Math.floor(Math.random() * 2)];
    setQuestionLang(randomLang);
    populateAnswers(randomLang, questionNum);
    return randomLang;
  };

  const generateRandomAnswer = () => {
    let randomIndex = Math.floor(Math.random() * AllModules[topic].length);
    const randomAnswer = AllModules[topic][randomIndex];
    return randomAnswer;
  };

  const populateAnswers = (lang, questionNum) => {
    const randomSpot = Math.floor(Math.random() * 4);
    let answerLang = lang === "english" ? "arabic" : "english";
    let correctAnswer = AllModules[topic][questionNum][answerLang];
    let answerArr = [0, 0, 0, 0];
    answerArr[randomSpot] = correctAnswer;

    for (let i = 0; i < 4; i++) {
      if (i !== randomSpot) {
        let randomAnswer = generateRandomAnswer();

        while (answerArr.includes(randomAnswer[answerLang])) {
          randomAnswer = generateRandomAnswer();
        }
        answerArr[i] = randomAnswer[answerLang];
        if (!answerArr.includes(0)) break;
      }
    }
    setAnswers(answerArr);
  };

  const checkAnswer = (e) => {
    let answerLang = questionLang === "english" ? "arabic" : "english";
    let correctAnswer = AllModules[topic][questionNum][answerLang];
    if (e.target.innerText.trim() === correctAnswer.trim()) {
      setScore((prev) => prev + 1);
      setStatus("correct");
    } else {
      setQuestionsWrong((prev) => prev.concat(AllModules[topic][questionNum]));
      setStatus("wrong");
    }
    setTimeout(() => advanceQuestion(), 500);
  };

  const advanceQuestion = () => {
    setStatus("");
    if (questionNum === AllModules[topic].length - 1) {
      endQuiz();
      return;
    }
    setQuestionNum((prev) => prev + 1);
    const lang = getRandomLang();
    populateAnswers(lang, questionNum + 1);
  };

  const endQuiz = () => {
    document.getElementById("quiz_summary").showModal();
  };

  const playAudio = () => {
    let audio = new Audio(AllModules[topic][questionNum].audio);
    audio.play();
  };

  const playAnswerAudio = (word) => {
    const matchWord = (item) => item.arabic === word;
    const idx = AllModules[topic].findIndex(matchWord);
    if (idx > -1) {
      let audio = new Audio(AllModules[topic][idx].audio);
      audio.play();
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center p-2 min-w-80 ">
      <div className="flex items-center mt-4 w-full flex-col md:flex-row md:justify-between  ">
        <h3 className="font-bold text-lg text-neutral">QUIZ: {topic}</h3>
        <h3 className="font-bold text-lg align-end justify-end  text-neutral">
          {questionNum + 1} /{" "}
          {AllModules[topic] ? AllModules[topic].length : null}
        </h3>
      </div>
      <div className="divider"></div>

      <h3 className="font-bold text-lg align-end justify-end  text-neutral">
        Total Correct: {score}
      </h3>

      <div className="card bg-neutral w-full shadow-xl flex flex-col justify-center items-center">
        <div className="card-body flex flex-col justify-center items-center">
          <h2 className="card-title ">
            {AllModules[topic][questionNum][questionLang]}
            {questionLang === "arabic" ? (
              <svg
                onClick={playAudio}
                className="w-8 h-8 text-gray-800 dark:text-white cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"
                />
              </svg>
            ) : null}
          </h2>

          <div className="card-actions flex flex-col items-center w-full   ">
            <div className="flex flex-row items-center justify-center gap-3 w-full  ">
              <MyButton
                classRest="bg-secondary  "
                func={checkAnswer}
                text={answers[0]}
              />
              {questionLang === "english" ? (
                <svg
                  onClick={() => playAnswerAudio(answers[0])}
                  className="w-8 h-8 text-gray-800 dark:text-white cursor-pointer   "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"
                  />
                </svg>
              ) : null}
            </div>

            <div className="flex flex-row items-center justify-center gap-3 w-full  ">
              <MyButton
                text={answers[1]}
                classRest="bg-secondary  "
                func={checkAnswer}
              />
              {questionLang === "english" ? (
                <svg
                  onClick={() => playAnswerAudio(answers[1])}
                  className="w-8 h-8 text-gray-800 dark:text-white cursor-pointer  "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"
                  />
                </svg>
              ) : null}
            </div>

            <div className="flex flex-row items-center justify-center gap-3 w-full  ">
              <MyButton
                text={answers[2]}
                classRest="bg-secondary  "
                func={checkAnswer}
              />
              {questionLang === "english" ? (
                <svg
                  onClick={() => playAnswerAudio(answers[2])}
                  className="w-8 h-8 text-gray-800 dark:text-white cursor-pointer   "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"
                  />
                </svg>
              ) : null}
            </div>
            <div className="flex flex-row items-center justify-center gap-3 w-full  ">
              <MyButton
                text={answers[3]}
                classRest="bg-secondary"
                func={checkAnswer}
              />
              {questionLang === "english" ? (
                <svg
                  onClick={() => playAnswerAudio(answers[3])}
                  className="w-8 h-8 text-gray-800 dark:text-white cursor-pointer "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"
                  />
                </svg>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {status === "correct" ? (
        <img
          src="/checkmark.png"
          alt="check"
          width={statusWidth}
          height={statusHeight}
        />
      ) : status === "wrong" ? (
        <img
          src="/xmark.png"
          alt="x"
          width={statusWidth}
          height={statusHeight}
        />
      ) : (
        <img
          src="/clear.png"
          alt="x"
          width={statusWidth}
          height={statusHeight}
        />
      )}

      <div className="divider  "></div>

      <MyButton
        text="Go Back"
        func={() => router.push("/dashboard")}
        classRest="h-12 bg-neutral"
      />

      <dialog id="quiz_summary" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg py-2">Quiz Summary: {topic}</h3>

          <p className="py-2">Total Correct: {score}</p>
          <p className="py-2">Total Incorrect: {questionsWrong.length}</p>
          {questionsWrong.length > 0 ? (
            <p className="py-2">
              Words to Review: These will be added to your profile page.{" "}
            </p>
          ) : null}

          {questionsWrong.map((item, i) => (
            <QuestionAlert item={item} key={i} />
          ))}
          <div className="modal-action ">
            <form method="dialog" className="flex flex-row gap-3">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => router.push("/dashboard/")}
              >
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </main>
  );
}
