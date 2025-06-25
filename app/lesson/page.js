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
import { freeModules } from "@/data/AllModules";
import { useAuthContext } from "@/context/AuthContext";
import { Profile } from "@/components/Profile";
import MyButton from "@/components/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Lesson() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Greetings";
  const [questionNum, setQuestionNum] = useState(0);
  const { user, isPaidMember } = useAuthContext();
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
      console.log(canonicalUrl);
    }
  }, [pathname, topic]);

  const saveProgress = async () => {
    const usersRef = collection(db, "users");
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
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
    if (questionNum === AllModules[topic].length - 2 && user) {
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
    return `/images/mascots/${randomSelection}.jpg`;
  };

  return (
    <main className="flex-grow flex flex-col items-center p-2 ">
      <div className="flex items-center mt-4 w-full flex-col md:flex-row md:justify-between ">
        <h3 className="font-bold text-lg text-neutral">MODULE: {topic}</h3>
        <h3 className="font-bold text-lg align-end justify-end  text-neutral">
          {questionNum + 1} /{" "}
          {AllModules[topic] ? AllModules[topic].length : null}
        </h3>
      </div>
      <div className="divider"></div>

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
        <>
          <div className="card md:card-side bg-base-100 shadow-xl bg-neutral w-full ">
            <div className="card-body flex flex-col justify-between  ">
              <div className="text-2xl">
                {AllModules[topic]
                  ? AllModules[topic][questionNum].english
                  : null}
              </div>
              <span className="">
                <div className="chat chat-end text-2xl">
                  <div className="chat-bubble bg-secondary">
                    {AllModules[topic]
                      ? AllModules[topic][questionNum].arabic
                      : null}
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
                </div>
              </span>
              <div className="text-1xl text-right place-content-end">
                {AllModules[topic][questionNum].transliteration
                  ? AllModules[topic][questionNum].transliteration
                  : null}
              </div>
            </div>
            <figure>
              <img
                className="w-56"
                src={
                  AllModules[topic]
                    ? AllModules[topic][questionNum].image
                      ? AllModules[topic][questionNum].image
                      : chooseRandomMascot()
                    : null
                }
                alt="arabic greeting"
              />
            </figure>
          </div>

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
        </>
      )}
      <div className="divider "></div>

      <MyButton
        text="Go Back"
        func={() => router.push("/dashboard")}
        classRest="h-12 bg-neutral"
      />

      <Profile />
    </main>
  );
}
