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
    <main className="flex-grow flex flex-col justify-center items-center p-2 w-full ">
      <div className="flex flex-col mt-2 w-full px-3 justify-between ">
        <h3 className="font-bold text-lg text-[white] text-center mb-8">
          Stories Available
        </h3>

        <div className="grid grid-cols-1 justify-center items-stretch place-content-stretch place-items-center gap-3   md:grid-cols-2 lg:grid-cols-3 m-auto ">
          {storyData.map((story) => {
            return (
              <Link
                key={story.slug}
                href={`/stories/${story.slug}`}
                className="text-md  bg-neutral  hover:scale-105 transition-transform w-3/4  md:w-64 rounded p-3 text-center flex flex-col justify-center items-center"
              >
                {story.title}
                <Image
                  src={story.content[0].image}
                  alt={story.title}
                  width={150}
                  height={100}
                  className=" h-auto mt-2 rounded w-full "
                />
                {story.level === "Beginner" ? (
                  <div className="badge badge-success mt-2">{story.level}</div>
                ) : story.level === "Intermediate" ? (
                  <div className="badge badge-warning mt-2">{story.level}</div>
                ) : (
                  <div className="badge badge-error mt-2">{story.level}</div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <MyButton
        text="Back to Dashboard"
        func={() => router.push("/dashboard")}
        classRest="h-12 bg-neutral mt-32"
      />
    </main>
  );
}
