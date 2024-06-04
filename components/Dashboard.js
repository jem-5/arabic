"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AllModules } from "@/data/AllModules";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";
import { DisplayStats } from "./DisplayStats";

export const Dashboard = () => {
  const [module, setModule] = useState("Greetings");
  const { user } = useAuthContext();
  const [reviewedModules, setReviewedModules] = useState([]);

  const updateReviewedModules = async () => {
    // const usersRef = collection(db, "users");
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    setReviewedModules(
      userSnap._document.data.value.mapValue.fields.reviewedModules.arrayValue
        .values
    );
  };

  useEffect(() => {
    if (user) updateReviewedModules();
  }, []);

  const DisplayRoad = ({ chunk }) => {
    return chunk.map((item, i) => {
      return (
        <>
          <li>
            <hr className="bg-neutral" />

            <div className="timeline-middle ">
              {reviewedModules
                .map((item) => item.stringValue)
                .includes(item) ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-neutral absolute"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="loading loading-ring loading-md bg-neutral opacity-0"></span>
                </>
              ) : (
                <span className="loading loading-ring loading-md bg-neutral"></span>
              )}
            </div>

            <div className="timeline-end timeline-box">
              <button
                onClick={() => {
                  document.getElementById("my_lesson_summary").showModal();
                  setModule(item);
                }}
              >
                {chunk[i]}
              </button>
            </div>

            <hr className="bg-neutral" />
          </li>
        </>
      );
    });
  };

  const ShowRoads = () => {
    const chunkSize = 5;
    const roads = [];
    for (let i = 0; i < Object.keys(AllModules).length; i += chunkSize) {
      const chunk = Object.keys(AllModules).slice(i, i + chunkSize);
      roads.push(chunk);
    }
    return roads.map((road) => {
      return (
        <>
          <div>
            <ul className="timeline w-full flex justify-center ">
              <DisplayRoad chunk={road} />;
            </ul>
          </div>
        </>
      );
    });
  };

  return (
    <div className=" w-full ">
      <DisplayStats reviewedModules={reviewedModules} />
      <ShowRoads />

      <dialog id="my_lesson_summary" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Module: {module}</h3>

          <p className="py-4">
            Learn the essentials of the {module} module with this lesson.
          </p>
          <div className="modal-action ">
            <form method="dialog">
              <button className="btn btn-active btn-secondary">
                <Link href={{ pathname: "/lesson", query: { topic: module } }}>
                  Begin Lesson
                </Link>
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
                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  />
                </svg>
              </button>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
