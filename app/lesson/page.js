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
import confetti from "canvas-confetti";
import Image from "next/image";
import CulturalNotes from "@/data/CulturalNotes";
import Meyda from "meyda";
import MirrorPronounce from "@/components/MirrorPronounce";
import { useSwipeable } from "react-swipeable";

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

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  // Keep recorder/stream/chunks in refs so they persist across renders
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const audioContextRef = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const nativeFeaturesRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleClickNext(),
    onSwipedRight: () => handleClickPrevious(),

    // important
    delta: 50, // minimum px before counting it as swipe
    preventScrollOnSwipe: false, // allow vertical scroll
    trackTouch: true,
    trackMouse: false, // mobile only to avoid weird desktop behavior
  });

  const analyzeNativeAudio = async () => {
    const url = AllModules[topic][questionNum].audio;
    try {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(buffer);
      const data = audioBuffer.getChannelData(0);
      const features = Meyda.extract(["mfcc"], data, {
        bufferSize: 512,
        sampleRate: audioBuffer.sampleRate,
      });
      // store the raw mfcc array (features may be an object with .mfcc)
      nativeFeaturesRef.current = features?.mfcc || features || null;
    } catch (err) {
      console.warn("analyzeNativeAudio failed:", err);
      nativeFeaturesRef.current = null;
    }
  };

  // 🔹 Step 2: Play native audio
  const playNative = async () => {
    let nativeAudio = new Audio(AllModules[topic][questionNum].audio);
    const audio = new Audio(nativeAudio);
    audio.play();
    if (!nativeFeaturesRef.current) await analyzeNativeAudio();
  };

  const startRecording = async () => {
    // If already recording, ignore or stop previous first
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      (async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const blobUrl = URL.createObjectURL(blob);
        setAudioURL(blobUrl);

        // compute features for native and user audio and compare
        try {
          const userMfcc = await getMfccFromArrayBuffer(
            await blob.arrayBuffer()
          );
          const nativeUrl = AllModules[topic][questionNum].audio;
          const nativeMfcc = await getMfccFromUrl(nativeUrl);

          // compute cosine similarity and apply aggressive scaling
          let similarity = cosineSimilarity(nativeMfcc, userMfcc);
          // clamp to [0,1]
          const simClamped = Math.max(0, Math.min(1, similarity || 0));
          // tuning constants: bias and exponent (power >1 makes scoring harsher)
          const SIM_BIAS = 0.06; // subtract small bias to penalize slight mismatches
          const SIM_POWER = 1.0; // higher -> more aggressive (3 is quite strict)
          const adj = Math.max(0, simClamped - SIM_BIAS);
          const percent = Math.round(
            Math.max(0, Math.min(100, Math.pow(adj, SIM_POWER) * 100))
          );

          let fb;
          if (percent > 88) fb = "🌟 Excellent pronunciation!";
          else if (percent > 70) fb = "👍 Pretty close!";
          else fb = "🗣️ Try again and focus on the tone.";

          setScore(percent);
          setFeedback(fb);
        } catch (err) {
          console.warn("feature extraction/compare failed:", err);
          setScore(0);
          setFeedback("Could not compute match. Try again.");
        }

        chunksRef.current = [];
        // stop and release the media stream tracks
        try {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;
          }
        } catch (err) {
          // ignore
        }

        mediaRecorderRef.current = null;
      })();
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    try {
      if (recorder.state === "recording") recorder.stop();
    } catch (err) {
      // ignore
    }
    setRecording(false);
  };

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
    setAudioURL(null);
    setScore(null);
    setFeedback("");
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
      <div className="flex items-center mt-4 w-full flex-col md:flex-row md:justify-between ">
        <h3 className="font-bold text-lg text-[white]">MODULE: {topic}</h3>
        <h3 className="font-bold text-lg align-end justify-end text-[white]">
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
        <div className="card p-2 md:max-w-3xl   ">
          <div {...handlers}>
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
                    width={16}
                    height={20}
                    className="inline-block object-contain hover:scale-110 hover:cursor-pointer"
                    onClick={handleToggleSave}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <div className="chat chat-end  ">
                    <div className="chat-bubble  bg-secondary text-4xl ">
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

                <hr />
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

                {/* <MirrorPronounce
                referenceUrl={AllModules[topic][questionNum].audio}
              /> */}

                <div className="flex items-center justify-end gap-2">
                  Record:
                  <button
                    onClick={recording ? stopRecording : startRecording}
                    className={` w-fit bg-[black]     hover:scale-110 transition-transform p-2 rounded-full   text-2xl text-right ${
                      recording ? "bg-[red]" : "bg-[black] "
                    } text-white`}
                  >
                    🎤
                  </button>
                </div>

                {audioURL && (
                  <div className="flex justify-end ">
                    <audio controls src={audioURL}></audio>
                  </div>
                )}
                {questionNum < 3 && (
                  <div className="text-sm italic text-right">
                    Note: User-recorded audio is not saved or shared.
                  </div>
                )}

                {/* {score !== null && (
                <div className="mt-3">
                  <div className="text-2xl font-bold text-amber-700">
                    Match: {score}%
                  </div>
                  <div className="text-lg mt-2 text-amber-800">{feedback}</div>
                  <div className="mt-3 w-full bg-amber-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full transition-all duration-700"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              )} */}
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
