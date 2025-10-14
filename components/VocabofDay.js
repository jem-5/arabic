"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const VocabofDay = ({ wordOfTheDay }) => {
  const playAudio = (src) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  return (
    <div className=" stats shadow mt-2 opacity-80 flex m-auto w-fit overflow-hidden hover:cursor-pointer">
      <div
        className="stat flex flew-row items-center justify-center"
        onClick={() => document.getElementById("vocabofday").showModal()}
      >
        <div className="stat-figure text-primary">
          <img src="/word.png" alt="vocab of the day" />
        </div>
        <div className="stat-title text-sm text-secondary">
          Vocab of the Day
        </div>
      </div>

      <dialog id="vocabofday" className="modal ">
        <div className="modal-box bg-secondary text-neutral">
          <h3 className="font-bold text-lg">Arabic Word/Phrase of the Day</h3>
          <h4>{new Date().toLocaleDateString()}</h4>
          <hr className="mt-2" />

          <div className=" ">
            <p className="text-2xl font-semibold text-neutral">
              {wordOfTheDay.arabic}
            </p>
            <p className="text-md text-neutral">
              {wordOfTheDay.english} —{" "}
              <span className="italic text-neutral">
                {wordOfTheDay.transliteration}
              </span>
            </p>
            <p className="text-sm text-neutral italic opacity-85 ">
              Module Name: {wordOfTheDay.module}
            </p>
            <button
              onClick={() => playAudio(wordOfTheDay.audio)}
              className="bg-[white] hover:bg-yellow-600 text-accent rounded-full p-2 shadow-md transition"
            >
              🔊
            </button>
          </div>

          <hr className="mt-2" />

          <p className="py-2">
            For more, check out the{" "}
            <a href={`/lesson?topic=${wordOfTheDay.module}`}>
              {wordOfTheDay.module} module
            </a>
            .
          </p>

          <p className="py-2">And check back tomorrow for a new word!</p>

          <div className="modal-action ">
            <form
              method="dialog"
              className="flex flex-col sm:flex-row gap-3 items-end"
            >
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
