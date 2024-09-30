"use client";
import React, { useEffect, useState } from "react";
import { Profile } from "./Profile";

import { useAuthContext } from "@/context/AuthContext";

import { AllModules, totalWords } from "@/data/AllModules";

export const Stats = ({ reviewedModules, completedModules }) => {
  const { user } = useAuthContext();
  const [percentComplete, setPercentComplete] = useState(
    ((reviewedModules.length / Object.keys(AllModules).length) * 100).toFixed(0)
  );

  useEffect(() => {
    setPercentComplete(
      (
        (completedModules.length / Object.keys(AllModules).length) *
        100
      ).toFixed(0)
    );
  }, [completedModules]);

  return (
    <div className=" stats shadow mt-2 opacity-80 flex  min-[1000px]:flex-row w-3/4 m-auto max-[999px]:w-full overflow-hidden  ">
      <div className="stat   max-[999px]:hidden">
        <div className="stat-figure text-primary ">
          <svg
            className="inline-block w-8 h-8 stroke-current "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
            />
          </svg>
        </div>
        <div className="stat-title max-[999px]:text-sm">Total Modules</div>
        <div className="stat-value text-secondary max-[999px]:text-md">
          {Object.keys(AllModules).length}
        </div>
        <div className="stat-desc max-[999px]:hidden">
          General Lesson Topics
        </div>
      </div>

      <div className="stat max-[999px]:hidden">
        <div className="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div className="stat-title max-[999px]:text-sm">Total Vocabulary</div>
        <div className="stat-value text-secondary max-[999px]:text-md">
          {totalWords}
        </div>
        <div className="stat-desc max-[999px]:hidden">
          Words, Phrases & Sentences
        </div>
      </div>

      <div className="stat ">
        <div className="stat-figure text-secondary">
          <svg
            className="w-8 h-8 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
        <div className="stat-value text-secondary max-[999px]:text-md">
          {user ? percentComplete : 0}%
        </div>
        <div className="stat-title max-[999px]:text-sm">Modules Completed</div>
        <div className="stat-desc text-secondary">
          {user ? (
            <button
              onClick={() => {
                document.getElementById("my_profile").showModal();
              }}
            >
              {" "}
              <p className="text-sm text-secondary ">
                Signed in as {user.email}
              </p>
            </button>
          ) : (
            <button
              onClick={() => {
                document.getElementById("my_profile").showModal();
              }}
            >
              Sign in to track your progress
            </button>
          )}
          <Profile />
        </div>
      </div>
    </div>
  );
};
