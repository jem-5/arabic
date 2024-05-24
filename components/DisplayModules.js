"use client";

import React, { useEffect, useState } from "react";
import StartLesson from "./StartLesson";

export const DisplayModules = () => {
  const [lessonStarted, setLessonStarted] = useState(false);
  const allModules = [
    "Greetings",
    "Letters",
    "Animals",
    "Colors",
    "Numbers",
    "Weather",
    "Body",
    "House",
    "Foods",
    "Clothing",
    "Vacation",
    "School",
    "Jobs",
    "Verbs",
    "Prepositions",
    "Adjectives",
    "Restaurant",
    "Coffee Shop",
    "Clothing Store",
    "City",
    "Doctor",
    "Beauty Salon",
  ];
  const [module, setModule] = useState("Greetings");

  const DisplayLights = () => {
    return allModules.map((item, i) => {
      return (
        <button
          key={i}
          onClick={() => {
            document.getElementById("my_lesson_summary").showModal();
            setModule(item);
          }}
          className={
            i % 2 === 0
              ? "self-start"
              : i % 3 === 0
              ? "self-center"
              : "self-end"
          }
        >
          <div className="flex flex-col justify-center items-center">
            <span className="loading loading-ring loading-lg white"></span>
            <kbd className="kbd kbd-sm">{allModules[i]}</kbd>
          </div>
        </button>
      );
    });
  };

  const beginLesson = () => {
    setLessonStarted(true);
  };

  useEffect(() => {
    if (lessonStarted) document.getElementById("my_lesson").showModal();
  }, [lessonStarted]);
  return (
    <div className=" flex-grow flex flex-row gap-12 flex-wrap w-9/12 my-20 m-auto justify-center justify-self-end ">
      <DisplayLights />
      {lessonStarted ? <StartLesson module={module} /> : null}
      <dialog id="my_lesson_summary" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Module: {module}</h3>

          <p className="py-4">
            Learn the essentials of the {module} module with this lesson.
          </p>
          <div className="modal-action ">
            <form method="dialog">
              <button
                className="btn btn-active btn-secondary"
                onClick={beginLesson}
              >
                Begin Lesson
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
