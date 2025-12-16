"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
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

import Image from "next/image";
import CulturalNotes from "@/data/CulturalNotes";
import Meyda from "meyda";
import { useSwipeable } from "react-swipeable";
import confetti from "canvas-confetti";
import Recorder from "@/components/Recorder";

export default function Lesson() {
  const [recognizedWord, setRecognizedWord] = useState("");
  const [whisperBlob, setWhisperBlob] = useState(null);

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
  const confettiRef = useRef(null);
  // const [recording, setRecording] = useState(false);
  // const [audioURL, setAudioURL] = useState(null);
  // Keep recorder/stream/chunks in refs so they persist across renders
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);
  // const [score, setScore] = useState(null);
  // const [feedback, setFeedback] = useState("");
  // const audioContextRef = useRef(
  //   new (window.AudioContext || window.webkitAudioContext)()
  // );
  // const nativeFeaturesRef = useRef(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const [animateIn, setAnimateIn] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleClickNext(),
    onSwipedRight: () => handleClickPrevious(),

    // important
    delta: 50, // minimum px before counting it as swipe
    preventScrollOnSwipe: false, // allow vertical scroll
    trackTouch: true,
    trackMouse: false, // mobile only to avoid weird desktop behavior
  });

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
    setRecognizedWord("");
    // setAudioURL(null);
    // setScore(null);
    // setFeedback("");
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
    setSwipeDirection("left");
    setTimeout(() => {
      setSwipeDirection(null);
    }, 200);
    // setAnimateIn(true);
    setTimeout(() => setAnimateIn(true), 200);
    setTimeout(() => setAnimateIn(false), 400);
    // e may be undefined when called programmatically (swipe handlers or
    // imperative calls). Guard against that before calling preventDefault.
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (questionNum < AllModules[topic].length - 1) {
      setQuestionNum((prev) => prev + 1);
      return;
    }

    // If we're already at the last question, save/celebrate and navigate.
    if (questionNum === AllModules[topic].length - 1) {
      if (user) saveProgress();
      celebrate();

      router.push("/dashboard");
    }
  };

  const handleClickPrevious = (e) => {
    setSwipeDirection("right");
    setTimeout(() => {
      setSwipeDirection(null);
    }, 200);
    // setAnimateIn(true);
    setTimeout(() => setAnimateIn(true), 200);
    setTimeout(() => setAnimateIn(false), 400);

    if (e && typeof e.preventDefault === "function") e.preventDefault();
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

  const mascotSrc = useMemo(() => {
    const moduleItem = AllModules[topic]
      ? AllModules[topic][questionNum]
      : null;
    if (moduleItem && moduleItem.image) return moduleItem.image;
    const randomSelection = Math.floor(Math.random() * 13);
    return `/images/mascots/${randomSelection}.jpg`;
  }, [topic, questionNum]);

  return (
    <main className="flex-grow flex flex-col items-center p-2 ">
      <div className="flex flex-row mt-2 w-full px-3 justify-between ">
        <h3 className="font-bold text-lg text-[white]">MODULE: {topic}</h3>
        <h3 className="font-bold text-lg align-end justify-end text-[white]">
          {questionNum + 1} /{" "}
          {AllModules[topic] ? AllModules[topic].length : null}
        </h3>
      </div>

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
        <div className="card p-2 md:max-w-3xl   ">
          <div
            {...handlers}
            className={`
    w-full 
    transition-all duration-300 ease-out
    ${swipeDirection === "left" ? "-translate-x-10 opacity-50" : ""}
    ${swipeDirection === "right" ? "translate-x-10 opacity-50" : ""}
        ${animateIn ? "animate-scaleIn" : ""}

        `}
          >
            {questionNum < 3 && (
              <div className="text-center text-[black] text-sm animate-pulse">
                Swipe to proceed →
              </div>
            )}
            <div className="card md:card-side    w-full shadow-xl bg-neutral  ">
              <div className="card-body flex flex-col justify-between  w-full  ">
                <div className="text-4xl flex justify-between items-baseline gap-2">
                  {AllModules[topic]
                    ? AllModules[topic][questionNum].english
                    : null}
                  <Image
                    src={isWordSaved ? "/save-filled.png" : "/save.png"}
                    alt="save icon"
                    width={20}
                    height={30}
                    className="inline-block  hover:scale-110 hover:cursor-pointer  "
                    onClick={handleToggleSave}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <div className="chat chat-end  ">
                    <div className="chat-bubble  bg-secondary text-4xl text-[white] ">
                      {AllModules[topic]
                        ? AllModules[topic][questionNum].arabic
                        : null}
                    </div>
                  </div>
                </div>

                <div className="text-2xl text-right place-content-end italic">
                  {AllModules[topic][questionNum].transliteration
                    ? AllModules[topic][questionNum].transliteration
                    : null}
                </div>

                <div className="flex items-center justify-end gap-2">
                  Listen:
                  <button
                    className="text-2xl  bg-[black]    p-2 rounded-full hover:cursor-pointer hover:scale-110 transition-transform"
                    onClick={playAudio}
                  >
                    1x🔊
                  </button>
                  <button
                    className="text-2xl hover:cursor-pointer bg-[black]    p-2 rounded-full hover:scale-110 transition-transform"
                    onClick={playSlowAudio}
                  >
                    0.5x🔊
                  </button>
                </div>

                <hr />
                {questionNum < 3 && (
                  <div className="text-sm italic text-right">
                    Note: User-recorded audio is not saved or shared.
                  </div>
                )}
                <div className="p-1">
                  <Recorder
                    onRecognized={(word) => setRecognizedWord(word)}
                    onBlobReady={(blob) => setWhisperBlob(blob)}
                    currentWord={AllModules[topic][questionNum].arabic}
                  />
                </div>
                <div className="p-1">
                  {/* Only render Whisper transcriber when we have a blob to transcribe */}
                  {/* <WhisperTranscriberClient
                    inputBlob={whisperBlob}
                    onTranscribed={(txt) => {
                      setRecognizedWord(txt);
                      setWhisperBlob(null);
                    }}
                  /> */}
                </div>
              </div>
              <figure>
                <img
                  className="w-1/2 sm:w-2/3 md:w-full "
                  src={mascotSrc}
                  alt="arabic greeting"
                />
              </figure>
            </div>
          </div>
          {tip && (
            <div className="bg-neutral p-2 mt-1 card m-auto ">💡{tip}</div>
          )}
          <div className="flex flex-row justify-between mt-1 w-full">
            <MyButton
              classRest={questionNum === 0 ? "invisible" : "visible"}
              text={
                <svg
                  className="w-5 h-5 "
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
                  className="w-5 h-5"
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
