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
      </div>

      <MyButton
        text="Back to Dashboard"
        func={() => router.push("/dashboard")}
        classRest="h-12 bg-neutral"
      />
    </main>
  );
}
