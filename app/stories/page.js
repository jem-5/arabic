"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { db } from "@/firebase/config";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import MyButton from "@/components/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import StoryData from "@/data/stories/Stories";
export default function Stories() {
  const searchParams = useSearchParams();
  const [questionNum, setQuestionNum] = useState(0);
  const { user, isPaidMember, userProfile } = useAuthContext();
  const router = useRouter();
  const topic = searchParams.get("topic") || "FirstDay";
  const pathname = usePathname();
  const baseUrl = "https://arabicroad.com";
  const [animateIn, setAnimateIn] = useState(false);

  // const [approved, setApproved] = useState(false);

  const [storyData, setStoryData] = useState(StoryData);

  useEffect(() => {
    const canonicalUrl = `${baseUrl}${pathname}`;
    let link = document.querySelector("link[rel='canonical']");

    if (link) {
      link.setAttribute("href", canonicalUrl);
    } else {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonicalUrl);
      document.head.appendChild(link);
    }
  }, [pathname]);

  return (
    <main className="flex-grow flex flex-col items-center p-2 ">
      <div className="flex flex-row mt-2 w-full px-3 justify-between ">
        <h3 className="font-bold text-lg text-[white]">Stories Available </h3>

        {storyData.map((story) => {
          return (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="text-sm  bg-neutral p-2 rounded hover:scale-105 transition-transform"
            >
              {story.title}
            </Link>
          );
        })}
        {/* <h3 className="font-bold text-lg align-end justify-end text-[white]">
          {questionNum + 1} / {lessonData ? lessonData.length : null}
        </h3> */}
      </div>

      {/* <div className="card p-2 md:max-w-3xl relative">
        <div className="   card md:card-side    w-full shadow-xl bg-neutral z-5  ">
          <div className="card-body flex flex-col justify-start  w-3/4  ">
            <div className="text-2xl flex justify-between items-baseline gap-2">
              {lessonData ? lessonData[questionNum]?.arabic : null}
            </div>
            <div className="flex items-center justify-end w-3/4 rounded p-2">
              <div className="chat chat-end  ">
                <div className="  bg-secondary text-2xl text-[white] ">
                  {lessonData ? lessonData[questionNum].english : null}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 w-full ">
              Listen:
              <button
                className="text-2xl  bg-[black]    p-2 rounded-full hover:cursor-pointer hover:scale-110 transition-transform"
                onClick={playAudio}
              >
                🔊
              </button>
            </div>
          </div>
          <figure>
            <img
              className="w-1/2 sm:w-2/3 md:w-full   "
              src={lessonData?.[questionNum]?.image ?? null}
              alt="arabic greeting"
            />
          </figure>
        </div>

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
      </div> */}
      <MyButton
        text="Back to Dashboard"
        func={() => router.push("/dashboard")}
        classRest="h-12 bg-neutral"
      />
    </main>
  );
}
