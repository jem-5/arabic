"use client";
import React from "react";
import { DisplayProfile } from "./DisplayProfile";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const DisplayStats = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <div className=" stats shadow mt-2 align-self-start justify-self-start opacity-80">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg
            className="inline-block w-8 h-8 stroke-current"
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
        <div className="stat-title">Total Modules</div>
        <div className="stat-value text-primary">15</div>
        <div className="stat-desc">General Lesson Topics</div>
      </div>

      <div className="stat">
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
        <div className="stat-title">Total Vocabulary</div>
        <div className="stat-value text-secondary">750</div>
        <div className="stat-desc">Words, Phrases & Sentences</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg
            class="w-8 h-8 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
        <div className="stat-value">0%</div>
        <div className="stat-title">Modules Completed</div>
        <div className="stat-desc text-secondary">
          {user ? (
            <button
              onClick={() => {
                document.getElementById("my_profile").showModal();
              }}
            >
              {" "}
              <p className="text-sm text-secondary">
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
          <DisplayProfile />
        </div>
      </div>
    </div>
  );
};
