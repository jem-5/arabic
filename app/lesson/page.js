"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { freeModules } from "@/data/AllModules";
import { useAuthContext } from "@/context/AuthContext";
import { Profile } from "@/components/Profile";
import MyButton from "@/components/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import confetti from "canvas-confetti";
import Image from "next/image";
import CulturalNotes from "@/data/CulturalNotes";

export default function Lesson() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Greetings";
  const [questionNum, setQuestionNum] = useState(0);
  const { user, isPaidMember, userProfile, refetchUser } = useAuthContext();
  const router = useRouter();
  const [tip, setTip] = useState(null);

  const [savedWords, setSavedWords] = useState(
    JSON.parse(localStorage.getItem("savedWords") || "[]")
  );
  const [isWordSaved, setIsWordSaved] = useState(false);

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
      console.log(canonicalUrl);
    }
  }, [pathname, topic]);

  const saveProgress = async () => {
    const usersRef = collection(db, "users");
    const userDoc = doc(db, "users", user.uid);
    const profileExists = !!userProfile;
    if (profileExists) {
      await updateDoc(userDoc, {
        reviewedModules: arrayUnion(topic),
      });
    } else {
      await setDoc(doc(usersRef, user.uid), {
        reviewedModules: [topic],
      });
    }
    // refresh context profile after writes
    if (refetchUser && user?.uid) await refetchUser(user.uid);
  };

  useEffect(() => {
    const englishWord = AllModules[topic][questionNum].english;
    const currentTip = CulturalNotes[englishWord] || null;
    setTip(currentTip);
  }, [questionNum]);

  useEffect(() => {
    if (!savedWords) return;
    setIsWordSaved(
      savedWords.some(
        (word) => word.english === AllModules[topic][questionNum].english
      )
    );
  }, [questionNum]);

  useEffect(() => {
    localStorage.setItem("savedWords", JSON.stringify(savedWords));
  }, [savedWords]);

  useEffect(() => {
    if (!user) return;
    const stored = JSON.parse(localStorage.getItem("savedWords") || "[]");
    setSavedWords(stored);
  }, [user]);

  const handleToggleSave = () => {
    if (isWordSaved) {
      const filteredWords = savedWords.filter(
        (word) => word.english !== AllModules[topic][questionNum].english
      );
      setSavedWords(filteredWords);
      setIsWordSaved(false);
      return;
    } else {
      setSavedWords((prev) =>
        Array.from(new Set([...prev, AllModules[topic][questionNum]]))
      );
      setIsWordSaved(true);
    }
  };

  const celebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        y: 0.6,
      },
    });
  };

  const handleClickNext = (e) => {
    e.preventDefault();
    if (questionNum < AllModules[topic].length - 1)
      setQuestionNum((prev) => prev + 1);

    if (questionNum === AllModules[topic].length - 1) {
      user ? saveProgress() : null;
      celebrate();
      router.push("/dashboard");
    }
  };

  const handleClickPrevious = (e) => {
    e.preventDefault();
    if (questionNum > 0) setQuestionNum((prev) => prev - 1);
  };

  const playAudio = () => {
    let audio = new Audio(AllModules[topic][questionNum].audio);

    audio.playbackRate = 1;
    audio.play();
  };

  const playSlowAudio = () => {
    let audio = new Audio(AllModules[topic][questionNum].audio);
    audio.playbackRate = 0.5;
    audio.play();
  };

  useEffect(() => {
    playAudio();
  }, [questionNum]);

  const chooseRandomMascot = () => {
    const randomSelection = Math.floor(Math.random() * 13);
    return `/images/mascots/${randomSelection}.jpg`;
  };

  // Memoize mascot selection so it doesn't change on unrelated re-renders
  const mascotSrc = useMemo(() => {
    const moduleItem = AllModules[topic]
      ? AllModules[topic][questionNum]
      : null;
    if (moduleItem && moduleItem.image) return moduleItem.image;
    // stable random for the current topic+question combination until those change
    const randomSelection = Math.floor(Math.random() * 13);
    return `/images/mascots/${randomSelection}.jpg`;
  }, [topic, questionNum]);

  return (
    <main className="flex-grow flex flex-col items-center p-2 ">
      <div className="flex items-center mt-4 w-full flex-col md:flex-row md:justify-between ">
        <h3 className="font-bold text-lg text-neutral">MODULE: {topic}</h3>
        <h3 className="font-bold text-lg align-end justify-end  text-neutral">
          {questionNum + 1} /{" "}
          {AllModules[topic] ? AllModules[topic].length : null}
        </h3>
      </div>
      <div className="divider m-0 p-0"></div>

      {!isPaidMember && !Object.keys(freeModules).includes(topic) ? (
        <div className="alert alert-warning shadow-lg w-full">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              This module is only available to paid members.{" "}
              <Link href="/pricing" className="underline">
                Upgrade now
              </Link>
            </span>
          </div>
        </div>
      ) : (
        <div className="card p-2 max-w-96 md:max-w-xl   ">
          <div className="card md:card-side    w-full shadow-xl bg-neutral  ">
            <div className="card-body flex flex-col justify-between  w-full  ">
              <div className="text-2xl flex justify-between items-baseline gap-2">
                {AllModules[topic]
                  ? AllModules[topic][questionNum].english
                  : null}
                <Image
                  src={isWordSaved ? "/save-filled.png" : "/save.png"}
                  alt="save icon"
                  width={16}
                  height={20}
                  className="inline-block object-contain hover:scale-110 hover:cursor-pointer"
                  onClick={handleToggleSave}
                />
              </div>
              <div className="flex items-center justify-end">
                <div className="chat chat-start ">
                  <div className="chat-bubble bg-secondary text-xl">
                    {AllModules[topic]
                      ? AllModules[topic][questionNum].arabic
                      : null}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-end gap-2">
                <button
                  className="text-md hover:cursor-pointer hover:scale-110 transition-transform"
                  onClick={playAudio}
                >
                  1x🔊
                </button>
                <button
                  className="text-md hover:cursor-pointer hover:scale-110 transition-transform"
                  onClick={playSlowAudio}
                >
                  0.5x🔊
                </button>
              </div>
              <div className="text-1xl text-right place-content-end">
                {AllModules[topic][questionNum].transliteration
                  ? AllModules[topic][questionNum].transliteration
                  : null}
              </div>
            </div>
            <figure>
              <img className="" src={mascotSrc} alt="arabic greeting" />
            </figure>
          </div>
          {tip && (
            <div className="bg-neutral p-2 mt-1 card m-auto ">💡{tip}</div>
          )}
          <div className="flex flex-row justify-between mt-1 w-full">
            <MyButton
              classRest={questionNum === 0 ? "invisible" : "visible"}
              text={
                <svg
                  className="w-5 h-5 text-gray-800 dark:text-white"
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
              }
              func={handleClickPrevious}
            />

            <MyButton
              classRest="bg-neutral"
              text={
                <svg
                  className="w-5 h-5 text-gray-800 dark:text-white"
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
              }
              func={handleClickNext}
            />
          </div>
        </div>
      )}
      <div className="divider "></div>

      <MyButton
        text="Go Back"
        func={() => router.push("/dashboard")}
        classRest="h-12 bg-neutral"
      />
    </main>
  );
}
