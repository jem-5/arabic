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
} from "firebase/firestore";
import Link from "next/link";
import { AllModules } from "@/data/AllModules";
import { useAuthContext } from "@/context/AuthContext";
import { DisplayProfile } from "@/components/DisplayProfile";

export default function Lesson({ searchParams }) {
  const topic = searchParams?.topic;
  const [questionNum, setQuestionNum] = useState(0);
  const { user } = useAuthContext();

  const saveProgress = async () => {
    const usersRef = collection(db, "users");
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
      console.log("updating..");
      await updateDoc(userDoc, {
        reviewedModules: arrayUnion(topic),
      });
    } else {
      await setDoc(doc(usersRef, user.uid), {
        reviewedModules: [topic],
      });
    }
  };

  const handleClickNext = (e) => {
    e.preventDefault();
    if (questionNum < AllModules[topic].length - 1)
      setQuestionNum((prev) => prev + 1);
    if (questionNum === AllModules[topic].length - 1) setQuestionNum(0);
    if (questionNum === AllModules[topic].length - 2) {
      saveProgress();
    }
  };

  const handleClickPrevious = (e) => {
    e.preventDefault();
    if (questionNum > 0) setQuestionNum((prev) => prev - 1);
  };

  const playAudio = () => {
    let audio = new Audio(AllModules[topic][questionNum].audio);
    audio.play();
  };
  useEffect(() => {
    playAudio();
  }, [questionNum]);

  const chooseRandomMascot = () => {
    const randomSelection = Math.floor(Math.random() * 13);
    return `./images/mascots/${randomSelection}.jpg`;
  };

  return (
    <main className="flex-grow flex flex-col items-center ">
      <div className="flex flex-row justify-between mt-4 w-full">
        <h3 className="font-bold text-lg text-neutral">MODULE: {topic}</h3>
        <h3 className="font-bold text-lg align-end justify-end  text-neutral">
          {questionNum + 1} / {AllModules[topic].length}
        </h3>
      </div>
      <div className="divider"></div>
      <div className="card card-side bg-base-100 shadow-xl bg-neutral w-full">
        <div className="card-body flex flex-col ">
          <h2 className="card-title self-end ">
            <div className="chat chat-end ">
              <div className="chat-bubble bg-secondary  ">
                {AllModules[topic][questionNum].arabic}
              </div>
            </div>
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
          </h2>
          <p className="text-2xl self-start">
            {AllModules[topic][questionNum].english}
          </p>
        </div>
        <figure>
          <img
            className="w-56"
            src={
              AllModules[topic][questionNum].image
                ? AllModules[topic][questionNum].image
                : chooseRandomMascot()
            }
            alt="arabic greeting"
          />
        </figure>
      </div>

      <div className="flex flex-row justify-between mt-4 w-full">
        <button
          className={`btn btn-active btn-secondary self-start ${
            questionNum === 0 ? "invisible" : "visible"
          }
          `}
          onClick={handleClickPrevious}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
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
              d="m15 19-7-7 7-7"
            />
          </svg>
        </button>{" "}
        <button
          className="btn btn-active btn-secondary self-end "
          onClick={handleClickNext}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
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
              d="m9 5 7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="divider"></div>

      <button className="btn btn-secondary mb-1">Start Quiz</button>
      <button className="btn btn-secondary">
        <Link href="/">Go Home</Link>
      </button>
      <DisplayProfile />
    </main>
  );
}
